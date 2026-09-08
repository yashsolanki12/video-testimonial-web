import React from "react";
import { Box, TextField, MenuItem } from "@mui/material";
import { FormDialog } from "../components/common/FormDialog";
import { VIDEO_TYPES, INITIAL_FORM_DATA } from "../utils/constant";

const TestimonialForm = ({
  open,
  selectedTestimonial,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = React.useState(INITIAL_FORM_DATA);

  React.useEffect(() => {
    if (open) {
      if (selectedTestimonial) {
        setFormData({
          title: selectedTestimonial.title,
          video_url: selectedTestimonial.video_url,
          video_type: selectedTestimonial.video_type,
        });
      } else {
        setFormData(INITIAL_FORM_DATA);
      }
    }
  }, [open, selectedTestimonial]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const handleClose = () => {
    setFormData(INITIAL_FORM_DATA);
    onClose();
  };

  return (
    <FormDialog
      open={open}
      title={selectedTestimonial ? "Edit Testimonial" : "Add Testimonial"}
      onClose={handleClose}
      onSubmit={handleSubmit}
      submitText={selectedTestimonial ? "Update" : "Create"}
      isLoading={isLoading}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <TextField
          label="Title"
          value={formData.title}
          onChange={handleChange("title")}
          fullWidth
          required
        />
        <TextField
          label="Video URL"
          value={formData.video_url}
          onChange={handleChange("video_url")}
          fullWidth
          required
          placeholder="https://www.youtube.com/watch?v=..."
        />
        <TextField
          select
          label="Video Type"
          value={formData.video_type}
          onChange={handleChange("video_type")}
          fullWidth
        >
          {VIDEO_TYPES.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>
    </FormDialog>
  );
};

export default TestimonialForm;
