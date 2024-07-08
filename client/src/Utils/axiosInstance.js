
import axios from "axios";

const PRO_BASE_URL = "http://localhost:5090/api/v1";

const DEV_BASE_URL = "https://localhost:5173/api/v1";

const axiosInstance = axios.create({
  baseURL: PRO_BASE_URL,
  withCredentials: true,
});

export default axiosInstance;

