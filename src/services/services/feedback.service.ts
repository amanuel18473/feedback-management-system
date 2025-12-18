import { CreateFeedbackData, Feedback } from "@/types/type/feedback.type";


let FEEDBACKS: Feedback[] = [];

export const FeedbackService = {
  getAll: async (): Promise<Feedback[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(FEEDBACKS), 500));
  },

  create: async (data: CreateFeedbackData): Promise<Feedback> => {
    const newFeedback: Feedback = {
      id: `${Date.now()}`,
      rating: data.rating,
      comment: data.comment,
      category: data.category,
      tags: data.tags || [],
      attachments: data.attachments || [],
      anonymous: data.anonymous || false,
      language: data.language,
      priority: data.priority || "medium",
      createdAt: new Date().toISOString(),
      status: "open",
      ...("name" in data && { name: data.name }),
      ...("email" in data && { email: data.email }),
    };
    FEEDBACKS.push(newFeedback);
    return newFeedback;
  },

  update: async (id: string, data: Partial<CreateFeedbackData>): Promise<Feedback> => {
    const index = FEEDBACKS.findIndex((f) => f.id === id);
    if (index === -1) throw new Error("Feedback not found");
    FEEDBACKS[index] = { ...FEEDBACKS[index], ...data };
    return FEEDBACKS[index];
  },

  delete: async (id: string): Promise<void> => {
    FEEDBACKS = FEEDBACKS.filter((f) => f.id !== id);
  },
};
