import React from "react";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import TestimonialShimmer from "../pages/testimonials/TestimonialShimmer";

const TestimonialsPage = React.lazy(() => import("./app.testimonials._index"));

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
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
