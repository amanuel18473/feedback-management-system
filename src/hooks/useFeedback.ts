import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  Feedback,
  CreateFeedbackData,
  GetFeedbacksParams,
  GetFeedbacksResponse,
  SearchFeedbackParams,
  FilterFeedbackParams
} from "@/types/feedback.type";
import { createFeedback, deleteFeedback, exportFeedbacks, filterFeedbacks, getAllFeedbacks, searchFeedbacks, updateFeedback } from "@/services/feedback-service";


/* =========================
   GET ALL FEEDBACKS
========================= */
export const useGetAllFeedbacks = (params: GetFeedbacksParams) =>
  useQuery<GetFeedbacksResponse>({
    queryKey: ["feedbacks", params],
    queryFn: () => getAllFeedbacks(params),
  });

/* =========================
   SEARCH FEEDBACKS
========================= */
export const useSearchFeedbacks = (params: SearchFeedbackParams) =>
  useQuery<Feedback[]>({
    queryKey: ["feedbacks-search", params],
    queryFn: () => searchFeedbacks(params),
  });

/* =========================
   FILTER FEEDBACKS
========================= */
export const useFilterFeedbacks = (params: FilterFeedbackParams) =>
  useQuery<Feedback[]>({
    queryKey: ["feedbacks-filter", params],
    queryFn: () => filterFeedbacks(params),
  });

/* =========================
   EXPORT FEEDBACKS
========================= */
export const useExportFeedbacks = () =>
  useMutation({
    mutationFn: exportFeedbacks,
    onSuccess: (data) => {
      const url = window.URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "feedbacks.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Feedback exported");
    },
  });

/* =========================
   CREATE FEEDBACK
========================= */
export const useCreateFeedback = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createFeedback,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["feedbacks"] });
      toast.success("Feedback created successfully");
    },
  });
};

/* =========================
   UPDATE FEEDBACK
========================= */
export const useUpdateFeedback = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateFeedbackData> }) =>
      updateFeedback(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["feedbacks"] });
      toast.success("Feedback updated successfully");
    },
  });
};

/* =========================
   DELETE FEEDBACK
========================= */
export const useDeleteFeedback = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteFeedback,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["feedbacks"] });
      toast.success("Feedback deleted successfully");
    },
  });
};
