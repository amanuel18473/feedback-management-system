// app/(shared)/layout.tsx
"use client";

import { ThemeProvider } from "@/context/ThemeContext";
import QueryProvider from "@/providers/QueryProvider";

export default function SharedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <QueryProvider>{children}</QueryProvider>
    </ThemeProvider>
  );
}
