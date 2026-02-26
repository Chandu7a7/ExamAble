// Central API base URL — reads from Vite env in prod, falls back to localhost for dev
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default API_BASE;
