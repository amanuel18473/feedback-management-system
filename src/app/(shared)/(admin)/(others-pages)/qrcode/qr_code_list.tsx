"use client";

import { useState } from "react";
import Button from "@/components/ui/button/Button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import type { QrCode } from "@/types/qrcode.type";
import { TableHead } from "@/components/ui/ui/table";
import { useDeleteQRCode, useGetAllQRCodes } from "@/hooks/useQrCodes";
import QRCodeDialog from "./qr_code_form";

export default function QRCodeList() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useGetAllQRCodes({ page, limit, status: "Active" });
  const { mutate: deleteQRCode } = useDeleteQRCode();
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState<QrCode | null>(null);

  if (isLoading) return <p>Loading QR Codes...</p>;

  return (
    <div className="p-6 space-y-4">
      <Button onClick={() => setOpenDialog(true)}>Add QR Code</Button>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Branch</TableHead>
            <TableHead>Department</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.qrCodes.map((q) => (
            <TableRow key={q.id}>
              <TableCell>{q.name}</TableCell>
              <TableCell>{q.type}</TableCell>
              <TableCell>{q.branch}</TableCell>
              <TableCell>{q.department}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button size="sm" onClick={() => { setEditing(q); setOpenDialog(true); }}>Edit</Button>
                <Button size="sm" onClick={() => deleteQRCode(q.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <QRCodeDialog
        open={openDialog}
        initialData={editing}
        onClose={() => { setOpenDialog(false); setEditing(null); }}
      />
    </div>
  );
}
