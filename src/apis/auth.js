import client from "./client.js";

const authApi = {
  async login(credentials) {
    const response = await client.post("/auth/login", credentials);
    return response.data;
  },

  async register(userData) {
    const response = await client.post("/auth/register", userData);
    return response.data;
  },

  async logout() {
    const response = await client.post("/auth/logout");
    return response.data;
  },
};

export default authApi;
