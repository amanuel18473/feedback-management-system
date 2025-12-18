"use client";

import { useSearchParams } from "next/navigation";
import BranchList from "./BranchList";
import BranchDialog from "./BranchForm";

export default function BranchPage() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view") || "list"; // default to list

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Branch Management</h1>

      {view === "list" && <BranchList />}
      {view === "form" && (
        <BranchDialog
          open={true}
          onClose={() => console.log("Close form")}
          branch={null}
        />
      )}
    </div>
  );
}
