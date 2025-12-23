import { Branch } from "./branch.type";

/* ---------- Main Entity ---------- */
export interface QrCode {
  _id: string;
  name: string;
  description: string;
  type: string;
  branch:string;
  department: string;
  status: string;
  image?: {
    url: string;
    publicId: string;
  };
  createdAt: string;
  updatedAt: string;
  qrCodeId: string;
  slug: string;
}

/* ---------- Payloads ---------- */
export interface CreateQrCodePayload {
  name: string;
  description: string;
  type: string;
  branch:string;
  department: string;
  image?: File;
}

export interface UpdateQrCodePayload {
  name?: string;
  description?: string;
  type?: string;
  branch?: string;
  department?: string;
  status?: string;
  image?: File | null;
}

/* ---------- Pagination ---------- */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/* ---------- Backend Response ---------- */
export interface GetQrCodesResponse {
  qrCodes: QrCode[];
  pagination: Pagination;
}

/* ---------- Query Params ---------- */
export interface GetQrCodesParams {
  page?: number;
  limit?: number;
  status?: string;
}
