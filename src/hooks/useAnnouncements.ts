import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  Announcement,
  CreateAnnouncementPayload,
  GetAnnouncementsParams,
  GetAnnouncementsResponse,
} from "@/types/announcement.typs";
import {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "@/services/announcement.service";

/* ======================
   GET ALL
====================== */
export const useGetAllAnnouncements = (params: GetAnnouncementsParams) =>
  useQuery<GetAnnouncementsResponse>({
    queryKey: ["announcements", params],
    queryFn: () => getAnnouncements(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });


/* ======================
   GET BY ID
====================== */
export const useGetAnnouncementById = (id?: string) =>
  useQuery<Announcement>({
    queryKey: ["announcement", id],
    queryFn: () => getAnnouncementById(id!),
    enabled: !!id,
  });

/* ======================
   CREATE
====================== */
export const useCreateAnnouncement = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createAnnouncement,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["announcements"] }),
  });
};

/* ======================
   UPDATE
====================== */
export const useUpdateAnnouncement = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateAnnouncementPayload }) =>
      updateAnnouncement(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["announcements"] }),
  });
};

/* ======================
   DELETE
====================== */
export const useDeleteAnnouncement = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteAnnouncement,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["announcements"] }),
  });
};
