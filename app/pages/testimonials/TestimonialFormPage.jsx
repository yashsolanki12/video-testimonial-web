import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTestimonialData } from "../../hooks/useTestimonialData";
import { useTestimonialSubmit } from "../../hooks/useTestimonialSubmit";
import {
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
} from "../../api/testimonial";
import { Notification } from "../../components/common/Notification";
import { useCurrentShopDomain, detectVideoType } from "../../utils/helper";
import { useNavigate, useParams } from "react-router";
import ShopifyMediaDialog from "../../components/ShopifyMediaDialog";

const INITIAL_FORM_DATA = {
  title: "",
  video_url: "",
  video_type: "other",
};

const TestimonialFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const shopDomain = useCurrentShopDomain();
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [snackBar, setSnackBar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);

  const isEdit = Boolean(id);

  const { data: testimonialResponse, isLoading } = useTestimonialData(
    ["testimonial", id],
    () => getTestimonialById(id, shopDomain),
    null,
    { shopDomain, enabled: isEdit },
  );

  const submitMutation = useTestimonialSubmit(
    ({ data, testimonialId }) =>
      testimonialId
        ? updateTestimonial({ id: testimonialId, data, shopDomain })
        : createTestimonial(data, shopDomain),
    setSnackBar,
    {
      invalidateKeys: [["testimonials"]],
      onSuccess: () => {
        navigate("/app/testimonials");
      },
    },
  );

  useEffect(() => {
    if (testimonialResponse?.data) {
      const url = testimonialResponse.data.video_url;
      setFormData({
        title: testimonialResponse.data.title,
        video_url: url,
        video_type: detectVideoType(url),
      });
    }
  }, [testimonialResponse]);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "video_url" ? { video_type: detectVideoType(value) } : {}),
    }));
  };

  const handleMediaSelect = (url) => {
    setFormData((prev) => ({
      ...prev,
      video_url: url,
      video_type: detectVideoType(url),
    }));
  };

  const handleSubmit = () => {
    submitMutation.mutate({ data: formData, testimonialId: id || null });
  };

  const handleBack = () => {
    navigate("/app/testimonials");
  };

  if (isEdit && isLoading) {
    return (
      <Box sx={{ px: 4, py: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Skeleton variant="text" width={120} height={24} />
          <Skeleton variant="text" width={200} height={32} sx={{ mt: 1 }} />
        </Box>

        <Card
          elevation={0}
          sx={{
            background: "#ffffff",
            border: "1px solid #e1e3e5",
            borderRadius: "12px",
            maxWidth: 800,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box>
                <Skeleton variant="text" width={80} height={20} />
                <Skeleton variant="rounded" width="100%" height={56} sx={{ mt: 0.5 }} />
                <Skeleton variant="text" width={120} height={16} sx={{ mt: 0.5 }} />
              </Box>

              <Skeleton
                variant="rounded"
                width="100%"
                height={80}
                sx={{ borderStyle: "dashed", borderColor: "#e1e3e5", borderRadius: "8px" }}
              />

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Skeleton variant="rounded" width="100%" height={1} />
                <Skeleton variant="text" width={20} height={16} />
                <Skeleton variant="rounded" width="100%" height={1} />
              </Box>

              <Box>
                <Skeleton variant="text" width={80} height={20} />
                <Skeleton variant="rounded" width="100%" height={56} sx={{ mt: 0.5 }} />
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
          <Skeleton variant="rounded" width={180} height={36} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rounded" width={80} height={36} sx={{ borderRadius: 1 }} />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ px: 4, py: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ textTransform: "none", mb: 1, color: "black" }}
        >
          Back
        </Button>
        <Typography
          variant="h5"
          component="h1"
          sx={{ fontWeight: 600, color: "#202223" }}
        >
          {isEdit ? "Edit Testimonial" : "Add Testimonial"}
        </Typography>
      </Box>

      <Card
        elevation={0}
        sx={{
          background: "#ffffff",
          border: "1px solid #e1e3e5",
          borderRadius: "12px",
          maxWidth: 800,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              label="Title"
              value={formData.title}
              onChange={handleChange("title")}
              fullWidth
              required
              helperText={`${(formData.title ?? "").length}/50 characters`}
              slotProps={{ htmlInput: { maxLength: 50 } }}
            />

            <Box>
              <Button
                variant="outlined"
                startIcon={<UploadFileIcon />}
                fullWidth
                onClick={() => setMediaDialogOpen(true)}
                sx={{
                  py: 2,
                  borderStyle: "dashed",
                  textTransform: "none",
                  color: "#6d7175",
                  borderColor: "#e1e3e5",
                  "&:hover": {
                    borderStyle: "dashed",
                    borderColor: "#008060",
                    bgcolor: "#f9fafb",
                  },
                }}
              >
                Open from shopify media
              </Button>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box sx={{ flex: 1, height: "1px", bgcolor: "#e1e3e5" }} />
              <Typography variant="body2" color="text.secondary">
                or
              </Typography>
              <Box sx={{ flex: 1, height: "1px", bgcolor: "#e1e3e5" }} />
            </Box>

            <TextField
              label="Video URL"
              value={formData.video_url}
              onChange={handleChange("video_url")}
              fullWidth
              required
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitMutation.isPending}
          startIcon={
            submitMutation.isPending ? (
              <CircularProgress size={16} color="inherit" />
            ) : null
          }
          sx={{ backgroundColor: "black", textTransform: "none" }}
        >
          {isEdit ? "Save changes" : "Create"}
        </Button>
        <Button
          variant="outlined"
          onClick={handleBack}
          disabled={submitMutation.isPending}
          sx={{ textTransform: "none" }}
        >
          Cancel
        </Button>
      </Box>

      <ShopifyMediaDialog
        open={mediaDialogOpen}
        onClose={() => setMediaDialogOpen(false)}
        onSelect={handleMediaSelect}
      />

      <Notification
        open={snackBar.open}
        severity={snackBar.severity}
        message={snackBar.message}
        onClose={() => setSnackBar({ ...snackBar, open: false })}
      />
    </Box>
  );
};

export default TestimonialFormPage;
