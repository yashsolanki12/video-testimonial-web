import { Box, Card, CardContent, Skeleton, Stack } from "@mui/material";

const TestimonialCardSkeleton = () => (
  <Card variant="outlined">
    <CardContent
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: 2,
      }}
    >
      <Skeleton
        variant="rounded"
        width={180}
        height={101}
        sx={{ borderRadius: 1, flexShrink: 0 }}
      />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Skeleton variant="text" width="60%" height={28} />
        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          <Skeleton variant="rounded" width={70} height={24} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rounded" width={60} height={24} sx={{ borderRadius: 1 }} />
        </Stack>
      </Box>
      <Stack direction="row" spacing={0.5}>
        <Skeleton variant="circular" width={32} height={32} />
        <Skeleton variant="circular" width={32} height={32} />
        <Skeleton variant="circular" width={32} height={32} />
      </Stack>
    </CardContent>
  </Card>
);

const TestimonialShimmer = ({ count = 4 }) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
    {Array.from({ length: count }).map((_, index) => (
      <TestimonialCardSkeleton key={index} />
    ))}
  </Box>
);

export default TestimonialShimmer;
