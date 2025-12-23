import axiosInstance from "@/lib/axios-instance";
import { Announcement, CreateAnnouncementPayload, GetAnnouncementsResponse, UpdateAnnouncementPayload } from "@/types/announcement.typs";
/* ======================
   CREATE ANNOUNCEMENT
====================== */
export const createAnnouncement = async (data: CreateAnnouncementPayload): Promise<Announcement> => {
  try {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("type", data.type);
    formData.append("status", data.status);
    formData.append("targetAudience", data.targetAudience);
    if (data.image) formData.append("image", data.image);

    const response = await axiosInstance.post("/announcements", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to create announcement");
  }
};

/* ======================
   GET ANNOUNCEMENTS (PAGINATION + SEARCH)
====================== */
export const getAnnouncements = async (
  params?: { page?: number; limit?: number; search?: string }
): Promise<GetAnnouncementsResponse> => {
  try {
    const response = await axiosInstance.get("/announcements", { params });
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch announcements");
  }
};

/* ======================
   GET SINGLE ANNOUNCEMENT
====================== */
export const getAnnouncementById = async (id: string): Promise<Announcement> => {
  try {
    const response = await axiosInstance.get(`/announcements/${id}`);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch announcement");
  }
};

/* ======================
   UPDATE ANNOUNCEMENT
====================== */
export const updateAnnouncement = async (
  id: string,
  data: UpdateAnnouncementPayload
): Promise<Announcement> => {
  try {
    const formData = new FormData();
    if (data.title) formData.append("title", data.title);
    if (data.description) formData.append("description", data.description);
    if (data.type) formData.append("type", data.type);
    if (data.status) formData.append("status", data.status);
    if (data.targetAudience) formData.append("targetAudience", data.targetAudience);
    if (data.image !== undefined) formData.append("image", data.image || "");

    const response = await axiosInstance.patch(`/announcements/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update announcement");
  }
};

/* ======================
   DELETE ANNOUNCEMENT
====================== */
export const deleteAnnouncement = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/announcements/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete announcement");
  }
};

/* ======================
   IMPORT ANNOUNCEMENTS
====================== */
// export const importAnnouncements = async (file: File): Promise<void> => {
//   try {
//     const formData = new FormData();
//     formData.append("file", file);
//     await axiosInstance.post("/announcements/import", formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//   } catch (error: any) {
//     throw new Error(error.response?.data?.message || "Failed to import announcements");
//   }
// };
// IMPORT announcements
export const importAnnouncementsFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axiosInstance.post("announcements/import", {
    method: "POST",
    body: formData,
  });

  // if (!res.ok) {
  //   throw new Error("Import failed");
  // }

  return res.data; // return imported announcements or message
};

/* ======================
   EXPORT ANNOUNCEMENTS
====================== */
export const exportAnnouncements = async (): Promise<Blob> => {
  try {
    const response = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/announcements/export`,
      {
        responseType: "blob", // important for downloading files
      }
    );
    return response.data;
  } catch (err: any) {
    console.error("Failed to export announcements:", err);
    throw new Error(err?.response?.data?.message || "Failed to export announcements");
  }
};
