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
import { useCreateAnnouncement, useUpdateAnnouncement } from "@/hooks/useAnnouncements";

// ✅ Schema
const announcementSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(2, "Description must be at least 2 characters"),
  type: z.string().min(1, "Type is required"),
  status: z.string().min(1, "Status is required"),
  targetAudience: z.string().min(1, "Target Audience is required"),
  image: z.any().optional(),
});

export type AnnouncementFormData = z.infer<typeof announcementSchema>;

interface AnnouncementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  announcement?: AnnouncementFormData & { _id?: string }; // optional for edit
}

export function AnnouncementDialog({ open, onOpenChange, announcement }: AnnouncementDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createAnnouncement = useCreateAnnouncement();
  const updateAnnouncement = useUpdateAnnouncement();

  const form = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "",
      status: "",
      targetAudience: "",
      image: undefined,
    },
    mode: "onChange",
  });

  // Populate form if editing
  useEffect(() => {
    if (announcement) {
      form.reset(announcement);
    }
  }, [announcement]);

  const onSubmit = async (data: AnnouncementFormData) => {
    try {
      setIsSubmitting(true);

      if (announcement?._id) {
        // Edit
        await updateAnnouncement.mutateAsync({ id: announcement._id, data });
        toast.success("Announcement updated successfully");
      } else {
        // Create
        await createAnnouncement.mutateAsync(data);
        toast.success("Announcement created successfully");
      }

      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to save announcement");
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
          <DialogTitle>{announcement ? "Edit Announcement" : "Add New Announcement"}</DialogTitle>
          <DialogDescription>{announcement ? "Update announcement details" : "Create a new announcement"}</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* TITLE */}
          <div className="space-y-2">
            <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
            <Input
              id="title"
              placeholder="Enter title"
              {...form.register("title")}
              disabled={isSubmitting}
            />
            {form.formState.errors.title && <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>}
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
            <Textarea
              id="description"
              placeholder="Enter description"
              {...form.register("description")}
              disabled={isSubmitting}
            />
            {form.formState.errors.description && <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>}
          </div>

          {/* TYPE */}
          <div className="space-y-2">
            <Label htmlFor="type">Type <span className="text-destructive">*</span></Label>
            <Input id="type" placeholder="Type" {...form.register("type")} disabled={isSubmitting} />
          </div>

          {/* STATUS */}
          <div className="space-y-2">
            <Label htmlFor="status">Status <span className="text-destructive">*</span></Label>
            <Input id="status" placeholder="Status" {...form.register("status")} disabled={isSubmitting} />
          </div>

          {/* TARGET AUDIENCE */}
          <div className="space-y-2">
            <Label htmlFor="targetAudience">Target Audience <span className="text-destructive">*</span></Label>
            <Input id="targetAudience" placeholder="Target Audience" {...form.register("targetAudience")} disabled={isSubmitting} />
          </div>

          {/* IMAGE */}
          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <Input id="image" type="file" {...form.register("image")} disabled={isSubmitting} />
          </div>

          <DialogFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700" disabled={isSubmitting || !form.formState.isValid}>
              {isSubmitting ? (announcement ? "Saving..." : "Creating...") : announcement ? "Save Changes" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
