"use client";

import {
  createQrCode,
  deleteQrCode,
  exportQrCodes,
  getQrCodes,
  importQrCodes,
  updateQrCode,
} from "@/services/qrCode.service";
import {
  QrCode,
  CreateQrCodePayload,
  GetQrCodesResponse,
} from "@/types/qrcode.type";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/* ======================
   GET QR CODES (WITH PAGINATION & FILTER)
====================== */
export const useGetQrCodes = (params?: {
  page?: number;
  limit?: number;
  status?: string;
}) => {
  return useQuery<GetQrCodesResponse, Error>({
    queryKey: ["qrCodes", params],
    queryFn: () => getQrCodes(params),
  });
};

/* ======================
   CREATE QR CODE
====================== */
export const useCreateQrCode = () => {
  const queryClient = useQueryClient();
  return useMutation<QrCode, Error, CreateQrCodePayload>({
    mutationFn: (data) => createQrCode(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["qrCodes"] }),
  });
};

/* ======================
   UPDATE QR CODE
====================== */
export const useUpdateQrCode = () => {
  const queryClient = useQueryClient();
  return useMutation<
    QrCode,
    Error,
    { id: string; data: CreateQrCodePayload }
  >({
    mutationFn: ({ id, data }) => updateQrCode(id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["qrCodes"] }),
  });
};

/* ======================
   DELETE QR CODE
====================== */
export const useDeleteQrCode = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) => deleteQrCode(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["qrCodes"] }),
  });
};

/* ======================
   IMPORT QR CODES
====================== */
export const useImportQrCodes = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, File>({
    mutationFn: (file: File) => importQrCodes(file),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["qrCodes"] }),
  });
};

/* ======================
   EXPORT QR CODES
====================== */
export const useExportQrCodes = () => {
  return useMutation({
    mutationFn: () => exportQrCodes(),
  });
};

/* ======================
   VIEW QR CODE DETAIL
====================== */
export const useGetQrCodeById = (id: string) => {
  return useQuery<QrCode, Error>({
    queryKey: ["qrCode", id],
    queryFn: async () => {
      const qrCodes = await getQrCodes({});
      const qrCode = qrCodes.qrCodes.find((q) => q._id === id);
      if (!qrCode) throw new Error("QR Code not found");
      return qrCode;
    },
    enabled: !!id,
  });
};
