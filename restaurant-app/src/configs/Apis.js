import axios from "axios";

export const endpoints = {
  categories: "/categories",
  dishes: "/dishes",
  login: "/login",
  register: "/register",
  profile: "/secure/profile",
  "add-order": "/secure/orders",
  "order-detail": (orderId) => `/secure/orders/${orderId}`,
};

export default axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

export const authApis = (token) => {
  const instance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // instance.interceptors.response.use(
  //   (response) => response,
  //   async (error) => {
  //     const originalRequest = error.config;

  //     if (error.response && error.response.status === 401 && !originalRequest._retry) {
  //       originalRequest._retry = true;
  //       const newToken = await refreshAccessToken();

  //       if (newToken) {
  //         originalRequest.headers.Authorization = `Bearer ${newToken}`;
  //         return instance(originalRequest);
  //       }
  //     }

  //     return Promise.reject(error);
  //   }
  // );

  return instance;
};
