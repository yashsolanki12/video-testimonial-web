import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import AddIcon from "@mui/icons-material/Add";
import { authenticate } from "../shopify.server";
import { useTestimonialData } from "../hooks/useTestimonialData";
import { useTestimonialSubmit } from "../hooks/useTestimonialSubmit";
import {
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  toggleTestimonialActive,
} from "../api/testimonial";
import {
  ConfirmDialog,
  FormDialog,
  Notification,
  LoadingState,
  EmptyState,
} from "../components/common";
import { extractVideoEmbedUrl, useCurrentShopDomain } from "../utils/helper";

const MAX_TESTIMONIALS = 10;

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function TestimonialsPage() {
  const shopDomain = useCurrentShopDomain();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    video_url: "",
    video_type: "youtube",
  });
  const [snackBar, setSnackBar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { data: testimonialsResponse, isLoading } = useTestimonialData(
    ["testimonials"],
    getAllTestimonials,
    setSnackBar,
    { shopDomain },
  );

  const createMutation = useTestimonialSubmit(
    (data) => createTestimonial(data, shopDomain),
    setSnackBar,
    { invalidateKeys: [["testimonials"]] },
  );

  const updateMutation = useTestimonialSubmit(
    ({ id, data }) => updateTestimonial({ id, data, shopDomain }),
    setSnackBar,
    { invalidateKeys: [["testimonials"]] },
  );

  const deleteMutation = useTestimonialSubmit(
    (id) => deleteTestimonial(id, shopDomain),
    setSnackBar,
    { invalidateKeys: [["testimonials"]] },
  );

  const toggleMutation = useTestimonialSubmit(
    (id) => toggleTestimonialActive(id, shopDomain),
    setSnackBar,
    { invalidateKeys: [["testimonials"]] },
  );

  const testimonials = testimonialsResponse?.data || [];
  const canAddMore = testimonials.length < MAX_TESTIMONIALS;

  const handleOpenForm = (testimonial = null) => {
    if (testimonial) {
      setSelectedTestimonial(testimonial);
      setFormData({
        title: testimonial.title,
        video_url: testimonial.video_url,
        video_type: testimonial.video_type,
      });
    } else {
      setSelectedTestimonial(null);
      setFormData({ title: "", video_url: "", video_type: "youtube" });
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedTestimonial(null);
    setFormData({ title: "", video_url: "", video_type: "youtube" });
  };

  const handleSubmit = () => {
    if (selectedTestimonial) {
      updateMutation.mutate({ id: selectedTestimonial.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
    handleCloseForm();
  };

  const handleDelete = () => {
    if (selectedTestimonial) {
      deleteMutation.mutate(selectedTestimonial.id);
      setIsDeleteDialogOpen(false);
      setSelectedTestimonial(null);
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading testimonials..." />;
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
            Video Testimonials
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {testimonials.length} of {MAX_TESTIMONIALS} testimonials
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
          disabled={!canAddMore}
        >
          Add Testimonial
        </Button>
      </Box>

      {testimonials.length === 0 ? (
        <EmptyState
          title="No testimonials yet"
          message="Add your first video testimonial to get started."
          action={
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenForm()}
            >
              Add Testimonial
            </Button>
          }
        />
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} variant="outlined">
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flex: 1,
                    minWidth: 200,
                  }}
                >
                  <Box
                    sx={{
                      width: 120,
                      height: 68,
                      borderRadius: 1,
                      overflow: "hidden",
                      flexShrink: 0,
                      bgcolor: "grey.100",
                    }}
                  >
                    <iframe
                      src={extractVideoEmbedUrl(
                        testimonial.video_url,
                        testimonial.video_type,
                      )}
                      title={testimonial.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                      }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      {testimonial.title}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                      <Chip
                        label={testimonial.video_type.toUpperCase()}
                        size="small"
                        color={
                          testimonial.video_type === "youtube"
                            ? "error"
                            : testimonial.video_type === "vimeo"
                            ? "info"
                            : "success"
                        }
                        variant="outlined"
                      />
                      <Chip
                        label={testimonial.is_active ? "Active" : "Inactive"}
                        size="small"
                        color={testimonial.is_active ? "success" : "default"}
                      />
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenForm(testimonial)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => toggleMutation.mutate(testimonial.id)}
                  >
                    {testimonial.is_active ? (
                      <VisibilityIcon fontSize="small" />
                    ) : (
                      <VisibilityOffIcon fontSize="small" />
                    )}
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => {
                      setSelectedTestimonial(testimonial);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <FormDialog
        open={isFormOpen}
        title={selectedTestimonial ? "Edit Testimonial" : "Add Testimonial"}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        submitText={selectedTestimonial ? "Update" : "Create"}
        isLoading={createMutation.isPending || updateMutation.isPending}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField
            label="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            fullWidth
            required
          />
          <TextField
            label="Video URL"
            value={formData.video_url}
            onChange={(e) =>
              setFormData({ ...formData, video_url: e.target.value })
            }
            fullWidth
            required
            placeholder="https://www.youtube.com/watch?v=..."
          />
          <TextField
            select
            label="Video Type"
            value={formData.video_type}
            onChange={(e) =>
              setFormData({ ...formData, video_type: e.target.value })
            }
            fullWidth
            SelectProps={{ native: true }}
          >
            <option value="youtube">YouTube</option>
            <option value="vimeo">Vimeo</option>
            <option value="shopify">Shopify Video</option>
          </TextField>
        </Box>
      </FormDialog>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        title="Delete Testimonial"
        message={`Are you sure you want to delete "${selectedTestimonial?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setSelectedTestimonial(null);
        }}
        isLoading={deleteMutation.isPending}
      />

      <Notification
        open={snackBar.open}
        severity={snackBar.severity}
        message={snackBar.message}
        onClose={() => setSnackBar({ ...snackBar, open: false })}
      />
    </Box>
  );
}
