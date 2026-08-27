import type {
  Dispute,
  AnalysisResult,
  AuditEntry,
  EvaluationReport,
  SubmissionResponse,
} from "../types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
const API_KEY = import.meta.env.VITE_API_KEY ?? "disputeshield-demo-key-2026";

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  isPublic = false
): Promise<T> {
  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type") && options.method && options.method !== "GET") {
    headers.set("Content-Type", "application/json");
  }
  if (!isPublic) {
    headers.set("X-API-Key", API_KEY);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = `HTTP ${response.status} ${response.statusText}`;
    try {
      const errJson = await response.json();
      if (errJson && errJson.error) {
        errorMsg = errJson.error;
      }
    } catch {
      // ignore json parse error
    }
    throw new Error(errorMsg);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  listDisputes: (): Promise<Dispute[]> => request<Dispute[]>("/api/disputes"),

  getDispute: (id: string): Promise<Dispute> =>
    request<Dispute>(`/api/disputes/${id}`),

  analyze: (id: string): Promise<AnalysisResult> =>
    request<AnalysisResult>(`/api/disputes/${id}/analyze`, { method: "POST" }),

  getAnalysis: (id: string): Promise<AnalysisResult> =>
    request<AnalysisResult>(`/api/disputes/${id}/analysis`),

  generatePacket: (id: string): Promise<void> =>
    request<void>(`/api/disputes/${id}/packet`, { method: "POST" }),

  approvePacket: (id: string): Promise<void> =>
    request<void>(`/api/disputes/${id}/approve`, { method: "POST" }),

  submitPacket: (id: string): Promise<SubmissionResponse> =>
    request<SubmissionResponse>(`/api/disputes/${id}/submit`, {
      method: "POST",
    }),

  getAudit: (id: string): Promise<AuditEntry[]> =>
    request<AuditEntry[]>(`/api/disputes/${id}/audit`),

  getEvaluationReport: (): Promise<EvaluationReport> =>
    request<EvaluationReport>("/api/evaluation/report", {}, true),
};
