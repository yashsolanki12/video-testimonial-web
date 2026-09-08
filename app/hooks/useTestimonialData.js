import React from "react";
import { useQuery } from "@tanstack/react-query";

export const useTestimonialData = (queryKey, queryFn, setSnackBar, options = {}) => {
  const { enabled = true, staleTime = 0, shopDomain } = options;

  const { error, data, isLoading, refetch, isSuccess } = useQuery({
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
    queryFn: () => queryFn(shopDomain),
    enabled: enabled && !!shopDomain,
    staleTime: staleTime,
    refetchOnMount: true,
    retry: false,
  });

  const errorMessage = error?.message;

  React.useEffect(() => {
    if (errorMessage && setSnackBar) {
      setSnackBar((prev) => {
        if (prev.message === errorMessage && prev.open) return prev;
        return {
          open: true,
          message: errorMessage,
          severity: "error",
        };
      });
    }
  }, [errorMessage, setSnackBar]);

  React.useEffect(() => {
    if (isSuccess && setSnackBar && data?.message) {
      const timer = setTimeout(() => {
        setSnackBar((prev) => {
          if (prev.message === data.message && prev.open) return prev;
          return {
            open: true,
            message: data.message,
            severity: "success",
          };
        });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, setSnackBar, data]);

  return { error, data, isLoading, refetch };
};

export default useTestimonialData;
