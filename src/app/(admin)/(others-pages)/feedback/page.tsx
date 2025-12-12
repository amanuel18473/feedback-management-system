"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import FeedbackForm, { Feedback } from "./FeedbackForm";
import FeedbackList from "./FeedbackList";


// Sample feedback data matching your Feedback type
const sampleFeedbacks: Feedback[] = [
  {
    feedbackId: "FB001",
    userName: "John Doe",
    email: "john@example.com",
    subject: "Website Feedback",
    message: "The new dashboard layout is very intuitive and user-friendly.",
    createdAt: "2025-12-01",
  },
  {
    feedbackId: "FB002",
    userName: "Jane Smith",
    email: "jane@example.com",
    subject: "Response Time",
    message: "Need improvement on response time.",
    createdAt: "2025-12-05",
  },
];

export default function FeedbackPage() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view") || "list";

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Feedback Management</h1>

      {view === "list" && <FeedbackList feedbacks={sampleFeedbacks} />}
      {view === "form" && <FeedbackForm />}
    </div>
  );
}
