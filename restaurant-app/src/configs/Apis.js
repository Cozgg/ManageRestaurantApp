import axios from "axios";

export const endpoints = {
  categories: "/categories",
  dishes: "/dishes",
};

export default axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});
