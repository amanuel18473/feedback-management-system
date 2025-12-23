"use client";


import { createFeedback, deleteFeedback, exportFeedbacks, getFeedbacks, importFeedbacks, updateFeedback } from "@/services/feedback-service";
import { Feedback, CreateFeedbackPayload, GetFeedbackResponse, UpdateFeedbackPayload } from "@/types/feedback";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/* ======================
   GET FEEDBACKS (PAGINATION + SEARCH)
====================== */
export const useGetFeedbacks = (params?: { page?: number; limit?: number; search?: string }) => {
  return useQuery<GetFeedbackResponse, Error>({
    queryKey: ["feedbacks", params],
    queryFn: () => getFeedbacks(params),
  });
};

/* ======================
   CREATE FEEDBACK
====================== */
export const useCreateFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation<Feedback, Error, CreateFeedbackPayload>({
    mutationFn: (data) => createFeedback(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["feedbacks"] }),
  });
};

/* ======================
   UPDATE FEEDBACK
====================== */
export const useUpdateFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation<Feedback, Error, { id: string; data: UpdateFeedbackPayload }>({
    mutationFn: ({ id, data }) => updateFeedback(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["feedbacks"] }),
  });
};

/* ======================
   DELETE FEEDBACK
====================== */
export const useDeleteFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) => deleteFeedback(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["feedbacks"] }),
  });
};

/* ======================
   IMPORT FEEDBACKS
====================== */
export const useImportFeedbacks = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, File>({
    mutationFn: (file) => importFeedbacks(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["feedbacks"] }),
  });
};

/* ======================
   EXPORT FEEDBACKS
====================== */
export const useExportFeedbacks = () => {
  return useMutation({
    mutationFn: () => exportFeedbacks(),
  });
};

/* ======================
   VIEW FEEDBACK DETAIL
====================== */
export const useGetFeedbackById = (id: string) => {
  return useQuery<Feedback, Error>({
    queryKey: ["feedback", id],
    queryFn: async () => {
      const feedbacks = await getFeedbacks({});
      const feedback = feedbacks.feedbacks.find((f) => f._id === id);
      if (!feedback) throw new Error("Feedback not found");
      return feedback;
    },
    enabled: !!id,
  });
};
