import React from "react";
import { Outlet, useLoaderData, useRouteError } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { AppProvider } from "@shopify/shopify-app-react-router/react";
import { authenticate, sessionStorage } from "../shopify.server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
  
    const backendUrl =
      // eslint-disable-next-line no-undef
      process.env.VITE_BACKEND_API_URL || "http://localhost:5000";
    fetch(`${backendUrl}/api/auth/post-setup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shop: session.shop }),
    }).catch((err) => console.error("[App] Post-setup failed:", err.message));
  }

 
  return {
    // eslint-disable-next-line no-undef
    apiKey: process.env.SHOPIFY_API_KEY || "",
    shop: session?.shop || "",
  };
};

export default function App() {
  const { apiKey } = useLoaderData();

  const queryClient = React.useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 10,
            refetchOnWindowFocus: false,
            enabled: typeof window !== "undefined",
          },
        },
      }),
    [],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider embedded apiKey={apiKey}>
        <s-app-nav>
          <s-link href="/app/testimonials">Testimonials</s-link>
          <s-link href="/app/settings">Settings</s-link>
        </s-app-nav>
        <Outlet />
      </AppProvider>
    </QueryClientProvider>
  );
}

export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
