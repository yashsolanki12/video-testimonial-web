import {
  Box,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";

const SettingsForm = ({ formData, onChange }) => {
  const handleChange = (field) => (e) => {
    onChange({ ...formData, [field]: e.target.value });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Card
        elevation={0}
        sx={{
          background: "#f9fafb",
          border: "1px solid #e1e3e5",
          borderRadius: "12px",
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, mb: 0.5, color: "#202223" }}
          >
            Section Configuration
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Customize the appearance of your testimonial section
          </Typography>
          <TextField
            label="Section Title"
            value={formData.section_title}
            onChange={handleChange("section_title")}
            fullWidth
            required
            helperText="This title will be displayed above your testimonials"
          />
        </CardContent>
      </Card>

      <Card
        elevation={0}
        sx={{
          background: "#f9fafb",
          border: "1px solid #e1e3e5",
          borderRadius: "12px",
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, mb: 0.5, color: "#202223" }}
          >
            Display Layout
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Choose how testimonials are displayed
          </Typography>
          <FormControl>
            <FormLabel>Layout Type</FormLabel>
            <RadioGroup
              value={formData.display_layout}
              onChange={handleChange("display_layout")}
            >
              <FormControlLabel
                value="slider"
                control={<Radio />}
                label="Slider"
                sx={{ fontSize: 14, "& .MuiTypography-root": { fontSize: "inherit" } }}
              />
              <FormControlLabel
                value="grid"
                control={<Radio />}
                label="Grid (2 columns)"
                sx={{ fontSize: 14, "& .MuiTypography-root": { fontSize: "inherit" } }}
              />
            </RadioGroup>
          </FormControl>
        </CardContent>
      </Card>

      {formData.display_layout === "slider" && (
        <Card
          elevation={0}
          sx={{
            background: "#f9fafb",
            border: "1px solid #e1e3e5",
            borderRadius: "12px",
          }}
        >
          <CardContent sx={{ p: 2 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, mb: 0.5, color: "#202223" }}
            >
              Slider Effect
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Choose the transition effect for the slider
            </Typography>
            <FormControl>
              <FormLabel>Transition Effect</FormLabel>
              <RadioGroup
                value={formData.slider_effect}
                onChange={handleChange("slider_effect")}
              >
                <FormControlLabel
                  value="standard"
                  control={<Radio />}
                  label="Standard Slide"
                  sx={{ fontSize: 14, "& .MuiTypography-root": { fontSize: "inherit" } }}
                />
                <FormControlLabel
                  value="fade"
                  control={<Radio />}
                  label="Fade Transition"
                  sx={{ fontSize: 14, "& .MuiTypography-root": { fontSize: "inherit" } }}
                />
                <FormControlLabel
                  value="carousel"
                  control={<Radio />}
                  label="Carousel / Continuous Slide"
                  sx={{ fontSize: 14, "& .MuiTypography-root": { fontSize: "inherit" } }}
                />
              </RadioGroup>
            </FormControl>
          </CardContent>
        </Card>
      )}

      <Card
        elevation={0}
        sx={{
          background: "#f9fafb",
          border: "1px solid #e1e3e5",
          borderRadius: "12px",
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, mb: 0.5, color: "#202223" }}
          >
            Slider Effect
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            See how your settings will look
          </Typography>
          <Box
            sx={{
              p: 3,
              border: "1px dashed",
              borderColor: "#e1e3e5",
              borderRadius: "8px",
              textAlign: "center",
              bgcolor: "#ffffff",
            }}
          >
            <Typography variant="h5" gutterBottom>
              {formData.section_title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Layout:{" "}
              {formData.display_layout === "grid" ? "2-Column Grid" : "Slider"}
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
  );
};

export default SettingsForm;
