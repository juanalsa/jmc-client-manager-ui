import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";
import { API_CONFIG } from "../config/api";
import type {
  ClientStatus,
  Client,
  CreateStatusRequest,
  ClientsResponse,
  ClientTreeNode,
} from "../types/client";

export const useClientStore = defineStore("client", () => {
  const statuses = ref<ClientStatus[]>([]);
  const clientsByStatus = ref<Map<number, Client[]>>(new Map());
  const clientsCountByStatus = ref<Map<number, number>>(new Map());
  const totalClients = ref(0);

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

  const fetchClientsByStatus = async (statusId: number) => {
    try {
      const response = await axios.get<ClientsResponse>(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.client}?statusId=${statusId}`
      );
      clientsByStatus.value.set(statusId, response.data.clients);
      clientsCountByStatus.value.set(statusId, response.data.clientsCount);
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

  const buildClientTree = computed((): ClientTreeNode[] => {
    let total = 0;
    clientsCountByStatus.value.forEach((count) => (total += count));
    totalClients.value = total;

    const rootNode: ClientTreeNode = {
      id: "root",
      name: `JMC ${total}`,
      count: total,
      children: [],
    };

    statuses.value.forEach((status) => {
      const statusClients = clientsByStatus.value.get(status.id) || [];
      const statusCount = clientsCountByStatus.value.get(status.id) || 0;

      const statusNode: ClientTreeNode = {
        id: `status-${status.id}`,
        name: status.description,
        count: statusCount,
        children: statusClients.map((client) => ({
          id: `client-${client.id}`,
          name: client.fullName,
          client: client,
        })),
      };

      rootNode.children?.push(statusNode);
    });

    return [rootNode];
  });

  return {
    statuses,
    clientsByStatus,
    clientsCountByStatus,
    totalClients,
    fetchStatuses,
    fetchClientsByStatus,
    createClient,
    createStatus,
    buildClientTree,
  };
});
