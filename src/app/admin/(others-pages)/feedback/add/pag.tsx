"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/ui/dialog";
import { Label } from "@/components/ui/ui/label";
import { Input } from "@/components/ui/ui/input";
import { Textarea } from "@/components/ui/ui/textarea";
import { Button } from "@/components/ui/ui/button";
import { useCreateFeedback, useUpdateFeedback } from "@/hooks/useFeedback";

// ---------------- Schema ----------------
const feedbackSchema = z.object({
  customer: z.string().min(2, "Customer name must be at least 2 characters"),
  comment: z.string().min(1, "Comment is required"),
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  type: z.string().min(1, "Type is required"),
  status: z.string().min(1, "Status is required"),
  department: z.string().min(1, "Department is required"),
  branchId: z.string().min(1, "Branch ID is required"),
  attachments: z.any().optional(),
});

export type FeedbackFormData = z.infer<typeof feedbackSchema>;

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feedback?: FeedbackFormData & { _id?: string }; // optional for edit
}

export function FeedbackDialog({ open, onOpenChange, feedback }: FeedbackDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createFeedback = useCreateFeedback();
  const updateFeedback = useUpdateFeedback();

  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      customer: "",
      comment: "",
      rating: 1,
      type: "",
      status: "pending",
      department: "",
      branchId: "",
      attachments: undefined,
    },
    mode: "onChange",
  });

  // Populate form if editing
  useEffect(() => {
    if (feedback) {
      form.reset(feedback);
    }
  }, [feedback]);

  const onSubmit = async (data: FeedbackFormData) => {
    try {
      setIsSubmitting(true);
      if (feedback?._id) {
        await updateFeedback.mutateAsync({ id: feedback._id, data });
        toast.success("Feedback updated successfully");
      } else {
        await createFeedback.mutateAsync(data);
        toast.success("Feedback submitted successfully");
      }
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to save feedback");
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
      <DialogContent className="sm:max-w-[1000px] max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <DialogHeader>
          <DialogTitle>{feedback ? "Edit Feedback" : "Add New Feedback"}</DialogTitle>
          <DialogDescription>{feedback ? "Update feedback details" : "Provide customer feedback details"}</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* CUSTOMER */}
          <div className="space-y-2">
            <Label htmlFor="customer">Customer <span className="text-destructive">*</span></Label>
            <Input id="customer" placeholder="Customer Name" {...form.register("customer")} disabled={isSubmitting} />
            {form.formState.errors.customer && <p className="text-sm text-destructive">{form.formState.errors.customer.message}</p>}
          </div>

          {/* COMMENT */}
          <div className="space-y-2">
            <Label htmlFor="comment">Comment <span className="text-destructive">*</span></Label>
            <Textarea id="comment" placeholder="Feedback comment" {...form.register("comment")} disabled={isSubmitting} />
            {form.formState.errors.comment && <p className="text-sm text-destructive">{form.formState.errors.comment.message}</p>}
          </div>

          {/* RATING */}
          <div className="space-y-2">
            <Label htmlFor="rating">Rating <span className="text-destructive">*</span></Label>
            <Input id="rating" type="number" min={1} max={5} {...form.register("rating", { valueAsNumber: true })} disabled={isSubmitting} />
            {form.formState.errors.rating && <p className="text-sm text-destructive">{form.formState.errors.rating.message}</p>}
          </div>

          {/* TYPE */}
          <div className="space-y-2">
            <Label htmlFor="type">Type <span className="text-destructive">*</span></Label>
            <Input id="type" placeholder="Feedback type" {...form.register("type")} disabled={isSubmitting} />
          </div>

          {/* STATUS */}
          <div className="space-y-2">
            <Label htmlFor="status">Status <span className="text-destructive">*</span></Label>
            <Input id="status" placeholder="Status" {...form.register("status")} disabled={isSubmitting} />
          </div>

          {/* DEPARTMENT */}
          <div className="space-y-2">
            <Label htmlFor="department">Department <span className="text-destructive">*</span></Label>
            <Input id="department" placeholder="Department" {...form.register("department")} disabled={isSubmitting} />
          </div>

          {/* BRANCH */}
          <div className="space-y-2">
            <Label htmlFor="branchId">Branch <span className="text-destructive">*</span></Label>
            <Input id="branchId" placeholder="Branch ID" {...form.register("branchId")} disabled={isSubmitting} />
          </div>

          {/* ATTACHMENTS */}
          <div className="space-y-2">
            <Label htmlFor="attachments">Attachments</Label>
            <Input id="attachments" type="file" multiple {...form.register("attachments")} disabled={isSubmitting} />
          </div>

          {/* Footer Buttons */}
          <DialogFooter className="sticky bottom-0 bg-white dark:bg-gray-900 flex justify-end gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700" disabled={isSubmitting || !form.formState.isValid}>
              {isSubmitting ? (feedback ? "Saving..." : "Submitting...") : feedback ? "Saving" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
