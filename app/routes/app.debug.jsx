import { useLoaderData, Form } from "react-router";
import { authenticate } from "../shopify.server";
import shopify from "../shopify.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  try {
    // Fetch main theme using raw fetch
    const themesResponse = await fetch(
      `https://${session.shop}/admin/api/2026-04/themes.json?role=main`,
      {
        headers: {
          "X-Shopify-Access-Token": session.accessToken,
          "Content-Type": "application/json",
        },
      },
    );

    if (!themesResponse.ok) {
      const errorText = await themesResponse.text();
      return {
        error: "Theme fetch failed",
        status: themesResponse.status,
        details: errorText,
        sessionDebug: {
          shop: session?.shop,
          scopes: session?.scope,
          // eslint-disable-next-line no-undef
          configuredScopes: process.env.SCOPES,
          hasToken: !!session?.accessToken,
          tokenStart: session?.accessToken
            ? session.accessToken.substring(0, 10) + "..."
            : null,
        },
      };
    }

    const themesData = await themesResponse.json();

    if (!themesData.themes || themesData.themes.length === 0) {
      return {
        appEmbedEnabled: false,
        session: session,
        error: "No main theme found in response",
        response: themesData,
      };
    }

    const mainTheme = themesData.themes[0];

    // Fetch settings_data.json
    const assetsResponse = await fetch(
      `https://${session.shop}/admin/api/2026-04/themes/${mainTheme.id}/assets.json?asset[key]=config/settings_data.json`,
      {
        headers: {
          "X-Shopify-Access-Token": session.accessToken,
          "Content-Type": "application/json",
        },
      },
    );

    const assetData = await assetsResponse.json();
    const asset = assetData.asset;

    if (!asset || !asset.value) {
      return { error: "No settings_data.json found" };
    }

    const settings = JSON.parse(asset.value);

    // Logic Simulation
    const simulation = {
      foundBlocks: [],
      finalDecision: false,
      logs: [],
    };

    if (settings.current && settings.current.blocks) {
      const rawBlocks = settings.current.blocks;
      simulation.logs.push(
        `Total blocks in settings: ${Object.keys(rawBlocks).length}`,
      );

      const uspBarBlocks = Object.keys(rawBlocks)
        .filter((key) => {
          const block = rawBlocks[key];
          const isMatch =
            block.type && block.type.includes("video_testimonial_app");
          if (isMatch)
            simulation.logs.push(
              `Found matching block: ${key} (${block.type})`,
            );
          return isMatch;
        })
        .map((key) => ({ ...rawBlocks[key], id: key }));

      simulation.foundBlocks = uspBarBlocks;

      if (uspBarBlocks.length > 0) {
        const isAnyEnabled = uspBarBlocks.some((block) => {
          const isAppEmbedOn = !block.disabled;
          const isInnerSettingOn = block.settings.enabled !== false;
          simulation.logs.push(
            `Block ${block.id}: AppEmbedOn=${isAppEmbedOn}, InnerSettingOn=${isInnerSettingOn}`,
          );
          return isAppEmbedOn && isInnerSettingOn;
        });
        simulation.finalDecision = isAnyEnabled;
      } else {
        simulation.logs.push(
          "No blocks matching 'video_testimonial_app' found.",
        );
      }
    }

    return {
      shop: session?.shop,
      settings: settings,
      raw: asset.value,
      simulation,
    };
  } catch (error) {
    return {
      error: error.message,
      stack: error.stack,
      sessionDebug: {
        shop: session?.shop,
        scopes: session?.scope,
        hasToken: !!session?.accessToken,
        tokenStart: session?.accessToken
          ? session.accessToken.substring(0, 10) + "..."
          : null,
      },
    };
  }
};

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  await shopify.sessionStorage.deleteSession(session.id);
  return new Response(null, {
    status: 302,
    headers: {
      Location: `/auth/login?shop=${session.shop}`,
    },
  });
};

export default function Debug() {
  const data = useLoaderData();
  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h1>Debug Settings Data</h1>

      <div
        style={{
          padding: "15px",
          background: "#f0f0f0",
          marginBottom: "20px",
          borderRadius: "5px",
        }}
      >
        <h2>Logic Simulation</h2>
        <p>
          <strong>Should Icon Be Visible?</strong>:{" "}
          <span
            style={{
              color: data.simulation?.finalDecision ? "green" : "red",
              fontWeight: "bold",
              fontSize: "1.2em",
            }}
          >
            {data.simulation?.finalDecision ? "YES" : "NO"}
          </span>
        </p>

        <h4>Details:</h4>
        <ul>
          {data.simulation?.logs.map((log, i) => (
            <li key={i}>{log}</li>
          ))}
        </ul>

        <h4>Found Blocks:</h4>
        <pre>{JSON.stringify(data.simulation?.foundBlocks, null, 2)}</pre>
      </div>
      {data.error && (
        <div
          style={{
            color: "red",
            border: "1px solid red",
            padding: "10px",
            marginBottom: "20px",
          }}
        >
          <h3>Error: {data.error}</h3>
          {data.details && <pre>{data.details}</pre>}
          {data.sessionDebug && (
            <div>
              <h4>Session Debug:</h4>
              <pre>{JSON.stringify(data.sessionDebug, null, 2)}</pre>
              {JSON.stringify(data.sessionDebug.scopes) !==
                JSON.stringify(data.sessionDebug.configuredScopes) && (
                <div style={{ marginTop: "10px" }}>
                  <p>
                    <strong>Permissions Mismatch Detected!</strong>
                  </p>
                  <p>
                    <strong>Permissions Mismatch Detected!</strong>
                  </p>
                  <Form method="post">
                    <button
                      type="submit"
                      style={{
                        display: "inline-block",
                        backgroundColor: "red",
                        color: "white",
                        padding: "10px 20px",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      Force Reset Session & Permissions
                    </button>
                  </Form>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
