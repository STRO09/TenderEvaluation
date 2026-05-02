import { apiClient } from "../clientMiddleware";
import { TENDER_ENDPOINTS} from "../endpoints/TenderEndpoints";
import { Tender, CreateTenderPayload } from "@/lib/types/Tender";

export const tenderClientApi = {
//   getAll: () =>
//     apiClient.get<Tender[]>('/api/tenders'),

  getById: (id: string) =>
    apiClient.get<Tender>(TENDER_ENDPOINTS.getById(id)),

  create: (payload: CreateTenderPayload) =>
    apiClient.post<Tender>(TENDER_ENDPOINTS.create, payload),

  update: (id: string, payload: Partial<CreateTenderPayload>) =>
    apiClient.patch<Tender>(TENDER_ENDPOINTS.update(id), payload),

//   publish: (id: string) =>
//     apiClient.patch<Tender>(`/api/tenders/${id}/publish`, {}),

//   remove: (id: string) =>
//     apiClient.delete<{ success: boolean }>(`/api/tenders/${id}`),
};
