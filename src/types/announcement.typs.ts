export interface Announcement {
  _id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  targetAudience: string;
  image?: {
    url: string;
    publicId: string;
  };
  createdAt: string;
  updatedAt: string;
  announcementId: string;
  slug: string;
}

// Payloads for API
export interface CreateAnnouncementPayload {
  title: string;
  description: string;
  type: string;
  status: string;
  targetAudience: string;
  image?: File;
}

export interface UpdateAnnouncementPayload {
  title?: string;
  description?: string;
  type?: string;
  status?: string;
  targetAudience?: string;
  image?: File | null;
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
export interface GetAnnouncementsResponse {
  announcements: Announcement[];
  pagination: Pagination;
}
