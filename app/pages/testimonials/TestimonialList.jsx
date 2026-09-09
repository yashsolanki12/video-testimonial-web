import { useState } from "react";
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
import {
  getVideoThumbnail,
  isShopifyVideo,
  formatDate,
} from "../../utils/helper";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

const TestimonialCard = ({
  testimonial,
  onEdit,
  onDelete,
  onToggle,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDragging,
}) => {
  const [imgError, setImgError] = useState(false);
  const thumbnail = getVideoThumbnail(
    testimonial.video_url,
    testimonial.video_type,
  );
  const isShopify = isShopifyVideo(testimonial.video_url);

  const handlePreview = () => {
    window.open(testimonial.video_url, "_blank", "noopener,noreferrer");
  };

  return (
    <Box
      data-id={testimonial.id}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      sx={{
        opacity: isDragging ? 0.4 : 1,
        transition: "opacity 0.2s ease",
      }}
    >
      <Card
        elevation={0}
        sx={{
          background: "#ffffff",
          border: isDragging ? "2px dashed #008060" : "1px solid #e1e3e5",
          borderRadius: "12px",
          transition: "all 0.2s ease",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            borderColor: "#c9cccf",
          },
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2.5,
            p: 2,
            "&:last-child": { pb: 2 },
          }}
        >
          <Box
            sx={{
              color: "#c9cccf",
              display: "flex",
              alignItems: "center",
              cursor: "grab",
              "&:hover": { color: "#91979d" },
            }}
          >
            <DragIndicatorIcon fontSize="small" />
          </Box>

          <Box
            className="thumbnail-wrapper"
            onClick={handlePreview}
            sx={{
              width: 192,
              height: 108,
              borderRadius: "8px",
              overflow: "hidden",
              flexShrink: 0,
              bgcolor: "#1a1a1a",
              position: "relative",
              cursor: "pointer",
              "&:hover .play-overlay": {
                opacity: 1,
              },
            }}
          >
            {isShopify ? (
              <Box
                component="video"
                src={testimonial.video_url}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
                muted
                preload="metadata"
              />
            ) : thumbnail && !imgError ? (
              <Box
                component="img"
                src={thumbnail}
                alt={testimonial.title}
                onError={() => setImgError(true)}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "#2a2a2a",
                }}
              >
                <OpenInNewIcon sx={{ fontSize: 32, color: "#666" }} />
              </Box>
            )}
            <Box
              className="play-overlay"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "rgba(0,0,0,0.35)",
                opacity: 0,
                transition: "opacity 0.2s ease",
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  bgcolor: "rgba(255,255,255,0.95)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                }}
              >
                <OpenInNewIcon sx={{ fontSize: 22, color: "#1a1a1a" }} />
              </Box>
            </Box>
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: "#202223",
                mb: 0.5,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {testimonial.title}
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 0.5 }}
            >
              <Chip
                label={testimonial.is_active ? "Active" : "Inactive"}
                size="small"
                color={testimonial.is_active ? "success" : "default"}
                sx={{ fontWeight: 500, height: 22 }}
              />
            </Stack>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block" }}
            >
              Created {formatDate(testimonial.created_at)}
            </Typography>
          </Box>

          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Edit" placement="top">
              <IconButton
                size="small"
                onClick={() => onEdit(testimonial)}
                sx={{
                  color: "#6d7175",
                  "&:hover": { bgcolor: "#eef4fc", color: "#2c5aa0" },
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip
              title={testimonial.is_active ? "Deactivate" : "Activate"}
              placement="top"
            >
              <IconButton
                size="small"
                onClick={() => onToggle(testimonial.id)}
                sx={{
                  color: testimonial.is_active ? "#008060" : "#6d7175",
                  "&:hover": {
                    bgcolor: testimonial.is_active ? "#e6f4f1" : "#f4f6f8",
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
            <Tooltip title="Delete" placement="top">
              <IconButton
                size="small"
                onClick={() => onDelete(testimonial)}
                sx={{
                  color: "#6d7175",
                  "&:hover": { bgcolor: "#fef4f4", color: "#d72c0d" },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

const TestimonialList = ({
  testimonials,
  onEdit,
  onDelete,
  onToggle,
  onReorder,
}) => {
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);

  const handleDragStart = (e) => {
    const id = Number(e.currentTarget.dataset.id);
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(id));
  };

  const handleDragOver = (e, id) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (id !== dragOverId) {
      setDragOverId(id);
    }
  };

  const handleDrop = (e, id) => {
    e.preventDefault();
    const fromId = Number(e.dataTransfer.getData("text/plain"));
    const toId = Number(id);
    if (fromId && fromId !== toId) {
      const oldIndex = testimonials.findIndex((t) => t.id === fromId);
      const newIndex = testimonials.findIndex((t) => t.id === toId);
      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = testimonials.map((t) => t.id);
        const [moved] = newOrder.splice(oldIndex, 1);
        newOrder.splice(newIndex, 0, moved);
        onReorder(newOrder);
      }
    }
    setDraggedId(null);
    setDragOverId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      {testimonials.map((testimonial) => (
        <TestimonialCard
          key={testimonial.id}
          testimonial={testimonial}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggle={onToggle}
          onDragStart={handleDragStart}
          onDragOver={(e) => handleDragOver(e, testimonial.id)}
          onDrop={(e) => handleDrop(e, testimonial.id)}
          onDragEnd={handleDragEnd}
          isDragging={draggedId === testimonial.id}
        />
      ))}
    </Box>
  );
};

export default TestimonialList;
