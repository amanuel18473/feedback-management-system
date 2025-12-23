import axiosInstance from "@/lib/axios-instance";
import {
  QrCode,
  CreateQrCodePayload,
  GetQrCodesParams,
  GetQrCodesResponse,
} from "@/types/qrcode.type";

/* ======================
   CREATE QR CODE
====================== */
export const createQrCode = async (
  data: CreateQrCodePayload
): Promise<QrCode> => {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("type", data.type);
    formData.append("branch", data.branch);
    formData.append("department", data.department);
    if (data.image) formData.append("image", data.image);

    const response = await axiosInstance.post("/qrcodes", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to create QR code");
  }
};

/* ======================
   GET QR CODES (PAGINATION)
====================== */
export const getQrCodes = async (
  params?: GetQrCodesParams
): Promise<GetQrCodesResponse> => {
  try {
    const response = await axiosInstance.get("/qrcodes", { params });
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch QR codes");
  }
};

/* ======================
   GET SINGLE QR CODE
====================== */
export const getQrCodeById = async (id: string): Promise<QrCode> => {
  try {
    const response = await axiosInstance.get(`/qrcodes/${id}`);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch QR code");
  }
};

/* ======================
   UPDATE QR CODE
====================== */
export const updateQrCode = async (
  id: string,
  data: CreateQrCodePayload
): Promise<QrCode> => {
  try {
    const formData = new FormData();
    if (data.name) formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    if (data.type) formData.append("type", data.type);
    if (data.branch) formData.append("branch", data.branch);
    if (data.department) formData.append("department", data.department);
    if (data.image !== undefined) formData.append("image", data.image || "");

    const response = await axiosInstance.patch(`/qrcodes/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update QR code");
  }
};

/* ======================
   DELETE QR CODE
====================== */
export const deleteQrCode = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/qrcodes/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete QR code");
  }
};

/* ======================
   IMPORT QR CODES
====================== */
export const importQrCodes = async (file: File): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    await axiosInstance.post("/qrcodes/import", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to import QR codes");
  }
};

/* ======================
   EXPORT QR CODES
====================== */
export const exportQrCodes = async (): Promise<Blob> => {
  try {
    const response = await axiosInstance.get("/qrcodes/export", {
      responseType: "blob",
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to export QR codes");
  }
};
