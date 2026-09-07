import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useTestimonialSubmit = (mutationFn, setSnackBar, options = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, invalidateKeys = [] } = options;

  const mutation = useMutation({
    mutationFn,
    onError: (error) => {
      setSnackBar({
        open: true,
        message: error.message || "An error occurred",
        severity: "error",
      });
    },
    onSuccess: (data) => {
      setSnackBar({
        open: true,
        message: data?.message || "Operation successful",
        severity: "success",
      });

      if (onSuccess) {
        onSuccess(data);
      }

      if (invalidateKeys.length > 0) {
        setTimeout(() => {
          invalidateKeys.forEach((key) => {
            queryClient.invalidateQueries({ queryKey: key });
          });
        }, 2000);
      }
    },
  });

  return mutation;
};

export default useTestimonialSubmit;
