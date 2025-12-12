"use client";

import { useSearchParams } from "next/navigation";
import BranchList from "./BranchList";
import BranchForm from "./BranchForm";

// Example branches data
const branches = [
  {
    branchId: "BR001",
    branchName: "Central Branch",
    region: "Addis Ababa",
    district: "Bole",
    city: "Addis Ababa",
    grade: "A",
    phone: "+251 912 345 678",
    createdAt: "2025-12-12",
    updatedAt: "2025-12-12",
  },
  // Add more branches here...
];

export default function BranchPage() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view");

  if (view === "form") return <BranchForm />;
  return <BranchList branches={branches} />;
}
