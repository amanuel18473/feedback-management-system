"use client";

import { createAnnouncement, deleteAnnouncement, exportAnnouncements, getAnnouncements,  importAnnouncementsFile,  updateAnnouncement } from "@/services/announcement.service";
import { Announcement, CreateAnnouncementPayload, GetAnnouncementsResponse, UpdateAnnouncementPayload } from "@/types/announcement.typs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/* ======================
   GET ANNOUNCEMENTS (WITH PAGINATION & SEARCH)
====================== */
export const useGetAnnouncements = (params?: { page?: number; limit?: number; search?: string }) => {
  return useQuery<GetAnnouncementsResponse, Error>({
    queryKey: ["announcements", params],
    queryFn: () => getAnnouncements(params),
  });
};

/* ======================
   CREATE ANNOUNCEMENT
====================== */
export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation<Announcement, Error, CreateAnnouncementPayload>({
    mutationFn: (data) => createAnnouncement(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["announcements"] }),
  });
};

/* ======================
   UPDATE ANNOUNCEMENT
====================== */
export const useUpdateAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation<Announcement, Error, { id: string; data: UpdateAnnouncementPayload }>({
    mutationFn: ({ id, data }) => updateAnnouncement(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["announcements"] }),
  });
};

/* ======================
   DELETE ANNOUNCEMENT
====================== */
export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) => deleteAnnouncement(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["announcements"] }),
  });
};

export const useImportAnnouncements = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, File>({
    mutationFn: (file: File) => importAnnouncementsFile(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["announcements"] }),
  });
};
/* ======================
   EXPORT ANNOUNCEMENTS
====================== */
export const useExportAnnouncements = () => {
  return useMutation({
    mutationFn: () => exportAnnouncements(),
  });
};
/* ======================
   VIEW ANNOUNCEMENT DETAIL
====================== */
export const useGetAnnouncementById = (id: string) => {
  return useQuery<Announcement, Error>({
    queryKey: ["announcement", id],
    queryFn: async () => {
      const announcements = await getAnnouncements({});
      const announcement = announcements.announcements.find((a) => a._id === id);
      if (!announcement) throw new Error("Announcement not found");
      return announcement;
    },
    enabled: !!id,
  });
};
