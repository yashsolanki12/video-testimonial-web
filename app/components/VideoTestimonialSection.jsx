import { useState, useEffect } from "react";
import { Box, Typography, Card, IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { extractVideoEmbedUrl } from "../utils/helper";

const VideoCard = ({ testimonial }) => {
  const embedUrl = extractVideoEmbedUrl(testimonial.video_url);

  return (
    <Card
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          position: "relative",
          paddingBottom: "56.25%",
          height: 0,
          overflow: "hidden",
        }}
      >
        <iframe
          src={embedUrl}
          title={testimonial.title}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: "none",
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </Box>
      <Box sx={{ p: 2, flexGrow: 1 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          {testimonial.title}
        </Typography>
      </Box>
    </Card>
  );
};

const GridView = ({ testimonials }) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "repeat(2, 1fr)",
        },
        gap: 3,
        width: "100%",
      }}
    >
      {testimonials.map((testimonial) => (
        <Box key={testimonial.id} sx={{ minHeight: 350 }}>
          <VideoCard testimonial={testimonial} />
        </Box>
      ))}
    </Box>
  );
};

const SliderView = ({ testimonials, effect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1,
    );
  };

  useEffect(() => {
    if (effect === "carousel" && testimonials.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) =>
          prev === testimonials.length - 1 ? 0 : prev + 1,
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [effect, testimonials.length]);

  if (testimonials.length === 0) return null;

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <Box
        sx={{
          overflow: "hidden",
          borderRadius: 1,
          position: "relative",
        }}
      >
        {effect === "fade" ? (
          testimonials.map((testimonial, index) => (
            <Box
              key={testimonial.id}
              sx={{
                display: index === currentIndex ? "block" : "none",
                opacity: 1,
                transition: "opacity 0.5s ease-in-out",
              }}
            >
              <VideoCard testimonial={testimonial} />
            </Box>
          ))
        ) : (
          <Box
            sx={{
              display: "flex",
              transform: `translateX(-${currentIndex * 100}%)`,
              transition: "transform 0.5s ease-in-out",
            }}
          >
            {testimonials.map((testimonial) => (
              <Box
                key={testimonial.id}
                sx={{
                  minWidth: "100%",
                  flexShrink: 0,
                }}
              >
                <VideoCard testimonial={testimonial} />
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {testimonials.length > 1 && (
        <>
          <IconButton
            onClick={handlePrev}
            sx={{
              position: "absolute",
              left: 8,
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: "rgba(255,255,255,0.8)",
              "&:hover": { bgcolor: "rgba(255,255,255,1)" },
              zIndex: 1,
            }}
          >
            <ArrowBackIosIcon />
          </IconButton>
          <IconButton
            onClick={handleNext}
            sx={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: "rgba(255,255,255,0.8)",
              "&:hover": { bgcolor: "rgba(255,255,255,1)" },
              zIndex: 1,
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </>
      )}

      {testimonials.length > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 1,
            mt: 2,
          }}
        >
          {testimonials.map((_, index) => (
            <Box
              key={index}
              onClick={() => setCurrentIndex(index)}
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor:
                  index === currentIndex ? "primary.main" : "grey.300",
                cursor: "pointer",
                transition: "bgcolor 0.3s",
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

const VideoTestimonialSection = ({ testimonials, settings }) => {
  if (testimonials.length === 0) return null;

  const sectionTitle = settings?.section_title || "Video Testimonials";
  const displayLayout = settings?.display_layout || "slider";
  const sliderEffect = settings?.slider_effect || "standard";

  return (
    <Box
      sx={{
        py: 6,
        px: { xs: 2, sm: 4, md: 6 },
        maxWidth: 1200,
        mx: "auto",
      }}
    >
      <Typography
        variant="h4"
        component="h2"
        sx={{ textAlign: "center", mb: 4 }}
        gutterBottom
      >
        {sectionTitle}
      </Typography>

      {displayLayout === "grid" ? (
        <GridView testimonials={testimonials} />
      ) : (
        <SliderView
          testimonials={testimonials}
          effect={sliderEffect}
        />
      )}
    </Box>
  );
};

export default VideoTestimonialSection;
