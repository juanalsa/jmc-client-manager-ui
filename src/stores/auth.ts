import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import { API_CONFIG } from "../config/api";
import type { LoginCredentials, LoginResponse } from "../types/auth";

export const useAuthStore = defineStore("auth", () => {
  const accessToken = ref<string | null>(localStorage.getItem("accessToken"));
  const isAuthenticated = ref(!!accessToken.value);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await axios.post<LoginResponse>(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.auth}`,
        credentials
      );
      accessToken.value = response.data.accessToken;
      isAuthenticated.value = true;

      // Store token in localStorage
      localStorage.setItem("accessToken", response.data.accessToken);

      // Set the token in axios defaults
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${accessToken.value}`;

      return true;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    accessToken.value = null;
    isAuthenticated.value = false;
    // Clear token from localStorage
    localStorage.removeItem("accessToken");
    delete axios.defaults.headers.common["Authorization"];
  };

  // Initialize axios headers if token exists
  if (accessToken.value) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken.value}`;
  }

  return {
    accessToken,
    isAuthenticated,
    login,
    logout,
  };
});
