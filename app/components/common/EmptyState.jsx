import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";

const EmptyState = ({
  title = "No videos found",
  description = "Upload videos to your Shopify files to select them here.",
  icon,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "40vh",
        p: 3,
      }}
    >
      <Card
        elevation={0}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 5,
          maxWidth: 320,
          width: "100%",
          border: "1px dashed #e1e3e5",
          borderRadius: "12px",
          bgcolor: "#f9fafb",
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            bgcolor: "#f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          {icon || (
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8c9196"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
          )}
        </Box>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, color: "#202223", mb: 0.5 }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center", fontSize: "13px" }}
        >
          {description}
        </Typography>
      </Card>
    </Box>
  );
};

export default EmptyState;
