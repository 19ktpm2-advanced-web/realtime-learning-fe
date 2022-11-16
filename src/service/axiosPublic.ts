import axios from "axios";
import { config } from "../config";

const instance = axios.create({
  baseURL: config.apiConfig.DOMAIN_NAME,
  headers: {
    "Content-Type": "application/json"
  }
});

export default instance;
