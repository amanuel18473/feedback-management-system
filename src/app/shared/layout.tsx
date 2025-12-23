"use client";

import React from "react";
import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import AppHeader from "@/layout/AppHeader";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function SharedLayout({
  children,
  withSidebar = true,
}: {
  children: React.ReactNode;
  withSidebar?: boolean;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SidebarProvider>
          <div className="min-h-screen flex">
            {withSidebar && <AppSidebar />}
            {withSidebar && <Backdrop />}

            <div className="flex-1 flex flex-col">
              <AppHeader />
              <main className="p-4 md:p-6 flex-1">{children}</main>
            </div>
          </div>
        </SidebarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
