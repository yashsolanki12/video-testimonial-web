import { useState } from "react";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
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
import { useNavigate } from "react-router";
import { useLoaderData } from "react-router";
import { getCurrentShopSession } from "../api/current-shop";
import NoDataFound from "../components/common/NoDataFound";
import TestimonialList from "../pages/testimonials/TestimonialList";
import TestimonialShimmer from "../pages/testimonials/TestimonialShimmer";
import ConfirmationDialog from "../components/confirmation-dialog";
import AddIcon from "@mui/icons-material/Add";
import Warning from "@mui/icons-material/Warning";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  try {
    // Fetch main theme using raw fetch
    const themesResponse = await fetch(
      `https://${session.shop}/admin/api/2026-10/themes.json?role=main`,
      {
        headers: {
          "X-Shopify-Access-Token": session.accessToken,
          "Content-Type": "application/json",
        },
      },
    );

    if (!themesResponse.ok) {
      const errorText = await themesResponse.text();
      return {
        appEmbedEnabled: false,
        session: session,
        error: "Theme fetch failed",
        status: themesResponse.status,
        details: errorText,
        sessionDebug: {
          shop: session?.shop,
          scopes: session?.scope,
          // eslint-disable-next-line no-undef
          configuredScopes: process.env.SCOPES,
          hasToken: !!session?.accessToken,
          tokenStart: session?.accessToken
            ? session.accessToken.substring(0, 10) + "..."
            : null,
        },
      };
    }

    const themesData = await themesResponse.json();

    if (!themesData.themes || themesData.themes.length === 0) {
      return {
        appEmbedEnabled: false,
        session: session,
        error: "No main theme found in response",
        response: themesData,
      };
    }

    const mainTheme = themesData.themes[0];

    // Fetch settings_data.json
    const assetsResponse = await fetch(
      `https://${session.shop}/admin/api/2026-10/themes/${mainTheme.id}/assets.json?asset[key]=config/settings_data.json`,
      {
        headers: {
          "X-Shopify-Access-Token": session.accessToken,
          "Content-Type": "application/json",
        },
      },
    );

    const assetData = await assetsResponse.json();
    const asset = assetData.asset;

    if (!asset || !asset.value) {
      return {
        appEmbedEnabled: false,
        session: session,
        error: "No settings_data.json found",
      };
    }

    const settings = JSON.parse(asset.value);

    // Logic Simulation
    const simulation = {
      foundBlocks: [],
      finalDecision: false,
      logs: [],
    };

    if (settings.current && settings.current.blocks) {
      const rawBlocks = settings.current.blocks;
      simulation.logs.push(
        `Total blocks in settings: ${Object.keys(rawBlocks).length}`,
      );
      console.log("raw block::", rawBlocks);

      const videoTestimonialBlocks = Object.keys(rawBlocks)
        .filter((key) => {
          const block = rawBlocks[key];
          const isMatch =
            block.type && block.type.includes("video_testimonial_app");
          if (isMatch)
            simulation.logs.push(
              `Found matching block: ${key} (${block.type})`,
            );
          return isMatch;
        })
        .map((key) => ({ ...rawBlocks[key], id: key }));

      simulation.foundBlocks = videoTestimonialBlocks;

      if (videoTestimonialBlocks.length > 0) {
        const isAnyEnabled = videoTestimonialBlocks.some((block) => {
          const isAppEmbedOn = !block.disabled;
          const isInnerSettingOn = block.settings.enabled !== false;
          simulation.logs.push(
            `Block ${block.id}: AppEmbedOn=${isAppEmbedOn}, InnerSettingOn=${isInnerSettingOn}`,
          );
          return isAppEmbedOn && isInnerSettingOn;
        });
        simulation.finalDecision = isAnyEnabled;
      } else {
        simulation.logs.push("No blocks matching 'video testimonial' found.");
      }
    }

    return {
      appEmbedEnabled: simulation.finalDecision,
      session: session,
      shop: session?.shop,
      settings: settings,
      raw: asset.value,
      simulation,
    };
  } catch (error) {
    return {
      appEmbedEnabled: false,
      session: session,
      error: error.message,
      stack: error.stack,
      sessionDebug: {
        shop: session?.shop,
        scopes: session?.scope,
        hasToken: !!session?.accessToken,
        tokenStart: session?.accessToken
          ? session.accessToken.substring(0, 10) + "..."
          : null,
      },
    };
  }
};

export default function TestimonialsIndexPage() {
  const data = useLoaderData() || {};
  const appEmbedEnabled = data?.appEmbedEnabled ?? false;

  const shopDomain = useCurrentShopDomain();

  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [snackBar, setSnackBar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { data: currentShopData } = useTestimonialData(
    ["video-testimonial-session"],
    getCurrentShopSession,
    null,
    { shopDomain },
  );

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

  const navigateAppEmbed = () => {
    const currentShop =
      shopDomain ||
      currentShopData?.data?.shop ||
      new URLSearchParams(window.location.search).get("shop") ||
      window.location.hostname;
    const url = `https://${currentShop}/admin/themes/current/editor?context=apps`;
    window.open(url, "_blank");
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
        height: `${!appEmbedEnabled ? "" : "calc(100vh - 110px)"}`,
      }}
    >
      {!appEmbedEnabled && (
        <Card sx={{ borderRadius: "10px", boxShadow: 2, mb: 4 }}>
          <CardContent sx={{ p: { xs: 2, sm: 2 } }}>
            {/* Header/Warning Bar */}
            <Box
              sx={{
                backgroundColor: "#ffb800",
                borderRadius: "5px",
                p: { xs: 1.5, sm: 2 },
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: 2,
              }}
            >
              <Warning sx={{ fontSize: { xs: 20, sm: 24 }, flexShrink: 0 }} />
              <Typography
                variant="h6"
                component="span"
                sx={{
                  color: "#232220",
                  fontSize: { xs: "0.95rem", sm: "1rem" },
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}
              >
                Video Testimonial is not activated yet.
              </Typography>
            </Box>

            {/* Instruction Text */}
            <Typography
              variant="body2"
              sx={{
                color: "#6d7175",
                fontSize: { xs: "0.85rem", sm: "1rem" },
                mb: 2,
              }}
            >
              <span style={{ fontSize: "14px" }}>
                Please activate the app by clicking{" "}
              </span>
              <Box
                component="span"
                sx={{ fontWeight: 700, color: "black", fontSize: "14px" }}
              >
                Activate
              </Box>
              button.
            </Typography>

            {/* Action Button */}
            <Button
              variant="contained"
              fullWidth={{ xs: true, sm: false }} // Auto-stretches on mobile
              sx={{
                backgroundColor: "#202223",
                color: "white",
                textTransform: "none",
                borderRadius: "6px",
                fontWeight: 600,
                p: "5px 10px",
                fontSize: "13px",
                "&:hover": {
                  backgroundColor: "#303030",
                },
              }}
              onClick={navigateAppEmbed}
            >
              Activate
            </Button>
          </CardContent>
        </Card>
      )}
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
