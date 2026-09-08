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
    <CardContent sx={{ p: 3 }}>
      <Skeleton variant="text" width="40%" height={24} />
      <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />
      <Skeleton variant="rounded" width="100%" height={56} sx={{ borderRadius: 1 }} />
    </CardContent>
  </Card>
);

const SettingsShimmer = () => (
  <Box sx={{ p: 4 }}>
    <Card
      elevation={0}
      sx={{
        background: "#ffffff",
        border: "1px solid #e1e3e5",
        borderRadius: "12px",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Skeleton variant="text" width={180} height={32} />
          <Skeleton variant="text" width={280} height={20} sx={{ mt: 0.5 }} />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <SettingsCardSkeleton />
          <SettingsCardSkeleton />
          <SettingsCardSkeleton />
        </Box>
      </CardContent>
    </Card>
    <Skeleton variant="rounded" width={140} height={36} sx={{ mt: 3, borderRadius: 1 }} />
  </Box>
);

export default SettingsShimmer;
