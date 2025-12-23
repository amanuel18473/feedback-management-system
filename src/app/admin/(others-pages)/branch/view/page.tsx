"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/ui/dialog";
import { Button } from "@/components/ui/ui/button";
import { Skeleton } from "@/components/ui/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { getBranchById } from "@/services/branch-service";

interface Branch {
  id: string;
  name: string;
  location?: string;
  manager?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface BackendBranch {
  _id: string;
  name: string;
  location?: string;
  manager?: string;
  createdAt: string;
  updatedAt: string;
}

interface ViewBranchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branchId: string | null;
}

export function ViewBranchDialog({ open, onOpenChange, branchId }: ViewBranchDialogProps) {
  const { data: branch, isLoading, error } = useQuery<Branch | null>({
    queryKey: ["branch", branchId],
    queryFn: async () => {
      if (!branchId) return null;

      // Fetch branch from backend and map to frontend type
      const backendBranch = (await getBranchById(branchId)) as unknown as BackendBranch;

      return {
        id: backendBranch._id,
        name: backendBranch.name,
        location: backendBranch.location,
        manager: backendBranch.manager,
        createdAt: backendBranch.createdAt,
        updatedAt: backendBranch.updatedAt,
      };
    },
    enabled: !!branchId,
  });

  const handleClose = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <DialogHeader>
          <DialogTitle>Branch Details</DialogTitle>
          <DialogDescription>View full information of the branch.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {isLoading && (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          )}

          {error && <p className="text-destructive">Failed to load branch details</p>}

          {branch && (
            <div className="space-y-2">
              <div><strong>Name:</strong> {branch.name}</div>
              {branch.location && <div><strong>Location:</strong> {branch.location}</div>}
              {branch.manager && <div><strong>Manager:</strong> {branch.manager}</div>}
              {branch.createdAt && <div><strong>Created At:</strong> {new Date(branch.createdAt).toLocaleString()}</div>}
              {branch.updatedAt && <div><strong>Updated At:</strong> {new Date(branch.updatedAt).toLocaleString()}</div>}
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
