export interface ClientStatus {
  id: number;
  description: string;
  isActive: boolean;
}

export interface Client {
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