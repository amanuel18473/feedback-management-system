// types/announcement.typs.ts
export interface Announcement {
  _id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  priority: string;
  targetAudience: string;
  targetBranches: string[];
  targetDepartments: string[];
  isPinned: boolean;
  image?: { url: string; publicId: string };
  viewCount: number;
  readCount: number;
  tags: string[];
  createdBy: { _id: string; email: string };
  sendNotification: boolean;
  notificationSent: boolean;
  publishDate: string;
  attachments: string[];
  likes: string[];
  comments: string[];
  createdAt: string;
  updatedAt: string;
  announcementId: string;
  slug: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface GetAnnouncementsResponse {
  success: boolean;
  message: string;
  data: {
    announcements: Announcement[];
    pagination: Pagination;
  };
}

export interface GetAnnouncementsParams {
  page?: number;
  limit?: number;
  status?: string;
}

// types/announcement.typs.ts
export interface CreateAnnouncementPayload {
  title: string;
  description: string;
  type: string;
  status: string;
  targetAudience: string;
  image?: File;
}

