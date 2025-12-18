"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/form/dialog";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { CreateFeedbackData, Feedback } from "@/types/feedback.type";
import { useCreateFeedback, useUpdateFeedback } from "@/hooks/useFeedback";

interface Props {
  open: boolean;
  onClose: () => void;
  feedback?: Feedback | null;
}

const EMPTY_FORM: CreateFeedbackData = {
  userName: "",
  email: "",
  subject: "",
  message: "",
};

export default function FeedbackFormDialog({ open, onClose, feedback }: Props) {
  const isEdit = !!feedback;
  const [form, setForm] = useState<CreateFeedbackData>(EMPTY_FORM);

  const { mutateAsync: createFeedback } = useCreateFeedback();
  const { mutateAsync: updateFeedback } = useUpdateFeedback();

  useEffect(() => {
    if (feedback)
      setForm({
        userName: feedback.userName,
        email: feedback.email,
        subject: feedback.subject,
        message: feedback.message,
      });
    else setForm(EMPTY_FORM);
  }, [feedback]);

  const handleSubmit = async () => {
    if (isEdit && feedback) await updateFeedback({ id: feedback.feedbackId, data: form });
    else await createFeedback(form);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Feedback" : "Add Feedback"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <Input placeholder="User Name" value={form.userName} onChange={(e) => setForm({ ...form, userName: e.target.value })} />
          <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          <Input placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        </div>

        <DialogFooter className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{isEdit ? "Update" : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
