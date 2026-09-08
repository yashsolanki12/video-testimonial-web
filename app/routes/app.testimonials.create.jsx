import { authenticate } from "../shopify.server";
import TestimonialFormPage from "../pages/testimonials/TestimonialFormPage";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function TestimonialsCreatePage() {
  return <TestimonialFormPage />;
}
