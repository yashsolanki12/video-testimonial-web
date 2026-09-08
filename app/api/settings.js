import axiosInstance from "./axios-instance.js";

// Get settings
export const getSettings = async (shopDomain) => {
  if (!shopDomain) {
    throw new Error("Shop domain is required.");
  }

  return axiosInstance
    .get("settings", {
      headers: {
        "x-shopify-shop-domain": shopDomain,
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      const errorMessage = error.response?.data?.message || error.message;
      console.error("API Error in get settings:", errorMessage);
      throw new Error(errorMessage);
    });
};

// Create settings
export const createSettings = async (data, shopDomain) => {
  if (!shopDomain) {
    throw new Error("Shop domain is required.");
  }

  return axiosInstance
    .post("settings/add", data, {
      headers: {
        "x-shopify-shop-domain": shopDomain,
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      const errorMessage = error.response?.data?.message || error.message;
      console.error("API Error in create settings:", errorMessage);
      throw new Error(errorMessage);
    });
};

// Update settings
export const updateSettings = async (data, shopDomain) => {
  if (!shopDomain) {
    throw new Error("Shop domain is required.");
  }

  return axiosInstance
    .put("settings", data, {
      headers: {
        "x-shopify-shop-domain": shopDomain,
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      const errorMessage = error.response?.data?.message || error.message;
      console.error("API Error in update settings:", errorMessage);
      throw new Error(errorMessage);
    });
};

// Delete settings
export const deleteSettings = async (id, shopDomain) => {
  if (!shopDomain) {
    throw new Error("Shop domain is required.");
  }

  return axiosInstance
    .delete(`settings/${id}`, {
      headers: {
        "x-shopify-shop-domain": shopDomain,
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      const errorMessage = error.response?.data?.message || error.message;
      console.error("API Error in delete settings:", errorMessage);
      throw new Error(errorMessage);
    });
};

// Get public settings (for storefront)
export const getPublicSettings = async (shopDomain) => {
  if (!shopDomain) {
    throw new Error("Shop domain is required.");
  }

  return axiosInstance
    .get("settings/public", {
      headers: {
        "x-shopify-shop-domain": shopDomain,
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      const errorMessage = error.response?.data?.message || error.message;
      console.error("API Error in get public settings:", errorMessage);
      throw new Error(errorMessage);
    });
};
