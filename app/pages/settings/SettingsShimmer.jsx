import { Box, Card, CardContent, Skeleton } from "@mui/material";

const SettingsCardSkeleton = () => (
  <Card
    elevation={0}
    sx={{
      background: "#f9fafb",
      border: "1px solid #e1e3e5",
      borderRadius: "12px",
    }}
  >
    <CardContent sx={{ p: 2 }}>
      <Skeleton variant="text" width="40%" height={24} />
      <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />
      <Skeleton variant="rounded" width="100%" height={56} sx={{ borderRadius: 1 }} />
    </CardContent>
  </Card>
);

const SettingsShimmer = () => (
  <Box sx={{ p: 4 }}>
    <Skeleton variant="text" width={120} height={32} sx={{ mb: 1 }} />

    <Card
      elevation={0}
      sx={{
        background: "#ffffff",
        border: "1px solid #e1e3e5",
        borderRadius: "12px",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <SettingsCardSkeleton />
          <SettingsCardSkeleton />
          <SettingsCardSkeleton />
        </Box>
      </CardContent>
    </Card>

    <Box sx={{ mt: 3, display: "flex", gap: 2, alignItems: "center" }}>
      <Skeleton variant="rounded" width={140} height={36} sx={{ borderRadius: 1 }} />
      <Skeleton variant="circular" width={36} height={36} />
    </Box>
  </Box>
);

export default SettingsShimmer;
