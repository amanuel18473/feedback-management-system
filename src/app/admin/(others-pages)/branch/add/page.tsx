"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { useCreateBranch, useUpdateBranch } from "@/hooks/useBranches";
import { Branch } from "@/types/branch.type";

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

// ----------------- ZOD SCHEMA -----------------
const branchSchema = z.object({
  name: z.string().min(2, "Name is required"),
  region: z.string().min(2, "Region is required"),
  district: z.string().min(2, "District is required"),
  city: z.string().min(2, "City is required"),
  manager: z.string().optional(),
  status: z.enum(["Active", "Inactive"]).optional(),
  address: z.string().optional(),
  grade: z.string().optional(),
  description: z.string().optional(),
  telephone: z.object({
    countryCode: z.string().min(1, "Country code is required"),
    number: z.string().min(1, "Number is required"),
  }),
});

export type BranchFormData = z.infer<typeof branchSchema>;

interface BranchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branch?: Branch; // optional for edit
}

export function BranchDialog({ open, onOpenChange, branch }: BranchDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createBranch = useCreateBranch();
  const updateBranch = useUpdateBranch();

  const form = useForm<BranchFormData>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      name: "",
      region: "",
      district: "",
      city: "",
      manager: "",
      status: "Active",
      address: "",
      grade: "",
      description: "",
      telephone: { countryCode: "+251", number: "" },
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (branch) {
      form.reset({
        name: branch.name || "",
        region: branch.region || "",
        district: branch.district || "",
        city: branch.city || "",
        manager: branch.manager || "",
        status: branch.status || "Active",
        address: branch.address || "",
        grade: branch.grade || "",
        description: branch.description || "",
        telephone: {
          countryCode: branch.telephone.countryCode || "+251",
          number: branch.telephone.number || "",
        },
      });
    }
  }, [branch]);

  const onSubmit = async (data: BranchFormData) => {
    try {
      setIsSubmitting(true);
      if (branch?._id) {
        await updateBranch.mutateAsync({ id: branch._id, data });
        toast.success("Branch updated successfully");
      } else {
        await createBranch.mutateAsync(data);
        toast.success("Branch created successfully");
      }
      form.reset();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save branch");
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
      <DialogContent className="sm:max-w-[1000px] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{branch ? "Edit Branch" : "Add New Branch"}</DialogTitle>
          <DialogDescription>{branch ? "Update branch details" : "Create a new branch"}</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* NAME */}
          <div className="space-y-2">
            <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
            <Input id="name" placeholder="Enter name" {...form.register("name")} disabled={isSubmitting} />
            {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
          </div>

          {/* REGION */}
          <div className="space-y-2">
            <Label htmlFor="region">Region <span className="text-destructive">*</span></Label>
            <Input id="region" placeholder="Region" {...form.register("region")} disabled={isSubmitting} />
          </div>

          {/* DISTRICT */}
          <div className="space-y-2">
            <Label htmlFor="district">District <span className="text-destructive">*</span></Label>
            <Input id="district" placeholder="District" {...form.register("district")} disabled={isSubmitting} />
          </div>

          {/* CITY */}
          <div className="space-y-2">
            <Label htmlFor="city">City <span className="text-destructive">*</span></Label>
            <Input id="city" placeholder="City" {...form.register("city")} disabled={isSubmitting} />
          </div>

          {/* MANAGER */}
          <div className="space-y-2">
            <Label htmlFor="manager">Manager</Label>
            <Input id="manager" placeholder="Manager" {...form.register("manager")} disabled={isSubmitting} />
          </div>

          {/* STATUS */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select id="status" {...form.register("status")} className="input w-full" disabled={isSubmitting}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* TELEPHONE */}
          <div className="space-y-2">
            <Label>Telephone <span className="text-destructive">*</span></Label>
            <div className="flex gap-2">
              <Input placeholder="+251" {...form.register("telephone.countryCode")} className="w-20" disabled={isSubmitting} />
              <Input placeholder="Number" {...form.register("telephone.number")} disabled={isSubmitting} />
            </div>
          </div>

          {/* ADDRESS */}
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" placeholder="Address" {...form.register("address")} disabled={isSubmitting} />
          </div>

          {/* GRADE */}
          <div className="space-y-2">
            <Label htmlFor="grade">Grade</Label>
            <Input id="grade" placeholder="Grade" {...form.register("grade")} disabled={isSubmitting} />
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Description" {...form.register("description")} disabled={isSubmitting} />
          </div>

          <DialogFooter className="sticky bottom-0 bg-white dark:bg-gray-900 flex justify-end gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700" disabled={isSubmitting || !form.formState.isValid}>
              {isSubmitting ? (branch ? "Saving..." : "Creating...") : branch ? "Save Changes" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
