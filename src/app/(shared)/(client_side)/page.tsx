// app/(shared)/(client)/page.tsx
import ClientAuthGuard from "@/components/guards/ClientAuthGuard";

export default function ClientPage() {
  return (
    // <ClientAuthGuard>
      <h1>Client Dashboard</h1>
    //</ClientAuthGuard>
  );
}

