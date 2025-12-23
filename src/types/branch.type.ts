// Branch entity
export interface Branch {
  _id: string;
  branchId: string;
  name: string;
  region: string;
  city: string;
  district: string;
  address?: string;
  grade?: string;
  status?: "Active" | "Inactive";
  manager?: string;
  description?: string;
  telephone: {
    countryCode: string;
    number: string;
  };
  createdAt: string;
  updatedAt: string;
  logo?: {             // optional logo like Announcement image
    url: string;
    publicId: string;
  };
}

// Payloads for API
export interface CreateBranchPayload {
  name: string;
  region: string;
  city: string;
  district: string;
  address?: string;
  grade?: string;
  status?: "Active" | "Inactive";
  manager?: string;
  description?: string;
  telephone: {
    countryCode: string;
    number: string;
  };
  logo?: File;           // optional file for upload
}

export interface UpdateBranchPayload {
  name?: string;
  region?: string;
  city?: string;
  district?: string;
  address?: string;
  grade?: string;
  status?: "Active" | "Inactive";
  manager?: string;
  description?: string;
  telephone?: {
    countryCode: string;
    number: string;
  };
  logo?: File | null;
}

// Pagination
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Backend Response
export interface GetBranchesResponse {
  branches: Branch[];
  pagination: Pagination;
}
