import React from "react";
import { Outlet, useLoaderData, useRouteError } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { AppProvider } from "@shopify/shopify-app-react-router/react";
import { authenticate, sessionStorage } from "../shopify.server";
import { authPostSync } from "../api/auth";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);

  if (session) {
    const hasInfo = await sessionStorage
      .hasShopInfo(session.id)
      .catch(() => false);
    if (!hasInfo) {
      try {
        const response = await fetch(
          `https://${session.shop}/admin/api/2026-07/shop.json`,
          {
            headers: {
              "X-Shopify-Access-Token": session.accessToken,
              "Content-Type": "application/json",
            },
          },
        );
        const data = await response.json();
        const shopData = data.shop;

        if (shopData) {
          const fullName = shopData.shop_owner || "";
          const nameParts = fullName.trim().split(/\s+/);
          await sessionStorage.updateShopInfo(session.id, {
            firstName: nameParts[0] || "",
            lastName: nameParts.slice(1).join(" ") || "",
            email: shopData.email || "",
            accountOwner: true,
            locale: shopData.locale || "",
            collaborator: false,
            emailVerified: true,
          });
        }
      } catch (err) {
        console.error("[App] Failed to fetch shop info:", err.message);
      }
    }
  }
  return {
    // eslint-disable-next-line no-undef
    apiKey: process.env.SHOPIFY_API_KEY || "",
    shop: session?.shop || "",
  };
};

export default function App() {
  const { apiKey, shop } = useLoaderData();

  React.useEffect(() => {
    if (!shop) return;
    const key = `auth_post_sync_${shop}`;
    if (!localStorage.getItem(key)) {
      authPostSync(shop)
        .then(() => localStorage.setItem(key, "true"))
        .catch((error) => console.error("[App] Auth post sync failed:", error));
    }
  }, [shop]);

  return (
    <AppProvider embedded apiKey={apiKey}>
      <s-app-nav>
        <s-link href="/app">Home</s-link>
        <s-link href="/app/testimonials">Testimonials</s-link>
        <s-link href="/app/settings">Settings</s-link>
        <s-link href="/app/storefront">Storefront Preview</s-link>
      </s-app-nav>
      <Outlet />
    </AppProvider>
  );
}

// Shopify needs React Router to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
