import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import type { AuthUser, UserRole, LoginPayload, RegisterPayload } from "../types";
import { api, getStoredToken, setStoredToken, setUnauthorizedHandler } from "../api/client";

export const DEMO_ACCOUNTS: Record<UserRole, { name: string; email: string; pass: string; title: string; desc: string }> = {
  ADMIN: {
    name: "Sarah Connor (Admin)",
    email: "admin@disputeshield.ai",
    pass: "Admin@1234",
    title: "Platform Administrator",
    desc: "Full access to disputes, investigation, defense packets, and security settings.",
  },
  INVESTIGATOR: {
    name: "Alex Rivera (Lead Investigator)",
    email: "investigator@disputeshield.ai",
    pass: "Investigator@1234",
    title: "Lead Dispute Investigator",
    desc: "Run 7-stage deterministic rule engine, ML scoring, and defense packet creation.",
  },
  REVIEWER: {
    name: "Elena Rostova (Compliance Reviewer)",
    email: "reviewer@disputeshield.ai",
    pass: "Reviewer@1234",
    title: "Compliance & Packet Reviewer",
    desc: "Audit evidence completeness, review defense packets, and approve/submit responses.",
  },
};

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  demoLogin: (role: UserRole) => Promise<void>;
  logout: () => void;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = "disputeshield_auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => getStoredToken());
  const [user, setUserState] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    return !!getStoredToken();
  });

  const saveAuth = useCallback((newToken: string, newUser: AuthUser) => {
    setStoredToken(newToken);
    setTokenState(newToken);
    setUserState(newUser);
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    } catch {
      // ignore
    }
  }, []);

  const clearAuth = useCallback(() => {
    setStoredToken(null);
    setTokenState(null);
    setUserState(null);
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const logout = useCallback(() => {
    clearAuth();
  }, [clearAuth]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearAuth();
    });
  }, [clearAuth]);

  useEffect(() => {
    let mounted = true;
    const currentToken = getStoredToken();

    if (!currentToken) {
      return;
    }

    api
      .getMe()
      .then((freshUser) => {
        if (mounted) {
          setUserState(freshUser);
          try {
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(freshUser));
          } catch {
            // ignore
          }
        }
      })
      .catch(() => {
        if (mounted) {
          clearAuth();
        }
      })
      .finally(() => {
        if (mounted) {
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [clearAuth]);

  const login = useCallback(async (payload: LoginPayload) => {
    const res = await api.login(payload);
    saveAuth(res.token, res.user);
  }, [saveAuth]);

  const register = useCallback(async (payload: RegisterPayload) => {
    const res = await api.register(payload);
    saveAuth(res.token, res.user);
  }, [saveAuth]);

  const demoLogin = useCallback(async (role: UserRole) => {
    const account = DEMO_ACCOUNTS[role];
    if (!account) return;
    const res = await api.login({ email: account.email, password: account.pass });
    saveAuth(res.token, res.user);
  }, [saveAuth]);

  const hasRole = useCallback((required: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    if (Array.isArray(required)) {
      return required.includes(user.role);
    }
    return user.role === required;
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!user && !!token,
      isLoading,
      login,
      register,
      demoLogin,
      logout,
      hasRole,
    }),
    [user, token, isLoading, login, register, demoLogin, logout, hasRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
