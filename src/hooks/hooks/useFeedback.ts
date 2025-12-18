"use client";

import { FeedbackService } from "@/services/services/feedback.service";
import { CreateFeedbackData, Feedback } from "@/types/type/feedback.type";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// 🟢 GET ALL FEEDBACKS
export function useGetFeedbacks() {
  return useQuery<Feedback[], Error>({
    queryKey: ["feedbacks"],
    queryFn: FeedbackService.getAll,
  });
}

// 🟢 GET SINGLE FEEDBACK BY ID
export function useGetFeedback(id: string) {
  return useQuery<Feedback, Error>({
    queryKey: ["feedback", id],
    queryFn: () => FeedbackService.getById(id),
    enabled: !!id, // Only fetch if ID exists
  });
}

// 🟢 CREATE FEEDBACK
export function useCreateFeedback() {
  const queryClient = useQueryClient();
  return useMutation<Feedback, Error, CreateFeedbackData>({
    mutationFn: (data) => FeedbackService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
    },
  });
}

// 🟢 UPDATE FEEDBACK
export function useUpdateFeedback() {
  const queryClient = useQueryClient();
  return useMutation<Feedback, Error, { id: string; data: CreateFeedbackData }>({
    mutationFn: ({ id, data }) => FeedbackService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
      queryClient.invalidateQueries({ queryKey: ["feedback", id] });
    },
  });
}

// 🟢 DELETE FEEDBACK
export function useDeleteFeedback() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) => FeedbackService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
    },
  });
}

// 🟢 SEARCH FEEDBACKS (client-side filtering example)
export function useSearchFeedbacks(search: string) {
  const { data = [], ...rest } = useGetFeedbacks();

  const filtered = data.filter((f) =>
    `${f.customerName} ${f.category} ${f.status} ${f.tags?.join(" ")}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return { data: filtered, ...rest };
}
