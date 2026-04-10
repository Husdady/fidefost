// Librarys
import axios from "axios";

// Constants
import { TOKEN, API_KEY, API_URL } from "data/envs";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "x-api-key": API_KEY,
    "Content-Type": "application/json",
    Authorization: `Bearer ${TOKEN}`,
  },
});

export default api;
