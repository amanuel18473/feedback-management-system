"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/ui/dialog";
import { Button } from "@/components/ui/ui/button";
import { Skeleton } from "@/components/ui/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { getFeedbackById } from "@/services/feedback-service";

interface Feedback {
  id: string;
  userId: string;
  message: string;
  type?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface BackendFeedback {
  _id: string;
  userId: string;
  message: string;
  type?: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
}

interface ViewFeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feedbackId: string | null;
}

export function ViewFeedbackDialog({ open, onOpenChange, feedbackId }: ViewFeedbackDialogProps) {
  const { data: feedback, isLoading, error } = useQuery<Feedback | null>({
    queryKey: ["feedback", feedbackId],
    queryFn: async () => {
      if (!feedbackId) return null;

      const backendFeedback = (await getFeedbackById(feedbackId)) as unknown as BackendFeedback;

      return {
        id: backendFeedback._id,
        userId: backendFeedback.userId,
        message: backendFeedback.message,
        type: backendFeedback.type,
        status: backendFeedback.status,
        createdAt: backendFeedback.createdAt,
        updatedAt: backendFeedback.updatedAt,
      };
    },
    enabled: !!feedbackId,
  });

  const handleClose = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <DialogHeader>
          <DialogTitle>Feedback Details</DialogTitle>
          <DialogDescription>View the full feedback information.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {isLoading && (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          )}

          {error && <p className="text-destructive">Failed to load feedback details</p>}

          {feedback && (
            <div className="space-y-2">
              <div><strong>User ID:</strong> {feedback.userId}</div>
              <div><strong>Message:</strong> {feedback.message}</div>
              {feedback.type && <div><strong>Type:</strong> {feedback.type}</div>}
              {feedback.status && <div><strong>Status:</strong> {feedback.status}</div>}
              {feedback.createdAt && <div><strong>Created At:</strong> {new Date(feedback.createdAt).toLocaleString()}</div>}
              {feedback.updatedAt && <div><strong>Updated At:</strong> {new Date(feedback.updatedAt).toLocaleString()}</div>}
            </div>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button
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
