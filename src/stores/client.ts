import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import { API_CONFIG } from "../config/api";
import type {
  ClientStatus,
  Client,
  CreateStatusRequest,
} from "../types/client";

export const useClientStore = defineStore("client", () => {
  const statuses = ref<ClientStatus[]>([]);

  const fetchStatuses = async () => {
    try {
      const response = await axios.get<ClientStatus[]>(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.clientStatus}`
      );
      statuses.value = response.data;
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const createClient = async (client: Client) => {
    try {
      const response = await axios.post(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.client}`,
        client
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const createStatus = async (status: CreateStatusRequest) => {
    try {
      const response = await axios.post(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.clientStatus}`,
        status
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return {
    statuses,
    fetchStatuses,
    createClient,
    createStatus,
  };
});
