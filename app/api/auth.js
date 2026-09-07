import axiosInstance from "./axios-instance";

export const authPostSync = async (shop) => {
  return axiosInstance
    .post("/auth/post-setup", { shop })
    .then((res) => res.data);
};
