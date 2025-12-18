"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/ui/dialog";
import { Button } from "@/components/ui/ui/button";
import { Skeleton } from "@/components/ui/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "@/services/user.service";

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  branch: string;
  department: string;
  status?: string;
  lastLogin?: string;
}

interface BackendUser {
  _id: string;
  userId: string;
  fullName: string;
  email: string;
  role: string;
  branch: string;
  department: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

interface ViewUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string | null;
}

export function ViewUserDialog({ open, onOpenChange, userId }: ViewUserDialogProps) {
  const { data: user, isLoading, error } = useQuery<User | null>({
    queryKey: ["user", userId],
    queryFn: async () => {
      if (!userId) return null;

      // Force the result as unknown first, then map to frontend User
      const backendUser = (await getUserById(userId)) as unknown as BackendUser;

      return {
        id: backendUser._id,
        fullName: backendUser.fullName,
        email: backendUser.email,
        role: backendUser.role,
        branch: backendUser.branch,
        department: backendUser.department,
        status: backendUser.status,
        lastLogin: backendUser.lastLogin,
      };
    },
    enabled: !!userId,
  });

  const handleClose = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>View the full information of the user.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {isLoading && (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          )}

          {error && <p className="text-destructive">Failed to load user details</p>}

          {user && (
            <div className="space-y-2">
              <div><strong>Full Name:</strong> {user.fullName}</div>
              <div><strong>Email:</strong> {user.email}</div>
              <div><strong>Role:</strong> {user.role}</div>
              <div><strong>Branch:</strong> {user.branch}</div>
              <div><strong>Department:</strong> {user.department}</div>
              {user.status && <div><strong>Status:</strong> {user.status}</div>}
              {user.lastLogin && <div><strong>Last Login:</strong> {user.lastLogin}</div>}
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
