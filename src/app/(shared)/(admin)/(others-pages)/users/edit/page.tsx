"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/ui/dialog";
import { Input } from "@/components/ui/ui/input";
import { Button } from "@/components/ui/ui/button";
import { useGetUsers, useUpdateUser } from "@/hooks/useUsers";

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string | null;
}

export function EditUserDialog({ open, onOpenChange, userId }: EditUserDialogProps) {
  const { data } = useGetUsers(); // Assuming you already have a hook to get all users
  const updateUser = useUpdateUser();

  const [formData, setFormData] = useState({ fullName: "", email: "", role: "" });

  useEffect(() => {
    if (userId && data?.users) {
      const user = data.users.find((u: any) => u.id === userId);
      if (user) setFormData({ fullName: user.fullName, email: user.email, role: user.role });
    }
  }, [userId, data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    await updateUser.mutateAsync({ id: userId, data: formData });
    onOpenChange(false);
  };

  if (!userId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Update user details</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Full Name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              placeholder="Role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              required
            />
          </div>

          <DialogFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateUser.isPending}>
              {updateUser.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
