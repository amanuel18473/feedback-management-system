"use client";

import { useSearchParams } from "next/navigation";
import FeedbackList from "./FeedbackList";
import FeedbackFormDialog from "./FeedbackForm";

export default function FeedbackPage() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view") || "list"; // default to list

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Feedback Management</h1>

      {view === "list" && <FeedbackList />}
      {view === "form" && <FeedbackFormDialog open={true} onClose={() => {}} />}
    </div>
  );
}
