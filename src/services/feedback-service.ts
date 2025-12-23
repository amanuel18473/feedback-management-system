import axiosInstance from "@/lib/axios-instance";
import { CreateFeedbackPayload, Feedback, GetFeedbackResponse, UpdateFeedbackPayload } from "@/types/feedback";

/* ======================
   CREATE FEEDBACK
====================== */
export const createFeedback = async (data: CreateFeedbackPayload): Promise<Feedback> => {
  try {
    const formData = new FormData();
    formData.append("customer", data.customer);
    if (data.email) formData.append("email", data.email);
    if (data.phone) formData.append("phone", data.phone);
    formData.append("comment", data.comment);
    formData.append("rating", data.rating.toString());
    formData.append("type", data.type);
    formData.append("department", data.department);
    formData.append("branchId", data.branchId);
    formData.append("status", data.status);

    if (data.attachments) {
      data.attachments.forEach((file) => formData.append("attachments", file));
    }

    const response = await axiosInstance.post("/feedbacks", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to create feedback");
  }
};

/* ======================
   GET FEEDBACKS (PAGINATION + SEARCH)
====================== */
export const getFeedbacks = async (
  params?: { page?: number; limit?: number; search?: string }
): Promise<GetFeedbackResponse> => {
  try {
    const response = await axiosInstance.get("/feedbacks", { params });
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch feedbacks");
  }
};

/* ======================
   GET SINGLE FEEDBACK
====================== */
export const getFeedbackById = async (id: string): Promise<Feedback> => {
  try {
    const response = await axiosInstance.get(`/feedbacks/${id}`);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch feedback");
  }
};

/* ======================
   UPDATE FEEDBACK
====================== */
export const updateFeedback = async (
  id: string,
  data: UpdateFeedbackPayload
): Promise<Feedback> => {
  try {
    const formData = new FormData();
    if (data.customer) formData.append("customer", data.customer);
    if (data.email) formData.append("email", data.email);
    if (data.phone) formData.append("phone", data.phone);
    if (data.comment) formData.append("comment", data.comment);
    if (data.rating !== undefined) formData.append("rating", data.rating.toString());
    if (data.type) formData.append("type", data.type);
    if (data.department) formData.append("department", data.department);
    if (data.branchId) formData.append("branchId", data.branchId);
    if (data.status) formData.append("status", data.status);

    if (data.attachments) {
      data.attachments.forEach((file) => formData.append("attachments", file));
    }

    const response = await axiosInstance.patch(`/feedbacks/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update feedback");
  }
};

/* ======================
   DELETE FEEDBACK
====================== */
export const deleteFeedback = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/feedbacks/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete feedback");
  }
};

/* ======================
   IMPORT FEEDBACKS (FILE)
====================== */
export const importFeedbacks = async (file: File): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    await axiosInstance.post("/feedbacks/import", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to import feedbacks");
  }
};

/* ======================
   EXPORT FEEDBACKS
====================== */
export const exportFeedbacks = async (): Promise<Blob> => {
  try {
    const response = await axiosInstance.get("/feedbacks/export", {
      responseType: "blob", // important for downloading files
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to export feedbacks");
  }
};
