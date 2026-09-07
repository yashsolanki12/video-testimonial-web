import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { authenticate } from "../shopify.server";
import { useTestimonialData } from "../hooks/useTestimonialData";
import { getActiveTestimonials } from "../api/testimonial";
import { getPublicSettings } from "../api/settings";
import VideoTestimonialSection from "../components/VideoTestimonialSection";
import { LoadingState } from "../components/common";
import { useCurrentShopDomain } from "../utils/helper";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function StorefrontPreviewPage() {
  const shopDomain = useCurrentShopDomain();
  const [, setSnackBar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { data: testimonialsResponse, isLoading: testimonialsLoading } =
    useTestimonialData(
      ["testimonials", "active"],
      getActiveTestimonials,
      setSnackBar,
      { shopDomain },
    );

  const { data: settingsResponse, isLoading: settingsLoading } =
    useTestimonialData(
      ["settings", "public"],
      getPublicSettings,
      setSnackBar,
      { shopDomain },
    );

  if (testimonialsLoading || settingsLoading) {
    return <LoadingState message="Loading storefront preview..." />;
  }

  const testimonials = testimonialsResponse?.data || [];
  const settings = settingsResponse?.data;

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Storefront Preview
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Preview how the video testimonial section will look on your store
        </Typography>
      </Box>

      <Box
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          overflow: "hidden",
          bgcolor: "background.paper",
        }}
      >
        {settings ? (
          <VideoTestimonialSection
            testimonials={testimonials}
            settings={settings}
          />
        ) : (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body1" color="text.secondary">
              Configure your settings first to see the preview.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
