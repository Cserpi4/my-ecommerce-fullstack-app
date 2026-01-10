import client from "./client.js";

const userApi = {
  async registerUser(userData) {
    const { data } = await client.post("/users/register", userData);
    return data;
  },

  async loginUser(credentials) {
    const { data } = await client.post("/users/login", credentials);
    return data;
  },

  async logoutUser() {
    const { data } = await client.post("/users/logout");
    return data;
  },

  async fetchUserProfile() {
    const { data } = await client.get("/users/profile");
    return data;
  },

  async updateUserProfile(userData) {
    const { data } = await client.put("/users/profile", userData);
    return data;
  },

  async forgotPassword(email) {
    const { data } = await client.post("/users/forgot-password", { email });
    return data;
  },

  async resetPassword(token, password) {
    const { data } = await client.post(`/users/reset-password/${token}`, { password });
    return data;
  },
};

export default userApi;
