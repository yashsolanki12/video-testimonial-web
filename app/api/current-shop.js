import axiosInstance from "./axios-instance";

// Current shop session
export const getCurrentShopSession = async (shopDomain) => {
  if (!shopDomain) {
    console.error("No shop domain found for session request");
    throw new Error("Shop domain is required for session");
  }

  return axiosInstance
    .get("sessions/current", {
      headers: {
        "x-shopify-shop-domain": shopDomain,
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      const errorMessage = error.response?.data?.message || error.message;
      console.error("Api error in getCurrentShopSession:", errorMessage);
      throw new Error(errorMessage);
    });
};
