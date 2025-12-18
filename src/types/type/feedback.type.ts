export interface Feedback {
  id: string;
  name?: string; // optional for anonymous
  email?: string;
  rating: number; // 1-5
  comment: string;
  category: "complaint" | "suggestion" | "compliment" | "inquiry";
  tags?: string[];
  attachments?: string[]; // URLs or file paths
  anonymous: boolean;
  language: string; // e.g., 'en', 'am'
  createdAt: string;
  status: "open" | "in-progress" | "resolved" | "closed" | "pending";
  priority: "low" | "medium" | "high" | "urgent";
  history?: FeedbackHistory[];
}

export interface FeedbackHistory {
  action: string;
  timestamp: string;
  user?: string;
}

export interface CreateFeedbackData {
  name?: string;
  email?: string;
  rating: number;
  comment: string;
  category: Feedback["category"];
  tags?: string[];
  attachments?: string[];
  anonymous?: boolean;
  language: string;
  priority?: Feedback["priority"];
}
