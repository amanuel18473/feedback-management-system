import axiosInstance from "@/lib/axios-instance";
import type {
  Feedback,
  CreateFeedbackData,
  GetFeedbacksParams,
  GetFeedbacksResponse,
  SearchFeedbackParams,
  FilterFeedbackParams
} from "@/types/feedback.type";

/* =========================
   GET ALL FEEDBACKS
========================= */
export const getAllFeedbacks = async (params: GetFeedbacksParams = {}): Promise<GetFeedbacksResponse> => {
  const res = await axiosInstance.get<GetFeedbacksResponse>("/feedbacks", { params });
  return res.data;
};

/* =========================
   SEARCH FEEDBACKS
========================= */
export const searchFeedbacks = async ({ search }: SearchFeedbackParams): Promise<Feedback[]> => {
  const res = await axiosInstance.get<Feedback[]>("/feedbacks/search", { params: { search } });
  return res.data;
};

/* =========================
   FILTER FEEDBACKS
========================= */
export const filterFeedbacks = async (params: FilterFeedbackParams): Promise<Feedback[]> => {
  const res = await axiosInstance.get<Feedback[]>("/feedbacks/filter", { params });
  return res.data;
};

/* =========================
   EXPORT FEEDBACKS
========================= */
export const exportFeedbacks = async (): Promise<Blob> => {
  const res = await axiosInstance.get("/feedbacks/export", { responseType: "blob" });
  return res.data;
};

/* =========================
   GET SINGLE FEEDBACK
========================= */
export const getFeedbackById = async (id: string): Promise<Feedback> => {
  const res = await axiosInstance.get<Feedback>(`/feedbacks/${id}`);
  return res.data;
};

/* =========================
   CREATE FEEDBACK
========================= */
export const createFeedback = async (data: CreateFeedbackData): Promise<Feedback> => {
  const res = await axiosInstance.post("/feedbacks", data);
  return res.data;
};

/* =========================
   UPDATE FEEDBACK
========================= */
export const updateFeedback = async (id: string, data: Partial<CreateFeedbackData>): Promise<Feedback> => {
  const res = await axiosInstance.patch(`/feedbacks/${id}`, data);
  return res.data;
};

/* =========================
   DELETE FEEDBACK
========================= */
export const deleteFeedback = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/feedbacks/${id}`);
};
