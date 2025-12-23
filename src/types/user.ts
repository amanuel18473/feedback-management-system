// // User
export interface User {
  _id: string;
  fullName: string;
  email: string;
  password?: string; // optional on update
  role: string; // "admin" or "client"
  branch: string;
  department: string;
}

// Payloads
export interface SignInPayload {
  email: string;
  password: string;
}

// types/user.ts

export interface CreateUserPayload {
  fullName: string;
  email: string;
  password: string;
  role: string;
  branch: string;
  department: string;
}

export interface SignUpPayload {
  fullName: string;
  email: string;
  password: string;
  role: string;
  branch: string;
  department: string;
}

// Responses
export interface SignInResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface SignUpResponse {
  message: string;
  user: User;
}

// Optional: pagination for users list
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface GetUsersResponse {
  users: User[];
  pagination: Pagination;
}
