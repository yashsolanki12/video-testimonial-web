import { useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  CircularProgress,
  Card,
  CardMedia,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useCurrentShopDomain } from "../utils/helper";
import { getShopifyVideos } from "../api/files";

const ShopifyMediaDialog = ({ open, onClose, onSelect }) => {
  const shopDomain = useCurrentShopDomain();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const pageRef = useRef(1);
  const hasNextPageRef = useRef(true);
  const isLoadingMoreRef = useRef(false);
  const fetchFnRef = useRef(null);

  const fetchVideos = useCallback(
    async (pageNum, append = false) => {
      if (!shopDomain) return;

      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
        isLoadingMoreRef.current = true;
      }

      try {
        const res = await getShopifyVideos(shopDomain, {
          page: pageNum,
          limit: 10,
        });
        const newVideos = res?.data?.data || [];
        const pagination = res?.data?.pagination;

        setVideos((prev) => (append ? [...prev, ...newVideos] : newVideos));
        hasNextPageRef.current = pagination?.hasNextPage ?? false;
        pageRef.current = pageNum;
      } catch (err) {
        console.error("Error fetching videos:", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
        isLoadingMoreRef.current = false;
      }
    },
    [shopDomain],
  );

  fetchFnRef.current = fetchVideos;

  useEffect(() => {
    if (open) {
      setVideos([]);
      pageRef.current = 1;
      hasNextPageRef.current = true;
      setSelectedId(null);
      setLoading(false);
      setLoadingMore(false);
      isLoadingMoreRef.current = false;
      fetchVideos(1, false);
    }
  }, [open, fetchVideos]);

  const handleScroll = useCallback((e) => {
    const el = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (
      scrollHeight - scrollTop - clientHeight < 100 &&
      hasNextPageRef.current &&
      !isLoadingMoreRef.current
    ) {
      fetchFnRef.current(pageRef.current + 1, true);
    }
  }, []);

  const handleSelect = (video) => {
    setSelectedId(video.id);
    onSelect(video.url);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={(e, reason) => {
        if (reason === "backdropClick") return;
        onClose();
      }}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: "12px" },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #e1e3e5",
          px: 3,
          py: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Shopify Media
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          p: 0,
          maxHeight: "60vh",
          overflowY: "auto",
        }}
        onScroll={handleScroll}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "60vh",
            }}
          >
            <CircularProgress size={32} />
          </Box>
        ) : videos.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "60vh",
            }}
          >
            <Typography color="text.secondary">No videos found</Typography>
          </Box>
        ) : (
          <Box sx={{ p: 2 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: 2,
              }}
            >
              {videos.map((video) => (
                <Card
                  key={video.id}
                  elevation={0}
                  sx={{
                    border: "1px solid #e1e3e5",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    position: "relative",
                    "&:hover": {
                      borderColor: "#008060",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    },
                    ...(selectedId === video.id && {
                      borderColor: "#008060",
                      boxShadow: "0 0 0 2px #008060",
                    }),
                  }}
                  onClick={() => handleSelect(video)}
                >
                  {selectedId === video.id && (
                    <CheckCircleIcon
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        color: "#008060",
                        zIndex: 1,
                        bgcolor: "white",
                        borderRadius: "50%",
                      }}
                    />
                  )}
                  <CardMedia
                    component="video"
                    src={video.url}
                    sx={{
                      height: 140,
                      bgcolor: "#1a1a1a",
                    }}
                    muted
                  />
                </Card>
              ))}
            </Box>

            {loadingMore && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  py: 3,
                }}
              >
                <CircularProgress size={24} />
              </Box>
            )}

            {!hasNextPageRef.current && videos.length > 0 && (
              <Box sx={{ textAlign: "center", py: 2 }}>
                <Typography variant="caption" color="text.secondary" sx={{fontSize: 14}}>
                  No more videos.
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ShopifyMediaDialog;
