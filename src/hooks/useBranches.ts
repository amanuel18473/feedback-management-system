"use client";


import { createBranch, deleteBranch, exportBranches, getBranches, importBranches, updateBranch } from "@/services/branch-service";
import { Branch, CreateBranchPayload, GetBranchesResponse, UpdateBranchPayload } from "@/types/branch.type";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/* ======================
   GET BRANCHES (PAGINATION + SEARCH)
====================== */
export const useGetBranches = (params?: { page?: number; limit?: number; search?: string }) => {
  return useQuery<GetBranchesResponse, Error>({
    queryKey: ["branches", params],
    queryFn: () => getBranches(params),
  });
};

/* ======================
   CREATE BRANCH
====================== */
export const useCreateBranch = () => {
  const queryClient = useQueryClient();
  return useMutation<Branch, Error, CreateBranchPayload>({
    mutationFn: (data) => createBranch(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["branches"] }),
  });
};

/* ======================
   UPDATE BRANCH
====================== */
export const useUpdateBranch = () => {
  const queryClient = useQueryClient();
  return useMutation<Branch, Error, { id: string; data: UpdateBranchPayload }>({
    mutationFn: ({ id, data }) => updateBranch(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["branches"] }),
  });
};

/* ======================
   DELETE BRANCH
====================== */
export const useDeleteBranch = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) => deleteBranch(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["branches"] }),
  });
};

/* ======================
   IMPORT BRANCHES
====================== */
export const useImportBranches = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, File>({
    mutationFn: (file) => importBranches(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["branches"] }),
  });
};

/* ======================
   EXPORT BRANCHES
====================== */
export const useExportBranches = () => {
  return useMutation({
    mutationFn: () => exportBranches(),
  });
};

/* ======================
   VIEW BRANCH DETAIL
====================== */
export const useGetBranchById = (id: string) => {
  return useQuery<Branch, Error>({
    queryKey: ["branch", id],
    queryFn: async () => {
      const branches = await getBranches({});
      const branch = branches.branches.find((b) => b._id === id);
      if (!branch) throw new Error("Branch not found");
      return branch;
    },
    enabled: !!id,
  });
};
