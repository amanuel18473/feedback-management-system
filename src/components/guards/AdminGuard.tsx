"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role !== "admin") router.replace("/"); // non-admin → client
  }, [role]);

  if (role !== "admin") return null;
  return <>{children}</>;
}
