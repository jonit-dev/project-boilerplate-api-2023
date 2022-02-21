import axios from "axios";

export const API_AXIOS = axios.create({
  baseURL: `http://${process.env.API_CONTAINER}:${process.env.SERVER_PORT}`,
});
