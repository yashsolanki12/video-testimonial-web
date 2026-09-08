import { Box, Card, CardContent, Skeleton, Stack } from "@mui/material";

const TestimonialCardSkeleton = () => (
  <Card
    elevation={0}
    sx={{
      background: "#ffffff",
      border: "1px solid #e1e3e5",
      borderRadius: "12px",
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
      <Skeleton
        variant="rounded"
        width={192}
        height={108}
        sx={{ borderRadius: "8px", flexShrink: 0 }}
      />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Skeleton variant="text" width="50%" height={24} />
        <Skeleton variant="rounded" width={70} height={22} sx={{ borderRadius: 1, mt: 0.5 }} />
        <Skeleton variant="text" width="30%" height={16} sx={{ mt: 0.5 }} />
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
  <Box sx={{ p: 4 }}>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
      }}
    >
      <Skeleton variant="text" width={220} height={32} />
      <Skeleton variant="rounded" width={150} height={36} sx={{ borderRadius: 1 }} />
    </Box>

    <Card
      elevation={0}
      sx={{
        background: "#ffffff",
        border: "1px solid #e1e3e5",
        borderRadius: "12px",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {Array.from({ length: count }).map((_, index) => (
            <TestimonialCardSkeleton key={index} />
          ))}
        </Box>
      </CardContent>
    </Card>
  </Box>
);

export default TestimonialShimmer;
