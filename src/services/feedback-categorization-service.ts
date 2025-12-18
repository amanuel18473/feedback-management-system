import { CreateFeedbackData, Feedback } from "@/types/feedback";
import axios from "axios";

const API_URL = "/api/v1/feedbacks";

export const getFeedbacks = async (): Promise<Feedback[]> => {
  const { data } = await axios.get(API_URL);
  return data;
};

export const createFeedback = async (feedback: CreateFeedbackData) => {
  const { data } = await axios.post(API_URL, feedback);
  return data;
};

export const deleteFeedback = async (id: string) => {
  const { data } = await axios.delete(`${API_URL}/${id}`);
  return data;
};

export const getBranches = async () => {
  const { data } = await axios.get("/api/v1/branches");
  return data;
};
