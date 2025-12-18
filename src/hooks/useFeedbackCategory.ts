// hooks/useFeedback.ts
"use client";

import { CreateFeedbackData, Feedback } from "@/types/feedback";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// API endpoints
const FEEDBACK_API = "/api/v1/feedbacks";

// Fetch all feedbacks
export const useGetFeedbacks = () => {
  return useQuery<Feedback[], Error>({
    queryKey: ["feedbacks"],
    queryFn: async () => {
      const { data } = await axios.get(FEEDBACK_API);
      return data;
    },
  });
};

// Create feedback
export const useCreateFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateFeedbackData) => {
      const response = await axios.post(FEEDBACK_API, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
    },
  });
};

// Update feedback
export const useUpdateFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CreateFeedbackData }) => {
      const response = await axios.put(`${FEEDBACK_API}/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
    },
  });
};

// Delete feedback
export const useDeleteFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`${FEEDBACK_API}/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
    },
  });
};
