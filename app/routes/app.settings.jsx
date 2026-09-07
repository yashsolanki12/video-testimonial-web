import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { authenticate } from "../shopify.server";
import { useTestimonialData } from "../hooks/useTestimonialData";
import { useTestimonialSubmit } from "../hooks/useTestimonialSubmit";
import { getSettings, updateSettings } from "../api/settings";
import { Notification, LoadingState } from "../components/common";
import { useCurrentShopDomain } from "../utils/helper";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function SettingsPage() {
  const shopDomain = useCurrentShopDomain();
  const [formData, setFormData] = useState({
    section_title: "Video Testimonials",
    slider_effect: "standard",
    display_layout: "slider",
  });
  const [snackBar, setSnackBar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { data: settingsResponse, isLoading } = useTestimonialData(
    ["settings"],
    getSettings,
    setSnackBar,
    { shopDomain },
  );

  const updateMutation = useTestimonialSubmit(
    (data) => updateSettings(data, shopDomain),
    setSnackBar,
    { invalidateKeys: [["settings"]] },
  );

  useEffect(() => {
    if (settingsResponse?.data) {
      const settings = settingsResponse.data;
      setFormData({
        section_title: settings.section_title,
        slider_effect: settings.slider_effect,
        display_layout: settings.display_layout,
      });
    }
  }, [settingsResponse]);

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return <LoadingState message="Loading settings..." />;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Settings
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Configure your video testimonial section
          </Typography>
        </Box>
        <s-button
          variant="primary"
          onClick={handleSave}
          loading={updateMutation.isPending}
        >
          Save Changes
        </s-button>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          maxWidth: 600,
        }}
      >
        <Card variant="outlined">
          <CardHeader
            title="Section Configuration"
            subheader="Customize the appearance of your testimonial section"
          />
          <Divider />
          <CardContent>
            <TextField
              label="Section Title"
              value={formData.section_title}
              onChange={(e) =>
                setFormData({ ...formData, section_title: e.target.value })
              }
              fullWidth
              required
              helperText="This title will be displayed above your testimonials"
            />
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardHeader
            title="Display Layout"
            subheader="Choose how testimonials are displayed"
          />
          <Divider />
          <CardContent>
            <FormControl>
              <FormLabel>Layout Type</FormLabel>
              <RadioGroup
                value={formData.display_layout}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    display_layout: e.target.value,
                  })
                }
              >
                <FormControlLabel
                  value="slider"
                  control={<Radio />}
                  label="Slider"
                />
                <FormControlLabel
                  value="grid"
                  control={<Radio />}
                  label="Grid (2 columns)"
                />
              </RadioGroup>
            </FormControl>
          </CardContent>
        </Card>

        {formData.display_layout === "slider" && (
          <Card variant="outlined">
            <CardHeader
              title="Slider Effect"
              subheader="Choose the transition effect for the slider"
            />
            <Divider />
            <CardContent>
              <FormControl>
                <FormLabel>Transition Effect</FormLabel>
                <RadioGroup
                  value={formData.slider_effect}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      slider_effect: e.target.value,
                    })
                  }
                >
                  <FormControlLabel
                    value="standard"
                    control={<Radio />}
                    label="Standard Slide"
                  />
                  <FormControlLabel
                    value="fade"
                    control={<Radio />}
                    label="Fade Transition"
                  />
                  <FormControlLabel
                    value="carousel"
                    control={<Radio />}
                    label="Carousel / Continuous Slide"
                  />
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>
        )}

        <Card variant="outlined">
          <CardHeader
            title="Preview"
            subheader="See how your settings will look"
          />
          <Divider />
          <CardContent>
            <Box
              sx={{
                p: 3,
                border: "1px dashed",
                borderColor: "divider",
                borderRadius: 1,
                textAlign: "center",
              }}
            >
              <Typography variant="h5" gutterBottom>
                {formData.section_title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Layout:{" "}
                {formData.display_layout === "grid"
                  ? "2-Column Grid"
                  : "Slider"}
                {formData.display_layout === "slider" &&
                  ` | Effect: ${
                    formData.slider_effect === "standard"
                      ? "Standard Slide"
                      : formData.slider_effect === "fade"
                      ? "Fade Transition"
                      : "Carousel"
                  }`}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Notification
        open={snackBar.open}
        severity={snackBar.severity}
        message={snackBar.message}
        onClose={() => setSnackBar({ ...snackBar, open: false })}
      />
    </Box>
  );
}
