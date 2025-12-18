import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { BranchPayload, GetBranchesResponse } from "@/types/branch.type";
import { createBranch, deleteBranch, getAllBranches, getBranchById, updateBranch } from "@/services/branch-service";

/* =========================
   GET ALL (WITH PARAMS)
========================= */
export const useGetAllBranches = (params: {
  page: number;
  limit: number;
  status: string;
}) =>
  useQuery<GetBranchesResponse>({
    queryKey: ["branches", params],
    queryFn: () => getAllBranches(params),
  });

/* =========================
   GET BY ID
========================= */
export const useGetBranchById = (id?: string) =>
  useQuery({
    queryKey: ["branch", id],
    queryFn: () => getBranchById(id!),
    enabled: !!id,
  });

/* =========================
   CREATE
========================= */
export const useCreateBranch = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createBranch,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["branches"] });
      toast.success("Branch created");
    },
  });
};

/* =========================
   UPDATE
========================= */
export const useUpdateBranch = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: BranchPayload }) =>
      updateBranch(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["branches"] });
      toast.success("Branch updated");
    },
  });
};

/* =========================
   DELETE
========================= */
export const useDeleteBranch = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteBranch,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["branches"] });
      toast.success("Branch deleted");
    },
  });
};
