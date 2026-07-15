import { api } from "@/app/lib/api";

export interface ChatOption {
  label: string;
  next_id: string | null;
}

export interface ChatNode {
  _id?: string;
  id?: string;
  type: "start" | "question" | "answer" | "contact";
  message: string;
  options: ChatOption[];
  is_active: boolean;
  sort_order: number;
}

export type ChatNodePayload = Omit<ChatNode, "_id" | "id">;

export const chatFlowService = {
  list:   ()                          => api.get<ChatNode[]>("/spouse-visa/chat-flow/all"),
  create: (data: ChatNodePayload)     => api.post<ChatNode>("/spouse-visa/chat-flow", data),
  update: (id: string, data: Partial<ChatNodePayload>) => api.put<ChatNode>(`/spouse-visa/chat-flow/${id}`, data),
  remove: (id: string)                => api.delete<void>(`/spouse-visa/chat-flow/${id}`),
};
