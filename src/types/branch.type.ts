export interface BranchPayload {
  name: string;
  region: string;
  city: string;
  district: string;
  address?: string;
  grade?: string;
  status?: "Active" | "Inactive";
  telephone: {
    countryCode: string;
    number: string;
  };
}

export interface Branch extends BranchPayload {
  _id: string;
  branchId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface GetBranchesResponse {
  branches: Branch[];
  pagination: Pagination;
}
