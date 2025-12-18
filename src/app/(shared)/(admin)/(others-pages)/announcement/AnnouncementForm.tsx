"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/form/dialog";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import Textarea from "@/components/form/form-elements/TextareaField";
import { useCreateAnnouncement, useUpdateAnnouncement } from "@/hooks/useAnnouncements";
import type { Announcement, CreateAnnouncementPayload } from "@/types/announcement.typs";

interface Props {
  open: boolean;
  onClose: () => void;
  initialData?: Announcement | null;
}

const TYPE_OPTIONS = ["Announcement", "News", "Update", "Event", "Maintenance", "Other"];
const STATUS_OPTIONS = ["Published", "Draft"];
const TARGET_AUDIENCE_OPTIONS = ["All", "Customers", "Staff", "Admins", "Specific Branch", "Specific Department"];

export default function AnnouncementDialog({ open, onClose, initialData }: Props) {
  const [form, setForm] = useState<CreateAnnouncementPayload>({
    title: "",
    description: "",
    type: "",
    status: "",
    targetAudience: "",
    image: undefined,
  });

  const { mutateAsync: create } = useCreateAnnouncement();
  const { mutateAsync: update } = useUpdateAnnouncement();

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title,
        description: initialData.description,
        type: initialData.type,
        status: initialData.status,
        targetAudience: initialData.targetAudience,
        image: undefined,
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("type", form.type);
      formData.append("status", form.status);
      formData.append("targetAudience", form.targetAudience);
      if (form.image) formData.append("image", form.image);

      if (initialData) {
        await update({ id: initialData._id, data: formData as any });
      } else {
        await create(formData as any);
      }

      onClose();
    } catch (err: any) {
      console.error("Failed to submit announcement:", err.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-lg sm:max-w-xl md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Announcement" : "Add Announcement"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <Textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />

          <div>
            <label className="block mb-1 font-medium">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="block w-full border rounded p-2"
              required
            >
              <option value="">Select Type</option>
              {TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="block w-full border rounded p-2"
              required
            >
              <option value="">Select Status</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Target Audience</label>
            <select
              value={form.targetAudience}
              onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
              className="block w-full border rounded p-2"
              required
            >
              <option value="">Select Audience</option>
              {TARGET_AUDIENCE_OPTIONS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setForm({ ...form, image: e.target.files?.[0] })}
              className="block w-full border rounded p-2"
            />
          </div>

          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{initialData ? "Update" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
