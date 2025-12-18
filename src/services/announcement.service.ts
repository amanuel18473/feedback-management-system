import axiosInstance from "@/lib/axios-instance";
import type {
  Announcement,
  CreateAnnouncementPayload,
  GetAnnouncementsParams,
  GetAnnouncementsResponse,
} from "@/types/announcement.typs";

/* =========================
   GET ALL (WITH PARAMS)
========================= */
export const getAnnouncements = async (
  params: GetAnnouncementsParams = {}
): Promise<GetAnnouncementsResponse> => {
  const res = await axiosInstance.get<GetAnnouncementsResponse>("/announcements", { params });
  return res.data; // res.data has { success, message, data: { announcements, pagination } }
};

/* =========================
   GET BY ID
========================= */
export const getAnnouncementById = async (id: string): Promise<Announcement> => {
  const res = await axiosInstance.get(`/announcements/${id}`);
  return res.data.data; // the announcement is inside data
};

/* =========================
   CREATE
========================= */
export const createAnnouncement = async (payload: CreateAnnouncementPayload) => {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined) formData.append(key, value as any);
  });

  const res = await axiosInstance.post("/announcements", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data; // return the created announcement
};

/* =========================
   UPDATE
========================= */
export const updateAnnouncement = async (id: string, payload: CreateAnnouncementPayload) => {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined) formData.append(key, value as any);
  });

  const res = await axiosInstance.put(`/announcements/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data; // return the updated announcement
};

/* =========================
   DELETE
========================= */
export const deleteAnnouncement = async (id: string) => {
  const res = await axiosInstance.delete(`/announcements/${id}`);
  return res.data; // success message or deleted ID
};
