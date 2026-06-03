import axios from "axios";
import cookies from "react-cookies";
export const endpoints = {
  categories: "/categories",
  dishes: "/dishes",
  "chef-dishes": "/secure/chef/dishes",
  login: "/login",
  register: "/register",
  profile: "/secure/profile",
  "add-order": "/secure/orders",
  "order-detail": (orderId) => `/secure/orders/${orderId}`,
  "chef-order-detail": (orderId) => `/secure/chef/orders/${orderId}`,
  tables: "/tables",
  reservations: "/secure/reservations",
  "reservations-user": (userId) => `/secure/reservations/user/${userId}`,
  "reservations-table": (tableId) => `/secure/reservations/table/${tableId}`,
  "reservation-detail": (id) => `/secure/reservations/${id}`,
  "get-orders": "/secure/orders",
  "dish-rating": (dishId) => `/secure/dishes/${dishId}/rating`,
  "update-rating": (dishId) => `/secure/dishes/${dishId}/rating`,
  "dish-ratings": (dishId) => `/dishes/${dishId}/rating`,
  "my-rating": (dishId) => `/secure/dishes/${dishId}/my-rating`,
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

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        try {
          const refreshToken = cookies.load("refreshToken");
          if (refreshToken) {
            const res = await axios.post(
              `${process.env.REACT_APP_BASE_URL}/refresh-token`,
              {
                refreshToken,
              },
            );
            if (res.status === 200 && res.data.accessToken) {
              const newToken = res.data.accessToken;
              cookies.save("token", newToken, {path: "/"});
              cookies.save("refreshToken", res.data.refreshToken, {path: "/"});
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return instance(originalRequest);
            }
          }
        } catch (refreshErr) {
          console.error("Refresh token expired or failed", refreshErr);
          cookies.remove("token");
          cookies.remove("refreshToken");
          window.location.href = "/login";
        }
      }

      return Promise.reject(error);
    },
  );

  return instance;
};
