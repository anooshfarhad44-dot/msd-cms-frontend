import { api } from "@/app/lib/api";

export type ResourceId = string | number;

export function createResourceService<TItem, TPayload>(endpoint: string) {
  return {
    list:   ()                              => api.get<TItem[]>(endpoint),
    getOne: (id: ResourceId)               => api.get<TItem>(`${endpoint}/${id}`),
    create: (payload: TPayload)            => api.post<TItem>(endpoint, payload),
    update: (id: ResourceId, payload: Partial<TPayload>) =>
      api.put<TItem>(`${endpoint}/${id}`, payload),
    remove: (id: ResourceId)               => api.delete<void>(`${endpoint}/${id}`),
  };
}
