import axiosInstance from "./axios-instance.js";

export const getShopifyVideos = async (shopDomain, { page = 1, limit = 10 } = {}) => {
  if (!shopDomain) {
    throw new Error("Shop domain is required.");
  }

  return axiosInstance
    .get("files/videos", {
      params: { page, limit },
      headers: {
        "x-shopify-shop-domain": shopDomain,
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      const errorMessage = error.response?.data?.message || error.message;
      console.error("API Error in get shopify videos:", errorMessage);
      throw new Error(errorMessage);
    });
};
