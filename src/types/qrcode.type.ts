export interface QrCode {
  id: string;
  name: string;
  description: string;
  type: string;
  branch: string;
  department: string;
  image?: File | string;
}

export interface CreateQrCodePayload {
  name: string;
  description: string;
  type: string;
  branch: string;
  department: string;
  image?: File;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface GetQrCodesResponse {
  qrCodes: QrCode[];
  pagination: Pagination;
}

export interface GetQrCodesParams {
  page?: number;
  limit?: number;
  status?: string;
}
