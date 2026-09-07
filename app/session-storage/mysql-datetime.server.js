import { Session } from "@shopify/shopify-api";
import { MySQLSessionStorage } from "@shopify/shopify-app-session-storage-mysql";

export class MySQLDatetimeSessionStorage extends MySQLSessionStorage {
  constructor(dbUrl, opts = {}) {
    super(dbUrl, opts);
    this.ready = this.ready.then(async () => {
      await this._migrateColumns();
    });
  }

  async _migrateColumns() {
    const tableName = this.options.sessionTableName;
    const tableExists = await this.connection.hasTable(tableName);
    if (!tableExists) return;

    const columnType = async (columnName) => {
      const [rows] = await this.connection.query(
        `SELECT DATA_TYPE
         FROM INFORMATION_SCHEMA.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE()
           AND TABLE_NAME = ?
           AND COLUMN_NAME = ?`,
        [tableName, columnName]
      );
      return Array.isArray(rows) && rows.length > 0 ? rows[0].DATA_TYPE : null;
    };

    const expiresType = await columnType("expires");
    if (expiresType && expiresType !== "datetime") {
      await this.connection.query(
        `UPDATE \`${tableName}\` SET expires = FROM_UNIXTIME(expires) WHERE expires IS NOT NULL`
      );
      await this.connection.query(
        `ALTER TABLE \`${tableName}\` MODIFY COLUMN expires DATETIME`
      );
    }

    const refreshType = await columnType("refreshTokenExpires");
    if (refreshType && refreshType !== "datetime") {
      await this.connection.query(
        `UPDATE \`${tableName}\` SET refreshTokenExpires = FROM_UNIXTIME(refreshTokenExpires) WHERE refreshTokenExpires IS NOT NULL`
      );
      await this.connection.query(
        `ALTER TABLE \`${tableName}\` MODIFY COLUMN refreshTokenExpires DATETIME`
      );
    }

    const createdAtType = await columnType("created_at");
    if (!createdAtType) {
      await this.connection.query(
        `ALTER TABLE \`${tableName}\` ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP`
      );
    }

    const updatedAtType = await columnType("updated_at");
    if (!updatedAtType) {
      await this.connection.query(
        `ALTER TABLE \`${tableName}\` ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`
      );
    }

    const stateInfo = await columnType("state");
    if (stateInfo) {
      const [rows] = await this.connection.query(
        `SELECT COLUMN_DEFAULT FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = 'state'`,
        [tableName]
      );
      if (Array.isArray(rows) && rows.length > 0 && rows[0].COLUMN_DEFAULT === null) {
        await this.connection.query(
          `ALTER TABLE \`${tableName}\` MODIFY COLUMN state varchar(255) DEFAULT ''`
        );
      }
    }

    const shopInfoColumns = [
      { name: "firstName", type: "varchar(255)" },
      { name: "lastName", type: "varchar(255)" },
      { name: "email", type: "varchar(255)" },
      { name: "accountOwner", type: "tinyint" },
      { name: "locale", type: "varchar(255)" },
      { name: "collaborator", type: "tinyint" },
      { name: "emailVerified", type: "tinyint" },
    ];
    for (const col of shopInfoColumns) {
      const existing = await columnType(col.name);
      if (!existing) {
        await this.connection.query(
          `ALTER TABLE \`${tableName}\` ADD COLUMN \`${col.name}\` ${col.type}`
        );
      }
    }
  }

  async storeSession(session) {
    await this.ready;
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");
    const entries = session.toPropertyArray(true)
      .filter(([key]) => key !== "userId" && key !== "state")
      .map(([key, value]) => {
        if (key === "expires" || key === "refreshTokenExpires") {
          if (value) {
            const date = new Date(value);
            return [key, date.toISOString().slice(0, 19).replace("T", " ")];
          }
          return [key, null];
        }
        return [key, value];
      });

    const columns = entries.map(([key]) => key);
    const placeholders = entries.map(() => this.connection.getArgumentPlaceholder());
    const values = entries.map(([, value]) => value);
    const updateClauses = columns.map((col) => `\`${col}\` = VALUES(\`${col}\`)`).join(", ");

    const query = `
      INSERT INTO ${this.options.sessionTableName}
      (${columns.join(", ")}, \`created_at\`, \`updated_at\`)
      VALUES (${placeholders.join(", ")}, ${this.connection.getArgumentPlaceholder()}, ${this.connection.getArgumentPlaceholder()})
      ON DUPLICATE KEY UPDATE
        ${updateClauses},
        \`updated_at\` = ${this.connection.getArgumentPlaceholder()}
    `;
    await this.connection.query(query, [...values, now, now, now]);
    return true;
  }

