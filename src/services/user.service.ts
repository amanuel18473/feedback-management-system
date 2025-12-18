import axiosInstance from "@/lib/axios-instance";
import { CreateUserPayload, GetUsersResponse, User } from "@/types/user";

/* ======================
   CREATE USER
====================== */
export const createUser = async (data: CreateUserPayload): Promise<User> => {
  try {
    const response = await axiosInstance.post("/users", {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      role: data.role,
      branch: data.branch,
      department: data.department,
    });

    return response.data;
  } catch (error: any) {
    if (error.response?.status === 409) {
      throw new Error("EMAIL_EXISTS");
    }
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message;

    throw new Error(errorMessage || "Failed to create user");
  }
};

/* ======================
   GET USERS (WITH PAGINATION & SEARCH)
====================== */
export const getUsers = async (
  params?: { page?: number; limit?: number; search?: string }
): Promise<GetUsersResponse> => {
  try {
    const response = await axiosInstance.get<{
      status: string;
      message: string;
      data: GetUsersResponse;
    }>("/users", { params });

    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to load users");
  }
};

/* ======================
   GET USER BY ID
====================== */
export const getUserById = async (id: string): Promise<User> => {
  try {
    const response = await axiosInstance.get<User>(`/users/${id}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

/* ======================
   UPDATE USER
====================== */
export const updateUser = async (
  id: string,
  data: Partial<CreateUserPayload>
): Promise<User> => {
  try {
    const response = await axiosInstance.patch(`/users/${id}`, data);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

/* ======================
   DELETE USER
====================== */
export const deleteUser = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/users/${id}`);
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

/* ======================
   IMPORT USERS (FILE)
====================== */
export const importUsers = async (file: File): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    await axiosInstance.post("/users/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to import users");
  }
};

/* ======================
   EXPORT USERS
====================== */
export const exportUsers = async (): Promise<Blob> => {
  try {
    const response = await axiosInstance.get("/users/export", {
      responseType: "blob", // important for downloading files
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to export users");
  }
};
