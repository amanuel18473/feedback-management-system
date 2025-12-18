"use client";

import { useSearchParams } from "next/navigation";
import QRCodeList from "./qr_code_list";
import QRCodeDialog from "./qr_code_form";

export default function QRCodePage() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view") || "list"; // default to list

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">QR Code Management</h1>

      {view === "list" && <QRCodeList />}
      {view === "form" && <QRCodeDialog open={true} onClose={() => {}} />}
    </div>
  );
}
