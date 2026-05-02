// api/endpoints.ts
// import { API_ENDPOINTS } from "./index";
export const TENDER_ENDPOINTS = {
  list: `/tenders`,
  create: `/tenders`,
  getById: (id: string) => `/tenders/${id}`,
  update: (id: string) => `/tenders/${id}`,
  delete: (id: string) => `/tenders/${id}`,

  approve: (id: string) => `/tenders/${id}/approve`,
  reject: (id: string) => `/tenders/${id}/reject`,
};
