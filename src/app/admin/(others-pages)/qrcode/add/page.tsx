"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/ui/dialog";
import { Label } from "@/components/ui/ui/label";
import { Input } from "@/components/ui/ui/input";
import { Textarea } from "@/components/ui/ui/textarea";
import { Button } from "@/components/ui/ui/button";
import { useCreateQrCode, useUpdateQrCode } from "@/hooks/useQrCodes";

/* ======================
   SCHEMA
====================== */
const qrCodeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(2, "Description must be at least 2 characters"),
  type: z.string().min(1, "Type is required"),
  branch: z.string().min(1, "Branch is required"),
  department: z.string().min(1, "Department is required"),
  image: z.any().optional(),
});

export type QrCodeFormData = z.infer<typeof qrCodeSchema>;

interface QrCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  qrCode?: QrCodeFormData & { id?: string }; // optional for edit
}

export function QrCodeDialog({ open, onOpenChange, qrCode }: QrCodeDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createQrCode = useCreateQrCode();
  const updateQrCode = useUpdateQrCode();

  const form = useForm<QrCodeFormData>({
    resolver: zodResolver(qrCodeSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "",
      branch: "",
      department: "",
      image: undefined,
    },
    mode: "onChange",
  });

  /* ======================
     POPULATE FORM (EDIT)
  ====================== */
  useEffect(() => {
    if (qrCode) {
      form.reset(qrCode);
    }
  }, [qrCode]);

  /* ======================
     SUBMIT
  ====================== */
  const onSubmit = async (data: QrCodeFormData) => {
    try {
      setIsSubmitting(true);

      if (qrCode?.id) {
        // Edit
        await updateQrCode.mutateAsync({ id: qrCode.id, data });
        toast.success("QR Code updated successfully");
      } else {
        // Create
        await createQrCode.mutateAsync(data);
        toast.success("QR Code created successfully");
      }

      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to save QR Code");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    form.clearErrors();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[1000px] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <DialogHeader>
          <DialogTitle>{qrCode ? "Edit QR Code" : "Add New QR Code"}</DialogTitle>
          <DialogDescription>
            {qrCode ? "Update QR Code details" : "Create a new QR Code"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* NAME */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Enter name"
              {...form.register("name")}
              disabled={isSubmitting}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Enter description"
              {...form.register("description")}
              disabled={isSubmitting}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          {/* TYPE */}
          <div className="space-y-2">
            <Label htmlFor="type">
              Type <span className="text-destructive">*</span>
            </Label>
            <Input
              id="type"
              placeholder="Type"
              {...form.register("type")}
              disabled={isSubmitting}
            />
          </div>

          {/* BRANCH */}
          <div className="space-y-2">
            <Label htmlFor="branch">
              Branch <span className="text-destructive">*</span>
            </Label>
            <Input
              id="branch"
              placeholder="Branch"
              {...form.register("branch")}
              disabled={isSubmitting}
            />
          </div>

          {/* DEPARTMENT */}
          <div className="space-y-2">
            <Label htmlFor="department">
              Department <span className="text-destructive">*</span>
            </Label>
            <Input
              id="department"
              placeholder="Department"
              {...form.register("department")}
              disabled={isSubmitting}
            />
          </div>

          {/* IMAGE */}
          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              type="file"
              {...form.register("image")}
              disabled={isSubmitting}
            />
          </div>

          <DialogFooter className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 text-white hover:bg-blue-700"
              disabled={isSubmitting || !form.formState.isValid}
            >
              {isSubmitting
                ? qrCode
                  ? "Saving..."
                  : "Creating..."
                : qrCode
                ? "Save Changes"
                : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
