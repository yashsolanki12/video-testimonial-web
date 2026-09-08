import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { authenticate } from "../shopify.server";
import { useTestimonialData } from "../hooks/useTestimonialData";
import { useTestimonialSubmit } from "../hooks/useTestimonialSubmit";
import {
  getAllTestimonials,
  deleteTestimonial,
  toggleTestimonialActive,
  reorderTestimonials,
} from "../api/testimonial";
import { Notification } from "../components/common/Notification";
import { useCurrentShopDomain } from "../utils/helper";
import NoDataFound from "../components/common/NoDataFound";
import TestimonialList from "../pages/testimonials/TestimonialList";
import TestimonialShimmer from "../pages/testimonials/TestimonialShimmer";
import ConfirmationDialog from "../components/confirmation-dialog";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function TestimonialsIndexPage() {
  const shopDomain = useCurrentShopDomain();
  const navigate = useNavigate();
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

  const reorderMutation = useTestimonialSubmit(
    (orderedIds) => reorderTestimonials(orderedIds, shopDomain),
    setSnackBar,
    { invalidateKeys: [["testimonials"]] },
  );

  const testimonials = testimonialsResponse?.data || [];

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

  const handleReorder = (orderedIds) => {
    reorderMutation.mutate(orderedIds);
  };

  if (isLoading) {
    return <TestimonialShimmer count={4} />;
  }

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 110px)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          flexShrink: 0,
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
          startIcon={<AddIcon />}
          onClick={() => navigate("/app/testimonials/create")}
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
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <CardContent
          sx={{
            p: { xs: 2, sm: 3 },
            flex: 1,
            minHeight: 0,
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {testimonials.length === 0 ? (
            <NoDataFound
              title="No testimonials found."
              description="Add your first video testimonial to get started."
              actionLabel="Add Testimonial"
              // onActionClick={() => navigate("/app/testimonials/create")}
            />
          ) : (
            <TestimonialList
              testimonials={testimonials}
              onEdit={(t) => navigate(`/app/testimonials/${t.id}`)}
              onDelete={(t) => {
                setSelectedTestimonial(t);
                setIsDeleteDialogOpen(true);
              }}
              onToggle={handleToggle}
              onReorder={handleReorder}
            />
          )}
        </CardContent>
      </Card>

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
