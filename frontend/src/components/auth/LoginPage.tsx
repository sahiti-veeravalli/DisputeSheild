import React, { useState } from "react";
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  AlertCircle,
  Loader2,
  ArrowRight,
  Search,
  FileCheck2,
  Settings,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { useAuth, DEMO_ACCOUNTS } from "../../context/AuthContext";
import type { UserRole } from "../../types";
import { Card } from "../ui";

interface LoginPageProps {
  onSuccess: () => void;
  onBackToLanding: () => void;
}

export function LoginPage({ onSuccess, onBackToLanding }: LoginPageProps) {
  const { login, register, demoLogin } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("INVESTIGATOR");

  // State
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeDemoRole, setActiveDemoRole] = useState<UserRole | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegistering) {
        if (!name.trim() || !email.trim() || !password.trim()) {
          throw new Error("Please complete all registration fields.");
        }
        await register({ name, email, password, role });
      } else {
        if (!email.trim() || !password.trim()) {
          throw new Error("Please enter your email and password.");
        }
        await login({ email, password });
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDemoAccount(roleToLogin: UserRole) {
    setError(null);
    setActiveDemoRole(roleToLogin);
    setLoading(true);

    try {
      await demoLogin(roleToLogin);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to sign in with demo account.");
    } finally {
      setLoading(false);
      setActiveDemoRole(null);
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-navy-950 px-4 py-12 text-ink-100 font-body selection:bg-signal-blue selection:text-white">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-40 left-1/2 size-[600px] -translate-x-1/2 rounded-full bg-signal-blue/10 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 size-[400px] rounded-full bg-cyan/5 blur-[100px]" />

      {/* Top Bar Navigation */}
      <div className="absolute top-6 left-6 md:left-12">
        <button
          onClick={onBackToLanding}
          className="inline-flex items-center gap-2 rounded-xl border border-navy-700 bg-navy-900/60 px-3.5 py-2 text-xs font-medium text-ink-400 backdrop-blur-md transition-colors hover:border-navy-600 hover:text-ink-100"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Product Overview</span>
        </button>
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex size-14 items-center justify-center rounded-2xl border border-signal-blue/40 bg-signal-blueDim text-signal-blue shadow-[0_0_30px_rgba(76,125,255,0.3)]">
            <ShieldCheck className="size-8" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink-100 sm:text-3xl">
            DisputeShield <span className="text-signal-blue">AI</span>
          </h1>
          <p className="text-xs text-ink-400">
            Intelligent Chargeback Defense &amp; Evidence Intelligence Operations
          </p>
        </div>

        {/* Authentication Card */}
        <Card className="border-navy-700 bg-navy-900/90 p-7 shadow-2xl backdrop-blur-xl">
          <div className="mb-6 flex items-center justify-between border-b border-navy-800 pb-3">
            <div>
              <h2 className="font-display text-base font-bold text-ink-100">
                {isRegistering ? "Create Merchant Account" : "Sign In to Workspace"}
              </h2>
              <p className="text-[11px] text-ink-500">
                {isRegistering
                  ? "Configure role permissions and access tokens"
                  : "Enter your credentials to access live dispute queues"}
              </p>
            </div>
            <span className="rounded-md border border-signal-blue/30 bg-signal-blueDim px-2 py-0.5 font-mono text-[10px] font-bold text-signal-blue">
              JWT RBAC
            </span>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-signal-red/30 bg-signal-redDim/30 p-3 text-xs text-signal-red animate-fadeIn">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <div className="leading-snug">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <div>
                <label className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Rivera"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-navy-700 bg-navy-950/80 py-2.5 pl-10 pr-3 text-xs text-ink-100 placeholder-ink-600 outline-none transition-all focus:border-signal-blue focus:ring-1 focus:ring-signal-blue/50"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-500" />
                <input
                  type="email"
                  required
                  placeholder="name@disputeshield.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-navy-700 bg-navy-950/80 py-2.5 pl-10 pr-3 text-xs text-ink-100 placeholder-ink-600 outline-none transition-all focus:border-signal-blue focus:ring-1 focus:ring-signal-blue/50"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-navy-700 bg-navy-950/80 py-2.5 pl-10 pr-3 text-xs text-ink-100 placeholder-ink-600 outline-none transition-all focus:border-signal-blue focus:ring-1 focus:ring-signal-blue/50"
                />
              </div>
            </div>

            {isRegistering && (
              <div>
                <label className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                  Platform Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["ADMIN", "INVESTIGATOR", "REVIEWER"] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`rounded-xl border py-2 text-center font-mono text-[10px] font-bold transition-all ${
                        role === r
                          ? "border-signal-blue bg-signal-blue/20 text-signal-blue shadow-[0_0_12px_rgba(76,125,255,0.2)]"
                          : "border-navy-700 bg-navy-950/50 text-ink-400 hover:border-navy-600 hover:text-ink-200"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-signal-blue py-3 text-xs font-bold text-white shadow-[0_4px_20px_rgba(76,125,255,0.35)] transition-all hover:bg-signal-blue/90 disabled:opacity-50"
            >
              {loading && !activeDemoRole ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <span>{isRegistering ? "Create & Sign In" : "Sign In to Workspace"}</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError(null);
              }}
              className="font-mono text-xs text-ink-400 hover:text-signal-blue transition-colors"
            >
              {isRegistering
                ? "Already have an account? Sign In"
                : "Need a new account? Register"}
            </button>
          </div>
        </Card>

        {/* 1-Click Demo Accounts Quick Switcher */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-ink-500">
              1-Click Demo Access
            </span>
            <span className="font-mono text-[10px] text-signal-blue font-medium">
              Pre-seeded RBAC Roles
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {/* Investigator Card */}
            <button
              type="button"
              onClick={() => handleDemoAccount("INVESTIGATOR")}
              disabled={loading}
              className="group relative flex items-center justify-between rounded-2xl border border-cyan/30 bg-navy-900/80 p-3.5 text-left transition-all hover:border-cyan hover:bg-navy-850 hover:shadow-[0_0_20px_rgba(56,189,248,0.15)] disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl border border-cyan/40 bg-cyan/15 text-cyan">
                  <Search className="size-4.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-xs font-bold text-ink-100">
                      {DEMO_ACCOUNTS.INVESTIGATOR.name}
                    </span>
                    <span className="rounded-full bg-cyan/15 px-2 py-0.5 font-mono text-[9px] font-bold text-cyan border border-cyan/30">
                      INVESTIGATOR
                    </span>
                  </div>
                  <div className="mt-0.5 text-[11px] text-ink-400 leading-tight">
                    {DEMO_ACCOUNTS.INVESTIGATOR.desc}
                  </div>
                </div>
              </div>
              <div className="shrink-0 pl-2">
                {loading && activeDemoRole === "INVESTIGATOR" ? (
                  <Loader2 className="size-4 animate-spin text-cyan" />
                ) : (
                  <ChevronRight className="size-4 text-ink-500 transition-transform group-hover:translate-x-0.5 group-hover:text-cyan" />
                )}
              </div>
            </button>

            {/* Reviewer Card */}
            <button
              type="button"
              onClick={() => handleDemoAccount("REVIEWER")}
              disabled={loading}
              className="group relative flex items-center justify-between rounded-2xl border border-signal-green/30 bg-navy-900/80 p-3.5 text-left transition-all hover:border-signal-green hover:bg-navy-850 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)] disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl border border-signal-green/40 bg-signal-greenDim text-signal-green">
                  <FileCheck2 className="size-4.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-xs font-bold text-ink-100">
                      {DEMO_ACCOUNTS.REVIEWER.name}
                    </span>
                    <span className="rounded-full bg-signal-greenDim px-2 py-0.5 font-mono text-[9px] font-bold text-signal-green border border-signal-green/30">
                      REVIEWER
                    </span>
                  </div>
                  <div className="mt-0.5 text-[11px] text-ink-400 leading-tight">
                    {DEMO_ACCOUNTS.REVIEWER.desc}
                  </div>
                </div>
              </div>
              <div className="shrink-0 pl-2">
                {loading && activeDemoRole === "REVIEWER" ? (
                  <Loader2 className="size-4 animate-spin text-signal-green" />
                ) : (
                  <ChevronRight className="size-4 text-ink-500 transition-transform group-hover:translate-x-0.5 group-hover:text-signal-green" />
                )}
              </div>
            </button>

            {/* Admin Card */}
            <button
              type="button"
              onClick={() => handleDemoAccount("ADMIN")}
              disabled={loading}
              className="group relative flex items-center justify-between rounded-2xl border border-signal-purple/30 bg-navy-900/80 p-3.5 text-left transition-all hover:border-signal-purple hover:bg-navy-850 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl border border-signal-purple/40 bg-signal-purpleDim text-signal-purple">
                  <Settings className="size-4.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-xs font-bold text-ink-100">
                      {DEMO_ACCOUNTS.ADMIN.name}
                    </span>
                    <span className="rounded-full bg-signal-purpleDim px-2 py-0.5 font-mono text-[9px] font-bold text-signal-purple border border-signal-purple/30">
                      ADMIN
                    </span>
                  </div>
                  <div className="mt-0.5 text-[11px] text-ink-400 leading-tight">
                    {DEMO_ACCOUNTS.ADMIN.desc}
                  </div>
                </div>
              </div>
              <div className="shrink-0 pl-2">
                {loading && activeDemoRole === "ADMIN" ? (
                  <Loader2 className="size-4 animate-spin text-signal-purple" />
                ) : (
                  <ChevronRight className="size-4 text-ink-500 transition-transform group-hover:translate-x-0.5 group-hover:text-signal-purple" />
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
