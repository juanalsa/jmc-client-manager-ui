import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import { API_CONFIG } from "../config/api";
import type { LoginCredentials, LoginResponse } from "../types/auth";

export const useAuthStore = defineStore("auth", () => {
  const accessToken = ref<string | null>(null);
  const isAuthenticated = ref(false);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await axios.post<LoginResponse>(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.auth}`,
        credentials
      );
      accessToken.value = response.data.accessToken;
      isAuthenticated.value = true;

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
    delete axios.defaults.headers.common["Authorization"];
  };

  return {
    accessToken,
    isAuthenticated,
    login,
    logout,
  };
});
