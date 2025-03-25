export interface ClientStatus {
  id: number;
  description: string;
  isActive: boolean;
}

export interface Client {
  id: number;
  fullName: string;
  documentId: string;
  phone: string;
  email: string;
  statusId: number;
}

export interface CreateStatusRequest {
  description: string;
  isActive: boolean;
}

export interface ClientsResponse {
  clients: Client[];
  clientsCount: number;
}

export interface ClientTreeNode {
  id: string;
  name: string;
  count?: number;
  children?: ClientTreeNode[];
  client?: Client;
}