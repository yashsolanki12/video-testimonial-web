import React from "react";
import { Box, Typography } from "@mui/material";
import { PLACEHOLDER_VIDEOS } from "../utils/constant";

const VideoCard = ({ title }) => (
  <Box
    sx={{
      background: "#fff",
      borderRadius: "6px",
      overflow: "hidden",
      border: "1px solid #e1e3e5",
      flexShrink: 0,
      width: "100%",
    }}
  >
    <Box
      sx={{
        width: "100%",
        height: 80,
        bgcolor: "#f4f6f8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#c9cccf"
        strokeWidth="2"
      >
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    </Box>
    <Box sx={{ px: 0.75, py: 0.25 }}>
      <Typography
        sx={{
          fontSize: 14,
          fontWeight: 600,
          color: "#202223",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {title}
      </Typography>
    </Box>
  </Box>
);

const NavButton = ({ direction, onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      position: "absolute",
      top: "40%",
      [direction]: 4,
      transform: "translateY(-50%)",
      width: 24,
      height: 24,
      borderRadius: "50%",
      bgcolor: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
      fontSize: 14,
      fontWeight: 700,
      color: "#202223",
      cursor: "pointer",
      zIndex: 10,
      border: "1px solid #e1e3e5",
      "&:hover": { bgcolor: "#f4f6f8" },
    }}
  >
    {direction === "left" ? "‹" : "›"}
  </Box>
);

const DotIndicator = ({ count, activeIndex, onChange }) => (
  <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
    {Array.from({ length: count }).map((_, i) => (
      <Box
        key={i}
        onClick={() => onChange(i)}
        sx={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          bgcolor: i === activeIndex ? "#202223" : "#d4d4d4",
          cursor: "pointer",
          transition: "bgcolor 0.3s",
        }}
      />
    ))}
  </Box>
);

const SliderPreview = ({ effect }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const total = PLACEHOLDER_VIDEOS.length;

  const goTo = React.useCallback(
    (index) => {
      if (index < 0) setCurrentIndex(total - 1);
      else if (index >= total) setCurrentIndex(0);
      else setCurrentIndex(index);
    },
    [total],
  );

  React.useEffect(() => {
    if (effect === "standard" || !effect) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 3000);
    return () => clearInterval(timer);
  }, [total, effect]);

  const isFade = effect === "fade";

  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: "8px",
        overflow: "visible",
        bgcolor: isFade ? "#f5f3ff" : "#f4f6f8",
      }}
    >
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "8px 8px 0 0",
        }}
      >
        {isFade ? (
          <Box sx={{ position: "relative", height: 110 }}>
            {PLACEHOLDER_VIDEOS.map((v, i) => (
              <Box
                key={v.id}
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  opacity: i === currentIndex ? 1 : 0,
                  transition: "opacity 0.5s ease-in-out",
                  pointerEvents: i === currentIndex ? "auto" : "none",
                }}
              >
                <VideoCard title={v.title} />
              </Box>
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              transition: "transform 0.5s ease-in-out",
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {PLACEHOLDER_VIDEOS.map((v) => (
              <Box key={v.id} sx={{ minWidth: "100%", px: 0.25 }}>
                <VideoCard title={v.title} />
              </Box>
            ))}
          </Box>
        )}
      </Box>
      <NavButton direction="left" onClick={() => goTo(currentIndex - 1)} />
      <NavButton direction="right" onClick={() => goTo(currentIndex + 1)} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 0.5,
          bgcolor: isFade ? "#ede9fe" : "#f9fafb",
        }}
      >
        <DotIndicator
          count={total}
          activeIndex={currentIndex}
          onChange={goTo}
        />
      </Box>
    </Box>
  );
};

const GridPreview = () => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 1.5,
    }}
  >
    {PLACEHOLDER_VIDEOS.map((v) => (
      <VideoCard key={v.id} title={v.title} />
    ))}
  </Box>
);

const SettingsPreview = ({ layout, effect, sectionTitle }) => {
  const effectLabel =
    effect === "fade"
      ? "Fade"
      : effect === "carousel"
        ? "Carousel"
        : "Standard";
  const isFade = effect === "fade";

  return (
    <Box>
      {sectionTitle && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            mb: 1.2,
          }}
        >
          <Box>
            <Typography
              sx={{ fontSize: 20, fontWeight: 600, color: "#202223" }}
            >
              {sectionTitle}
            </Typography>
          </Box>

          {layout === "slider" && (
            <Box>
              <Box
                sx={{
                  bgcolor: isFade ? "#7c3aed" : "#202223",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 600,
                  px: 0.75,
                  py: 0.7,
                  borderRadius: "4px",
                  lineHeight: 1,
                }}
              >
                {effectLabel}
              </Box>
            </Box>
          )}
        </Box>
      )}
      {layout === "grid" ? <GridPreview /> : <SliderPreview effect={effect} />}
    </Box>
  );
};

export default SettingsPreview;
