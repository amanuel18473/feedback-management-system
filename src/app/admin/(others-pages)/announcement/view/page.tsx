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
import { getAnnouncementById } from "@/services/announcement.service";

interface Announcement {
  id: string;
  title: string;
  content?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface BackendAnnouncement {
  _id: string;
  title: string;
  content?: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
}

interface ViewAnnouncementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  announcementId: string | null;
}

export function ViewAnnouncementDialog({
  open,
  onOpenChange,
  announcementId,
}: ViewAnnouncementDialogProps) {
  const { data: announcement, isLoading, error } = useQuery<Announcement | null>({
    queryKey: ["announcement", announcementId],
    queryFn: async () => {
      if (!announcementId) return null;
      const backendAnnouncement = (await getAnnouncementById(
        announcementId
      )) as unknown as BackendAnnouncement;

      return {
        id: backendAnnouncement._id,
        title: backendAnnouncement.title,
        content: backendAnnouncement.content,
        status: backendAnnouncement.status,
        createdAt: backendAnnouncement.createdAt,
        updatedAt: backendAnnouncement.updatedAt,
      };
    },
    enabled: !!announcementId,
  });

  const handleClose = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-background text-foreground dark:bg-background dark:text-foreground">
        <DialogHeader>
          <DialogTitle>Announcement Details</DialogTitle>
          <DialogDescription>
            View full information of the announcement.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {isLoading && (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          )}

          {error && (
            <p className="text-destructive">Failed to load announcement details</p>
          )}

          {announcement && (
            <div className="space-y-2 text-sm">
              <div>
                <strong>Title:</strong> {announcement.title}
              </div>

              {announcement.content && (
                <div className="mt-1 rounded-md border bg-muted/10 p-3 prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: announcement.content }}
                />
              )}

              {announcement.status && (
                <div>
                  <strong>Status:</strong> {announcement.status}
                </div>
              )}
              {announcement.createdAt && (
                <div>
                  <strong>Created At:</strong>{" "}
                  {new Date(announcement.createdAt).toLocaleString()}
                </div>
              )}
              {announcement.updatedAt && (
                <div>
                  <strong>Updated At:</strong>{" "}
                  {new Date(announcement.updatedAt).toLocaleString()}
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
