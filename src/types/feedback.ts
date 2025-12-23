// Feedback entity
export interface Feedback {
  _id: string;
  feedbackId: string;
  customer: string;
  email?: string;
  phone?: string;
  comment: string;
  rating: number;
  type: string;
  department: string;
  branch: {
    _id: string;
    name: string;
  };
  attachments?: {
    url: string;
    fileName: string;
  }[];
  status: string; // "pending", "resolved", etc.
  createdAt: string;
  updatedAt: string;
  slug: string; // optional, like Announcement
}

// Payloads for API
export interface CreateFeedbackPayload {
  customer: string;
  email?: string;
  phone?: string;
  comment: string;
  rating: number;
  type: string;
  department: string;
  branchId: string;
  status: string;
  attachments?: File[];
}

export interface UpdateFeedbackPayload {
  customer?: string;
  email?: string;
  phone?: string;
  comment?: string;
  rating?: number;
  type?: string;
  department?: string;
  branchId?: string;
  status?: string;
  attachments?: File[] | null;
}

// Pagination
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Backend Response
export interface GetFeedbackResponse {
  feedbacks: Feedback[];
  pagination: Pagination;
}
