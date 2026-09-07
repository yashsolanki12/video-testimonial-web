import axios from "axios";

const getBaseURL = () => {
  const backendDomain =
    import.meta.env.VITE_BACKEND_API_URL ||
    "https://video-testimonial-backend.onrender.com";
  return `${backendDomain}/api/`;
};

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const shop =
      config.params?.shop ||
      (typeof config.data === "object" && config.data?.shop) ||
      null;
    if (shop) {
      config.headers["x-shopify-shop-domain"] = shop;
    }
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  },
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data,
    });
    return Promise.reject(error);
  },
);

export default axiosInstance;
