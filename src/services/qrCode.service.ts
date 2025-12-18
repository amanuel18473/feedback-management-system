import axiosInstance from "@/lib/axios-instance";
import type { QrCode, CreateQrCodePayload, GetQrCodesParams, GetQrCodesResponse } from "@/types/qrcode.type";

/* =========================
   GET ALL (WITH PARAMS)
========================= */
export const getAllQRCodes = async (params: GetQrCodesParams): Promise<GetQrCodesResponse> => {
  const res = await axiosInstance.get("/qrcodes", { params });
  return res.data;
};

/* =========================
   GET BY ID
========================= */
export const getQRCodeById = async (id: string): Promise<QrCode> => {
  const res = await axiosInstance.get(`/qrcodes/${id}`);
  return res.data;
};

/* =========================
   CREATE
========================= */
export const createQRCode = async (data: CreateQrCodePayload) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) formData.append(key, value as any);
  });

  const res = await axiosInstance.post("/qrcodes", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

/* =========================
   UPDATE
========================= */
export const updateQRCode = async (id: string, data: CreateQrCodePayload) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) formData.append(key, value as any);
  });

  const res = await axiosInstance.put(`/qrcodes/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

/* =========================
   DELETE
========================= */
export const deleteQRCode = async (id: string) => {
  const res = await axiosInstance.delete(`/qrcodes/${id}`);
  return res.data;
};
