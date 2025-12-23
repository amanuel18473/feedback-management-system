"use client";

import SharedLayout from "../shared/layout";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SharedLayout>{children}</SharedLayout>;
}
