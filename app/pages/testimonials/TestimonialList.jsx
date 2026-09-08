import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { extractVideoEmbedUrl } from "../../utils/helper";

const VIDEO_TYPE_COLORS = {
  youtube: "error",
  vimeo: "info",
  shopify: "success",
};

const TestimonialCard = ({
  testimonial,
  onEdit,
  onDelete,
  onToggle,
}) => {
  const embedUrl = extractVideoEmbedUrl(
    testimonial.video_url,
    testimonial.video_type,
  );

  return (
    <Card
      elevation={0}
      sx={{
        background: "#ffffff",
        border: "1px solid #e1e3e5",
        borderRadius: "12px",
        transition: "box-shadow 0.2s ease, border-color 0.2s ease",
        "&:hover": {
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          borderColor: "#008060",
        },
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          p: 2,
          "&:last-child": { pb: 2 },
        }}
      >
        <Box
          sx={{
            width: 180,
            height: 101,
            borderRadius: "8px",
            overflow: "hidden",
            flexShrink: 0,
            bgcolor: "#f4f6f8",
          }}
        >
          <iframe
            src={embedUrl}
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

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, color: "#202223", mb: 0.5 }}
          >
            {testimonial.title}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Chip
              label={testimonial.video_type.toUpperCase()}
              size="small"
              color={VIDEO_TYPE_COLORS[testimonial.video_type] || "default"}
              variant="outlined"
              sx={{ fontWeight: 500 }}
            />
            <Chip
              label={testimonial.is_active ? "Active" : "Inactive"}
              size="small"
              color={testimonial.is_active ? "success" : "default"}
            />
          </Stack>
        </Box>

        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              color="primary"
              onClick={() => onEdit(testimonial)}
              sx={{
                "&:hover": { bgcolor: "primary.50" },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={testimonial.is_active ? "Deactivate" : "Activate"}>
            <IconButton
              size="small"
              color={testimonial.is_active ? "warning" : "success"}
              onClick={() => onToggle(testimonial.id)}
              sx={{
                "&:hover": {
                  bgcolor: testimonial.is_active
                    ? "warning.50"
                    : "success.50",
                },
              }}
            >
              {testimonial.is_active ? (
                <VisibilityIcon fontSize="small" />
              ) : (
                <VisibilityOffIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() => onDelete(testimonial)}
              sx={{
                "&:hover": { bgcolor: "error.50" },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </CardContent>
    </Card>
  );
};

const TestimonialList = ({ testimonials, onEdit, onDelete, onToggle }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {testimonials.map((testimonial) => (
        <TestimonialCard
          key={testimonial.id}
          testimonial={testimonial}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      ))}
    </Box>
  );
};

export default TestimonialList;
