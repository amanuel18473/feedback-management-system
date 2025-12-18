import { Branch } from "@/types/branch.type";

export const BRANCHES_MOCK: Branch[] = [
  {
    branchId: "BR-001",
    branchName: "Bole Main Branch",
    region: "Addis Ababa",
    district: "Bole",
    city: "Addis Ababa",
    grade: "A",
    phone: "+251911000000",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    branchId: "BR-002",
    branchName: "Piazza Branch",
    region: "Addis Ababa",
    district: "Arada",
    city: "Addis Ababa",
    grade: "B",
    phone: "+251922000000",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
