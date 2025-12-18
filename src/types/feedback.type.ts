export interface Feedback {
  feedbackId: string;
  userName: string;
  customer: string;
  email: string;
  phone: string;
  comment: string;
  rating: string;
  type: string;
  branch: string;
  department: string;
  files:File;
  subject: string;
  message: string;
  createdAt: string;
}

export interface CreateFeedbackData {
  userName: string;
  email: string;
  subject: string;
  message: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface GetFeedbacksResponse {
  feedbacks: Feedback[];
  pagination: Pagination;
}

export interface GetFeedbacksParams {
  page?: number;
  limit?: number;
}

export interface SearchFeedbackParams {
  search: string;
}

export interface FilterFeedbackParams {
  status: string;
  startDate?: string;
  endDate?: string;
}
