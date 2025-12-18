import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { QrCode, CreateQrCodePayload, GetQrCodesParams, GetQrCodesResponse } from "@/types/qrcode.type";
import { createQRCode, deleteQRCode, getAllQRCodes, getQRCodeById, updateQRCode } from "@/services/qrCode.service";

/* =========================
   GET ALL
========================= */
export const useGetAllQRCodes = (params: GetQrCodesParams) =>
  useQuery<GetQrCodesResponse>({
    queryKey: ["qrcodes", params],
    queryFn: () => getAllQRCodes(params),
  });

/* =========================
   GET BY ID
========================= */
export const useGetQRCodeById = (id?: string) =>
  useQuery({
    queryKey: ["qrcode", id],
    queryFn: () => getQRCodeById(id!),
    enabled: !!id,
  });

/* =========================
   CREATE
========================= */
export const useCreateQRCode = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createQRCode,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["qrcodes"] }),
  });
};

/* =========================
   UPDATE
========================= */
export const useUpdateQRCode = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateQrCodePayload }) =>
      updateQRCode(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["qrcodes"] }),
  });
};

/* =========================
   DELETE
========================= */
export const useDeleteQRCode = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteQRCode,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["qrcodes"] }),
  });
};