  async loadSession(id) {
    await this.ready;
    const query = `SELECT * FROM \`${this.options.sessionTableName}\` WHERE id = ${this.connection.getArgumentPlaceholder()};`;
    const [rows] = await this.connection.query(query, [id]);
    if (!Array.isArray(rows) || rows?.length !== 1) return undefined;
    return this._rowToSession(rows[0]);
  }

  async findSessionsByShop(shop) {
    await this.ready;
    const query = `SELECT * FROM ${this.options.sessionTableName} WHERE shop = ${this.connection.getArgumentPlaceholder()};`;
    const [rows] = await this.connection.query(query, [shop]);
    if (!Array.isArray(rows) || rows?.length === 0) return [];
    return rows.map((row) => this._rowToSession(row));
  }

  async hasShopInfo(sessionId) {
    await this.ready;
    const tableName = this.options.sessionTableName;
    const [rows] = await this.connection.query(
      `SELECT firstName FROM \`${tableName}\` WHERE id = ?`, [sessionId]
    );
    return Array.isArray(rows) && rows.length > 0 && rows[0].firstName != null;
  }

  async updateShopInfo(sessionId, shopInfo) {
    await this.ready;
    const tableName = this.options.sessionTableName;
    const query = `
      UPDATE \`${tableName}\`
      SET firstName = ?, lastName = ?, email = ?, accountOwner = ?, locale = ?, collaborator = ?, emailVerified = ?
      WHERE id = ?
    `;
    await this.connection.query(query, [
      shopInfo.firstName || null, shopInfo.lastName || null, shopInfo.email || null,
      shopInfo.accountOwner ? 1 : 0, shopInfo.locale || null,
      shopInfo.collaborator ? 1 : 0, shopInfo.emailVerified ? 1 : 0, sessionId,
    ]);
  }

  async deleteSession(id) {
    await this.ready;
    const query = `DELETE FROM \`${this.options.sessionTableName}\` WHERE id = ${this.connection.getArgumentPlaceholder()};`;
    await this.connection.query(query, [id]);
    return true;
  }

  async deleteSessions(ids) {
    await this.ready;
    if (ids.length === 0) return true;
    const placeholders = ids.map(() => this.connection.getArgumentPlaceholder()).join(", ");
    const query = `DELETE FROM \`${this.options.sessionTableName}\` WHERE id IN (${placeholders});`;
    await this.connection.query(query, ids);
    return true;
  }

  _rowToSession(row) {
    if (row.expires) {
      if (row.expires instanceof Date) { row.expires = row.expires.getTime(); }
      else { const d = new Date(row.expires + "Z"); row.expires = d.getTime(); }
    }
    if (row.refreshTokenExpires) {
      if (row.refreshTokenExpires instanceof Date) { row.refreshTokenExpires = row.refreshTokenExpires.getTime(); }
      else { const d = new Date(row.refreshTokenExpires + "Z"); row.refreshTokenExpires = d.getTime(); }
    }
    delete row.created_at; delete row.updated_at; delete row.userId;
    delete row.state; delete row.firstName; delete row.lastName;
    delete row.email; delete row.accountOwner; delete row.locale;
    delete row.collaborator; delete row.emailVerified;
    return Session.fromPropertyArray(Object.entries(row), true);
  }

  async createTable() {
    const hasSessionTable = await this.connection.hasTable(this.options.sessionTableName);
    if (!hasSessionTable) {
      const query = `
        CREATE TABLE ${this.options.sessionTableName} (
          id varchar(255) NOT NULL PRIMARY KEY,
          shop varchar(255) NOT NULL,
          isOnline tinyint NOT NULL,
          scope varchar(1024),
          expires DATETIME,
          accessToken varchar(255),
          state varchar(255) DEFAULT '',
          refreshToken varchar(255),
          refreshTokenExpires DATETIME,
          firstName varchar(255),
          lastName varchar(255),
          email varchar(255),
          accountOwner tinyint,
          locale varchar(255),
          collaborator tinyint,
          emailVerified tinyint,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `;
      await this.connection.query(query);
    }
  }
}
