import type {
  Dispute,
  AnalysisResult,
  AuditEntry,
  EvaluationReport,
  SubmissionResponse,
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  AuthUser,
  PlatformSettings,
} from "../types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
const TOKEN_KEY = "disputeshield_jwt_token";

let onUnauthorizedCallback: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorizedCallback = handler;
}

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string | null) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // ignore local storage errors
  }
}

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
    const token = getStoredToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && !isPublic) {
    if (onUnauthorizedCallback) {
      onUnauthorizedCallback();
    }
  }

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
  // Authentication & Profile APIs
  login: (payload: LoginPayload): Promise<AuthResponse> =>
    request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }, true),

  register: (payload: RegisterPayload): Promise<AuthResponse> =>
    request<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }, true),

  getMe: (): Promise<AuthUser> =>
    request<AuthUser>("/api/auth/me"),

  // Disputes & Investigation Lifecycle APIs
  listDisputes: (): Promise<Dispute[]> =>
    request<Dispute[]>("/api/disputes"),

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

  // Evaluation Metrics (Public for Judges)
  getEvaluationReport: (): Promise<EvaluationReport> =>
    request<EvaluationReport>("/api/evaluation/report", {}, true),

  // Platform Settings (Admin Only)
  getSettings: (): Promise<PlatformSettings> =>
    request<PlatformSettings>("/api/settings"),

  updateSettings: (settings: PlatformSettings): Promise<PlatformSettings> =>
    request<PlatformSettings>("/api/settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    }),
};
