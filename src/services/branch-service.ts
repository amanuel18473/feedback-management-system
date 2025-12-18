import axiosInstance from "@/lib/axios-instance";
import { BranchPayload, GetBranchesResponse, Branch } from "@/types/branch.type";

/* =========================
   GET ALL (WITH PARAMS)
========================= */
export const getAllBranches = async (params: {
  page: number;
  limit: number;
  status: string;
}): Promise<GetBranchesResponse> => {
  const res = await axiosInstance.get("/branches", { params });
  return res.data.data;
};

/* =========================
   GET BY ID
========================= */
export const getBranchById = async (id: string): Promise<Branch> => {
  const res = await axiosInstance.get(`/branches/${id}`);
  return res.data.data;
};

/* =========================
   CREATE
========================= */
export const createBranch = async (data: BranchPayload) => {
  const res = await axiosInstance.post("/branches", data);
  return res.data;
};

/* =========================
   UPDATE
========================= */
export const updateBranch = async (id: string, data: BranchPayload) => {
  const res = await axiosInstance.put(`/branches/${id}`, data);
  return res.data;
};

/* =========================
   DELETE
========================= */
export const deleteBranch = async (id: string) => {
  const res = await axiosInstance.delete(`/branches/${id}`);
  return res.data;
};
