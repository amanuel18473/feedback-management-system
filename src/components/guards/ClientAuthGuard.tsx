"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ClientAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = localStorage.getItem("auth_token");

  useEffect(() => {
    if (!token) router.replace("/signin");
  }, [token]);

  if (!token) return null;
  return <>{children}</>;
}
