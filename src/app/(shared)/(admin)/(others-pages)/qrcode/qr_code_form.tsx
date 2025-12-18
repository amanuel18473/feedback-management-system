"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/form/dialog";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import type { QrCode, CreateQrCodePayload } from "@/types/qrcode.type";
import { useCreateQRCode, useUpdateQRCode } from "@/hooks/useQrCodes";

interface Props {
  open: boolean;
  onClose: () => void;
  initialData?: QrCode | null;
}

const EMPTY_FORM: CreateQrCodePayload = {
  name: "",
  description: "",
  type: "",
  branch: "",
  department: "",
  image: undefined,
};

export default function QRCodeDialog({ open, onClose, initialData }: Props) {
  const [form, setForm] = useState<CreateQrCodePayload>(EMPTY_FORM);

  const { mutateAsync: create } = useCreateQRCode();
  const { mutateAsync: update } = useUpdateQRCode();

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        description: initialData.description,
        type: initialData.type,
        branch: initialData.branch,
        department: initialData.department,
        image: undefined,
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (initialData) {
      await update({ id: initialData.id, data: form });
    } else {
      await create(form);
    }

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit QR Code" : "Add QR Code"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Input placeholder="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
          <Input placeholder="Branch" value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} />
          <Input placeholder="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
          <input type="file" onChange={(e) => setForm({ ...form, image: e.target.files?.[0] })} />

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{initialData ? "Update" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
