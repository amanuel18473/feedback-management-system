// types/feedback.type.ts

export interface Feedback {
  id: string;
  message: string;
  category: "Complaints" | "Suggestions" | "Compliments" | "Inquiries";
  priority: "Low" | "Medium" | "High" | "Urgent";
  tags?: string[]; // e.g., branch IDs
}

export interface CreateFeedbackData {
  message: string;
  category: Feedback["category"];
  priority: Feedback["priority"];
  tags?: string[];
}
