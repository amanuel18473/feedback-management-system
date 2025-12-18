"use client";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/form/dialog";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { Branch, BranchPayload } from "@/types/branch.type";
import { useCreateBranch, useUpdateBranch } from "@/hooks/useBranches";
import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  branch?: Branch | null;
}

const EMPTY_FORM: BranchPayload = {
  name: "",
  region: "",
  city: "",
  district: "",
  status: "Active",
  telephone: { countryCode: "+251", number: "" },
};

export default function BranchDialog({ open, onClose, branch }: Props) {
  const isEdit = !!branch;
  const [form, setForm] = useState<BranchPayload>(EMPTY_FORM);

  const { mutateAsync: createBranch } = useCreateBranch();
  const { mutateAsync: updateBranch } = useUpdateBranch();

  useEffect(() => {
    if (branch) {
      setForm({
        name: branch.name,
        region: branch.region,
        city: branch.city,
        district: branch.district,
        address: branch.address,
        grade: branch.grade,
        status: branch.status,
        telephone: branch.telephone || { countryCode: "+251", number: "" },
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [branch]);

  const submit = async () => {
    if (!form.telephone?.number) {
      alert("Telephone number is required");
      return;
    }

    if (isEdit && branch) {
      await updateBranch({ id: branch._id, data: form });
    } else {
      await createBranch(form);
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Branch" : "Add Branch"}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          {["name", "region", "city", "district"].map((f) => (
            <Input
              key={f}
              placeholder={f}
              value={(form as any)[f] || ""}
              onChange={(e) => setForm({ ...form, [f]: e.target.value })}
            />
          ))}

          {/* Telephone input */}
          <Input
            placeholder="Telephone"
            value={form.telephone?.number || ""}
            onChange={(e) =>
              setForm({
                ...form,
                telephone: { ...form.telephone, number: e.target.value },
              })
            }
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit}>{isEdit ? "Update" : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
