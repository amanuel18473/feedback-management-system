"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/ui/dialog";
import { Button } from "@/components/ui/ui/button";
import { Skeleton } from "@/components/ui/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { getQrCodeById } from "@/services/qrCode.service";

/* ---------- TYPES ---------- */

interface QrCode {
  id: string;
  code: string;
  description?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  scannedAt?: string;
}

interface BackendQrCode {
  _id: string;
  code: string;
  description?: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
  scannedAt?: string;
}

interface ViewQrCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  qrCodeId: string | null;
}

/* ---------- COMPONENT ---------- */

export function ViewQrCodeDialog({
  open,
  onOpenChange,
  qrCodeId,
}: ViewQrCodeDialogProps) {
  const {
    data: qrCode,
    isLoading,
    error,
  } = useQuery<QrCode | null>({
    queryKey: ["qrCode", qrCodeId],
    queryFn: async () => {
      if (!qrCodeId) return null;

      const backendQrCode =
        (await getQrCodeById(qrCodeId)) as unknown as BackendQrCode;

      return {
        id: backendQrCode._id,
        code: backendQrCode.code, // ✅ REQUIRED
        description: backendQrCode.description,
        status: backendQrCode.status,
        createdAt: backendQrCode.createdAt,
        updatedAt: backendQrCode.updatedAt,
        scannedAt: backendQrCode.scannedAt,
      };
    },
    enabled: !!qrCodeId,
  });

  const handleClose = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-background text-foreground">
        <DialogHeader>
          <DialogTitle>QR Code Details</DialogTitle>
          <DialogDescription>
            View full information of the QR code.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {/* ---------- LOADING ---------- */}
          {isLoading && (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          )}

          {/* ---------- ERROR ---------- */}
          {error && (
            <p className="text-destructive">
              Failed to load QR code details
            </p>
          )}

          {/* ---------- DATA ---------- */}
          {qrCode && (
            <div className="space-y-2 text-sm">
              <div>
                <strong>Code:</strong> {qrCode.code}
              </div>

              {qrCode.description && (
                <div>
                  <strong>Description:</strong> {qrCode.description}
                </div>
              )}

              {qrCode.status && (
                <div>
                  <strong>Status:</strong> {qrCode.status}
                </div>
              )}

              {qrCode.createdAt && (
                <div>
                  <strong>Created At:</strong>{" "}
                  {new Date(qrCode.createdAt).toLocaleString()}
                </div>
              )}

              {qrCode.updatedAt && (
                <div>
                  <strong>Updated At:</strong>{" "}
                  {new Date(qrCode.updatedAt).toLocaleString()}
                </div>
              )}

              {qrCode.scannedAt && (
                <div>
                  <strong>Last Scanned:</strong>{" "}
                  {new Date(qrCode.scannedAt).toLocaleString()}
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={handleClose}
            className="text-gray-700 border-gray-300 hover:bg-gray-100 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
