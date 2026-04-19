import axios from "axios";

export const endpoints = {
  categories: "/categories",
  products: "/products",
};

export default axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});
