import axiosInstance from "@/lib/axios-instance";
import { Branch, CreateBranchPayload, GetBranchesResponse, UpdateBranchPayload } from "@/types/branch.type";

/* ======================
   CREATE BRANCH
====================== */
export const createBranch = async (data: CreateBranchPayload): Promise<Branch> => {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("region", data.region);
    formData.append("city", data.city);
    formData.append("district", data.district);
    if (data.address) formData.append("address", data.address);
    if (data.grade) formData.append("grade", data.grade);
    if (data.status) formData.append("status", data.status);
    if (data.manager) formData.append("manager", data.manager);
    if (data.description) formData.append("description", data.description);
    formData.append("telephone[countryCode]", data.telephone.countryCode);
    formData.append("telephone[number]", data.telephone.number);

    if (data.logo) {
      formData.append("logo", data.logo);
    }

    const response = await axiosInstance.post("/branches", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to create branch");
  }
};

/* ======================
   GET BRANCHES (PAGINATION + SEARCH)
====================== */
export const getBranches = async (
  params?: { page?: number; limit?: number; search?: string }
): Promise<GetBranchesResponse> => {
  try {
    const response = await axiosInstance.get("/branches", { params });
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch branches");
  }
};

/* ======================
   GET SINGLE BRANCH
====================== */
export const getBranchById = async (id: string): Promise<Branch> => {
  try {
    const response = await axiosInstance.get(`/branches/${id}`);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch branch");
  }
};

/* ======================
   UPDATE BRANCH
====================== */
export const updateBranch = async (
  id: string,
  data: UpdateBranchPayload
): Promise<Branch> => {
  try {
    const formData = new FormData();
    if (data.name) formData.append("name", data.name);
    if (data.region) formData.append("region", data.region);
    if (data.city) formData.append("city", data.city);
    if (data.district) formData.append("district", data.district);
    if (data.address) formData.append("address", data.address);
    if (data.grade) formData.append("grade", data.grade);
    if (data.status) formData.append("status", data.status);
    if (data.manager) formData.append("manager", data.manager);
    if (data.description) formData.append("description", data.description);
    if (data.telephone) {
      formData.append("telephone[countryCode]", data.telephone.countryCode);
      formData.append("telephone[number]", data.telephone.number);
    }
    if (data.logo !== undefined) formData.append("logo", data.logo || "");

    const response = await axiosInstance.patch(`/branches/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update branch");
  }
};

/* ======================
   DELETE BRANCH
====================== */
export const deleteBranch = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/branches/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete branch");
  }
};

/* ======================
   IMPORT BRANCHES (FILE)
====================== */
export const importBranches = async (file: File): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    await axiosInstance.post("/branches/import", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to import branches");
  }
};

/* ======================
   EXPORT BRANCHES
====================== */
export const exportBranches = async (): Promise<Blob> => {
  try {
    const response = await axiosInstance.get("/branches/export", {
      responseType: "blob", // important for downloading files
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to export branches");
  }
};
