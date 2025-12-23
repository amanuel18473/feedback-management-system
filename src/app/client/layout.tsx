"use client";

import React from "react";
import AppHeader from "@/layout/AppHeader";
import ClientAuthGuard from "@/components/guards/ClientAuthGuard";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="p-6">
       {children}</main>
    </>
  );
}
