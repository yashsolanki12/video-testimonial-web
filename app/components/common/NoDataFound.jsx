import { Box, Card, CardContent, Typography, Button } from "@mui/material";
import SearchOffIcon from "@mui/icons-material/SearchOff";

const NoDataFound = ({
  title = "No results found",
  description = "Try changing the filters or search term.",
  icon = null,
  actionLabel = "",
  onActionClick = null,
  height = 400,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height,
      }}
    >
      <Card
        elevation={0}
        sx={{
          border: "1px solid #e1e3e5",
          borderRadius: "12px",
          maxWidth: 540,
          margin: "0 auto",
          background: "#ffffff",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: 4, sm: 5 },
            textAlign: "center",
          }}
        >
          <Box sx={{ color: "#8c9196", mb: 2, display: "flex" }}>
            {icon || <SearchOffIcon sx={{ fontSize: 40 }} />}
          </Box>

          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: "#202223",
              fontSize: { xs: "14px", md: "22px" },
              mb: 0.5,
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#6d7175",
              fontSize: { xs: "12px", md: "15px" },
              mb: actionLabel ? 2.5 : 0,
            }}
          >
            {description}
          </Typography>

          {actionLabel && onActionClick && (
            <Button
              onClick={onActionClick}
              variant="contained"
              disableElevation
              sx={{
                textTransform: "none",
                backgroundColor: "#008060",
                borderRadius: "6px",
                fontSize: "13px",
                px: 2,
                "&:hover": { backgroundColor: "#006e52" },
              }}
            >
              {actionLabel}
            </Button>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default NoDataFound;
