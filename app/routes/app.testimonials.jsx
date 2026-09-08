import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";
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
import { Notification } from "../components/common/Notification";
import { useCurrentShopDomain } from "../utils/helper";
import NoDataFound from "../components/common/NoDataFound";
import TestimonialList from "../pages/testimonials/TestimonialList";
import TestimonialForm from "../pages/testimonials/TestimonialForm";
import TestimonialShimmer from "../pages/testimonials/TestimonialShimmer";
import ConfirmationDialog from "../components/confirmation-dialog";
import AddIcon from "@mui/icons-material/Add";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function TestimonialsPage() {
  const shopDomain = useCurrentShopDomain();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [snackBar, setSnackBar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { data: testimonialsResponse, isLoading } = useTestimonialData(
    ["testimonials"],
    getAllTestimonials,
    null,
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

  const handleOpenForm = (testimonial = null) => {
    setSelectedTestimonial(testimonial);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedTestimonial(null);
  };

  const handleSubmit = (formData) => {
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

  const handleToggle = (id) => {
    toggleMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 4 }}>
        <TestimonialShimmer count={4} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          sx={{ fontWeight: 600, color: "#202223" }}
        >
          Video Testimonials
        </Typography>
        <Button
          variant="contained"
          startIcon={
            createMutation.isPending ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <AddIcon />
            )
          }
          onClick={() => handleOpenForm()}
          disabled={createMutation.isPending}
          sx={{ backgroundColor: "black", textTransform: "none" }}
        >
          Add Testimonial
        </Button>
      </Box>

      <Card
        elevation={0}
        sx={{
          background: "#ffffff",
          border: "1px solid #e1e3e5",
          borderRadius: "12px",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {testimonials.length === 0 ? (
            <NoDataFound
              title="No testimonials found."
              description="Add your first video testimonial to get started."
              actionLabel="Add Testimonial"
              // onActionClick={() => handleOpenForm()}
            />
          ) : (
            <TestimonialList
              testimonials={testimonials}
              onEdit={handleOpenForm}
              onDelete={(t) => {
                setSelectedTestimonial(t);
                setIsDeleteDialogOpen(true);
              }}
              onToggle={handleToggle}
            />
          )}
        </CardContent>
      </Card>

      <TestimonialForm
        open={isFormOpen}
        selectedTestimonial={selectedTestimonial}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmationDialog
        open={isDeleteDialogOpen}
        title="Delete Testimonial"
        message={`Are you sure you want to delete "${selectedTestimonial?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDelete}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedTestimonial(null);
        }}
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
