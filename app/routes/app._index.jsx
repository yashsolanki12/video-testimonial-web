import React from "react";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import TestimonialShimmer from "../pages/testimonials/TestimonialShimmer";

const TestimonialsPage = React.lazy(() => import("./app.testimonials._index"));

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  try {
    const themesResponse = await fetch(
      `https://${session.shop}/admin/api/2026-10/themes.json?role=main`,
      {
        headers: {
          "X-Shopify-Access-Token": session.accessToken,
          "Content-Type": "application/json",
        },
      },
    );

    if (!themesResponse.ok) {
      return { appEmbedEnabled: false, session: session };
    }

    const themesData = await themesResponse.json();

    if (!themesData.themes || themesData.themes.length === 0) {
      return { appEmbedEnabled: false, session: session };
    }

    const mainTheme = themesData.themes[0];

    const assetsResponse = await fetch(
      `https://${session.shop}/admin/api/2026-10/themes/${mainTheme.id}/assets.json?asset[key]=config/settings_data.json`,
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
      return { appEmbedEnabled: false, session: session };
    }

    const settings = JSON.parse(asset.value);

    let appEmbedEnabled = false;

    if (settings.current && settings.current.blocks) {
      const rawBlocks = settings.current.blocks;
      const matchingBlocks = Object.keys(rawBlocks).filter((key) => {
        const block = rawBlocks[key];
        return block.type && block.type.includes("video_testimonial_app");
      });

      if (matchingBlocks.length > 0) {
        appEmbedEnabled = matchingBlocks.some((key) => {
          const block = rawBlocks[key];
          return !block.disabled && block.settings.enabled !== false;
        });
      }
    }

    return {
      appEmbedEnabled: appEmbedEnabled,
      session: session,
    };
  } catch (error) {
    return {
      appEmbedEnabled: false,
      session: session,
      error: error.message,
    };
  }
};

export default function Index() {
  return (
    <React.Suspense fallback={<TestimonialShimmer />}>
      <TestimonialsPage />
    </React.Suspense>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
