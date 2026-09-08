import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import { authenticate } from "../shopify.server";
import { useTestimonialData } from "../hooks/useTestimonialData";
import { useTestimonialSubmit } from "../hooks/useTestimonialSubmit";
import {
  getSettings,
  createSettings,
  updateSettings,
  deleteSettings,
} from "../api/settings";
import { Notification } from "../components/common/Notification";
import ConfirmationDialog from "../components/confirmation-dialog";
import { useCurrentShopDomain } from "../utils/helper";
import SettingsForm from "../pages/settings/SettingsForm";
import SettingsShimmer from "../pages/settings/SettingsShimmer";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function SettingsPage() {
  const shopDomain = useCurrentShopDomain();
  const [formData, setFormData] = React.useState({
    section_title: "",
    slider_effect: "",
    display_layout: "",
  });
  const [snackBar, setSnackBar] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const { data: settingsResponse, isLoading } = useTestimonialData(
    ["settings"],
    getSettings,
    null,
    { shopDomain },
  );

  const createMutation = useTestimonialSubmit(
    (data) => createSettings(data, shopDomain),
    setSnackBar,
    { invalidateKeys: [["settings"]] },
  );

  const updateMutation = useTestimonialSubmit(
    (data) => updateSettings(data, shopDomain),
    setSnackBar,
    { invalidateKeys: [["settings"]] },
  );

  const deleteMutation = useTestimonialSubmit(
    (id) => deleteSettings(id, shopDomain),
    setSnackBar,
    {
      invalidateKeys: [["settings"]],

      onSuccess: () => {
        setFormData({
          section_title: "",
          display_layout: "",
          slider_effect: "",
        });
      },
    },
  );

  React.useEffect(() => {
    if (settingsResponse?.data) {
      const settings = settingsResponse.data;
      setFormData({
        section_title: settings.section_title,
        slider_effect: settings.slider_effect,
        display_layout: settings.display_layout,
      });
    }
  }, [settingsResponse]);

  const settingsExist = !!settingsResponse?.data;
  const settingsId = settingsResponse?.data?.id;

  const handleSave = () => {
    if (settingsExist) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = () => {
    if (settingsId) {
      deleteMutation.mutate(settingsId);
      setIsDeleteDialogOpen(false);
    }
  };

  if (isLoading) {
    return <SettingsShimmer />;
  }

  const isAnyPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ mb: 1 }}>
        <Typography
          variant="h5"
          component="h1"
          sx={{ fontWeight: 600, color: "#202223" }}
        >
          Settings
        </Typography>
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
          <SettingsForm formData={formData} onChange={setFormData} />
        </CardContent>
      </Card>

      <Box sx={{ mt: 3, display: "flex", gap: 2, alignItems: "center" }}>
        <Button
          variant="contained"
          startIcon={
            createMutation.isPending || updateMutation.isPending ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <SaveIcon />
            )
          }
          onClick={handleSave}
          disabled={isAnyPending}
          sx={{ backgroundColor: "black", textTransform: "none" }}
        >
          Save Changes
        </Button>
        {settingsExist && (
          <IconButton
            color="error"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={isAnyPending}
            sx={{
              "&:hover": { bgcolor: "error.50" },
            }}
          >
            {deleteMutation.isPending ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <DeleteIcon />
            )}
          </IconButton>
        )}
      </Box>

      <ConfirmationDialog
        open={isDeleteDialogOpen}
        title="Delete Settings"
        message="Are you sure you want to delete all settings? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleDelete}
        onClose={() => setIsDeleteDialogOpen(false)}
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
