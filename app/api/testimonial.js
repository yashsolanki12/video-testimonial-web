import axiosInstance from "./axios-instance.js";

// Get all testimonials
export const getAllTestimonials = async (shopDomain) => {
  if (!shopDomain) {
    throw new Error("Shop domain is required.");
  }

  return axiosInstance
    .get("testimonials", {
      headers: {
        "x-shopify-shop-domain": shopDomain,
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      const errorMessage = error.response?.data?.message || error.message;
      console.error("API Error in get all testimonials:", errorMessage);
      throw new Error(errorMessage);
    });
};

// Get active testimonials (for storefront)
export const getActiveTestimonials = async (shopDomain) => {
  if (!shopDomain) {
    throw new Error("Shop domain is required.");
  }

  return axiosInstance
    .get("testimonials/active", {
      headers: {
        "x-shopify-shop-domain": shopDomain,
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      const errorMessage = error.response?.data?.message || error.message;
      console.error("API Error in get active testimonials:", errorMessage);
      throw new Error(errorMessage);
    });
};

// Get testimonial by ID
export const getTestimonialById = async (id, shopDomain) => {
  if (!shopDomain) {
    throw new Error("Shop domain is required.");
  }

  return axiosInstance
    .get(`testimonials/${id}`, {
      headers: {
        "x-shopify-shop-domain": shopDomain,
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      const errorMessage = error.response?.data?.message || error.message;
      console.error("API Error in get testimonial by id:", errorMessage);
      throw new Error(errorMessage);
    });
};

// Create testimonial
export const createTestimonial = async (data, shopDomain) => {
  if (!shopDomain) {
    throw new Error("Shop domain is required.");
  }

  return axiosInstance
    .post("testimonials", data, {
      headers: {
        "x-shopify-shop-domain": shopDomain,
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      console.error("API Error in create testimonial:", error);
      throw error;
    });
};

// Update testimonial
export const updateTestimonial = async ({ id, data, shopDomain }) => {
  if (!shopDomain) {
    throw new Error("Shop domain is required.");
  }

  return axiosInstance
    .put(`testimonials/${id}`, data, {
      headers: {
        "x-shopify-shop-domain": shopDomain,
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      console.error("API Error in update testimonial:", error);
      throw error;
    });
};

// Delete testimonial
export const deleteTestimonial = async (id, shopDomain) => {
  if (!shopDomain) {
    throw new Error("Shop domain is required.");
  }

  return axiosInstance
    .delete(`testimonials/${id}`, {
      headers: {
        "x-shopify-shop-domain": shopDomain,
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      const errorMessage = error.response?.data?.message || error.message;
      console.error("API Error in delete testimonial:", errorMessage);
      throw new Error(errorMessage);
    });
};

// Toggle active status
export const toggleTestimonialActive = async (id, shopDomain) => {
  if (!shopDomain) {
    throw new Error("Shop domain is required.");
  }

  return axiosInstance
    .patch(
      `testimonials/${id}/toggle`,
      {},
      {
        headers: {
          "x-shopify-shop-domain": shopDomain,
        },
      },
    )
    .then((res) => res.data)
    .catch((error) => {
      const errorMessage = error.response?.data?.message || error.message;
      console.error("API Error in toggle testimonial:", errorMessage);
      throw new Error(errorMessage);
    });
};

// Reorder testimonials
export const reorderTestimonials = async (orderedIds, shopDomain) => {
  if (!shopDomain) {
    throw new Error("Shop domain is required.");
  }

  return axiosInstance
    .put(
      "testimonials/reorder/bulk",
      { orderedIds },
      {
        headers: {
          "x-shopify-shop-domain": shopDomain,
        },
      },
    )
    .then((res) => res.data)
    .catch((error) => {
      console.error("API Error in reorder testimonials:", error);
      throw error;
    });
};
