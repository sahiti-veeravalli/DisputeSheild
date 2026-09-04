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
  Database,
  Cpu,
  Zap,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useAuth, DEMO_ACCOUNTS } from "../../context/AuthContext";
import type { UserRole } from "../../types";
import { ThemeToggle } from "../layout/ThemeToggle";
import { Card } from "../ui";

interface LoginPageProps {
  onSuccess: () => void;
  onBackToLanding: () => void;
}

export function LoginPage({ onSuccess, onBackToLanding }: LoginPageProps) {
  const { login, register, demoLogin } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [showManualLogin, setShowManualLogin] = useState(false);

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
    <div className="relative flex min-h-screen flex-col justify-center bg-navy-950 px-4 py-10 text-ink-100 font-body selection:bg-signal-blue selection:text-white lg:px-12">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-40 left-1/4 size-[600px] -translate-x-1/2 rounded-full bg-signal-blue/10 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-10 right-1/4 size-[500px] rounded-full bg-cyan/5 blur-[120px]" />

      {/* Top Bar Navigation */}
      <div className="absolute top-6 inset-x-6 md:inset-x-12 flex items-center justify-between z-20">
        <button
          onClick={onBackToLanding}
          className="inline-flex items-center gap-2 rounded-xl border border-navy-700 bg-navy-900/70 px-3.5 py-2 text-xs font-medium text-ink-300 backdrop-blur-md transition-colors hover:border-navy-600 hover:text-ink-100"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Product Overview</span>
        </button>
        <ThemeToggle />
      </div>

      <div className="mx-auto w-full max-w-6xl pt-12 pb-6 lg:py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14 items-start">
          
          {/* LEFT COLUMN: Product Value, Capabilities & Environment Indicator */}
          <div className="lg:col-span-6 space-y-7">
            {/* Demo Environment Indicator */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-signal-blue/30 bg-signal-blueDim/70 px-3.5 py-1.5 text-[11px] font-mono backdrop-blur-md shadow-sm">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal-blue opacity-75"></span>
                <span className="relative inline-flex size-2 rounded-full bg-signal-blue"></span>
              </span>
              <span className="font-bold tracking-wider text-signal-blue uppercase">Demo Environment</span>
              <span className="text-ink-700">•</span>
              <span className="text-ink-300 font-normal">Seeded data • No real payment data</span>
            </div>

            {/* Brand Title & Hero Statement */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="inline-flex size-11 items-center justify-center rounded-xl border border-signal-blue/40 bg-signal-blueDim text-signal-blue shadow-[0_0_24px_rgba(76,125,255,0.25)]">
                  <ShieldCheck className="size-6" />
                </div>
                <span className="font-display text-lg font-bold tracking-tight text-ink-100">
                  DisputeShield <span className="text-signal-blue">AI</span>
                </span>
              </div>

              <h1 className="font-display text-3xl font-bold tracking-tight text-ink-100 sm:text-4xl leading-[1.15]">
                Every chargeback deserves an{" "}
                <span className="bg-gradient-to-r from-signal-blue via-cyan to-ink-100 bg-clip-text text-transparent">
                  intelligent defense.
                </span>
              </h1>

              <p className="text-sm leading-relaxed text-ink-300 max-w-lg">
                Enterprise-grade dispute triage combining deterministic financial rules, calibrated XGBoost win probability models, and automated evidence packet generation.
              </p>
            </div>

            {/* 3 Core Product Capabilities */}
            <div className="space-y-3 pt-2">
              {/* Pillar 1 */}
              <div className="flex items-start gap-3.5 rounded-2xl border border-navy-800 bg-navy-900/50 p-3.5 backdrop-blur-sm transition-colors hover:border-navy-700">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-cyan/30 bg-cyan/10 text-cyan mt-0.5">
                  <Database className="size-4.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-xs font-bold text-ink-100">Evidence Intelligence</h2>
                    <span className="rounded bg-navy-850 px-1.5 py-0.5 font-mono text-[9px] text-cyan border border-cyan/20">Real-time</span>
                  </div>
                  <p className="text-[12px] text-ink-400 leading-snug mt-0.5">
                    Correlate AVS/CVV verification, tracking telemetry, and historical merchant evidence in seconds.
                  </p>
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="flex items-start gap-3.5 rounded-2xl border border-navy-800 bg-navy-900/50 p-3.5 backdrop-blur-sm transition-colors hover:border-navy-700">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-signal-purple/30 bg-signal-purpleDim text-signal-purple mt-0.5">
                  <Cpu className="size-4.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-xs font-bold text-ink-100">Explainable ML</h2>
                    <span className="rounded bg-navy-850 px-1.5 py-0.5 font-mono text-[9px] text-signal-purple border border-signal-purple/20">XGBoost</span>
                  </div>
                  <p className="text-[12px] text-ink-400 leading-snug mt-0.5">
                    Transparent win-probability scoring, calibrated confidence intervals, and direct feature attribution.
                  </p>
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="flex items-start gap-3.5 rounded-2xl border border-navy-800 bg-navy-900/50 p-3.5 backdrop-blur-sm transition-colors hover:border-navy-700">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-signal-green/30 bg-signal-greenDim text-signal-green mt-0.5">
                  <Zap className="size-4.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-xs font-bold text-ink-100">Defense Automation</h2>
                    <span className="rounded bg-navy-850 px-1.5 py-0.5 font-mono text-[9px] text-signal-green border border-signal-green/20">1-Click</span>
                  </div>
                  <p className="text-[12px] text-ink-400 leading-snug mt-0.5">
                    Generate formatted representment cover letters and multi-document evidence binders instantly.
                  </p>
                </div>
              </div>
            </div>

            {/* Architecture / Security Pill Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="rounded-lg border border-navy-700 bg-navy-900/60 px-2.5 py-1 font-mono text-[10px] text-ink-400">
                Spring Security 6
              </span>
              <span className="rounded-lg border border-navy-700 bg-navy-900/60 px-2.5 py-1 font-mono text-[10px] text-ink-400">
                JWT Stateless Auth
              </span>
              <span className="rounded-lg border border-navy-700 bg-navy-900/60 px-2.5 py-1 font-mono text-[10px] text-ink-400">
                Method-Level RBAC
              </span>
              <span className="rounded-lg border border-navy-700 bg-navy-900/60 px-2.5 py-1 font-mono text-[10px] text-ink-400">
                OpenAPI 3.0
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: 1-Click Demo Entry & Workspace Access */}
          <div className="lg:col-span-6 space-y-5">
            {/* Primary Demo Access Container */}
            <Card className="border-navy-700 bg-navy-900/90 p-6 sm:p-7 shadow-2xl backdrop-blur-xl">
              {/* Header */}
              <div className="mb-5 flex items-start justify-between border-b border-navy-800 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-signal-blue font-mono text-[11px] font-bold uppercase tracking-wider mb-1">
                    <Sparkles className="size-3.5" />
                    <span>1-Click Demo Access</span>
                  </div>
                  <h2 className="font-display text-lg font-bold text-ink-100">
                    Choose a Pre-Seeded Role
                  </h2>
                  <p className="text-xs text-signal-blue/90 font-medium mt-0.5">
                    Explore the platform instantly — no account required
                  </p>
                </div>
                <span className="rounded-md border border-signal-blue/30 bg-signal-blueDim px-2 py-0.5 font-mono text-[10px] font-bold text-signal-blue shrink-0">
                  Instant RBAC
                </span>
              </div>

              {error && (
                <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-signal-red/30 bg-signal-redDim/30 p-3 text-xs text-signal-red animate-fadeIn">
                  <AlertCircle className="size-4 shrink-0 mt-0.5" />
                  <div className="leading-snug">{error}</div>
                </div>
              )}

              {/* 3 Prominent 1-Click Demo Cards */}
              <div className="space-y-3">
                {/* Investigator Card */}
                <button
                  type="button"
                  onClick={() => handleDemoAccount("INVESTIGATOR")}
                  disabled={loading}
                  className="group relative flex w-full items-center justify-between rounded-2xl border border-cyan/40 bg-navy-950/70 p-4 text-left transition-all hover:border-cyan hover:bg-navy-900 hover:shadow-[0_0_24px_rgba(56,189,248,0.18)] disabled:opacity-50"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex size-10 items-center justify-center rounded-xl border border-cyan/40 bg-cyan/15 text-cyan shrink-0 transition-transform group-hover:scale-105">
                      <Search className="size-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display text-sm font-bold text-ink-100 group-hover:text-cyan transition-colors">
                          {DEMO_ACCOUNTS.INVESTIGATOR.name}
                        </span>
                        <span className="rounded-full bg-cyan/15 px-2 py-0.5 font-mono text-[9px] font-bold text-cyan border border-cyan/30">
                          INVESTIGATOR
                        </span>
                      </div>
                      <div className="mt-0.5 text-xs text-ink-400 leading-tight">
                        {DEMO_ACCOUNTS.INVESTIGATOR.desc}
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 pl-3">
                    {loading && activeDemoRole === "INVESTIGATOR" ? (
                      <Loader2 className="size-4.5 animate-spin text-cyan" />
                    ) : (
                      <div className="flex size-7 items-center justify-center rounded-lg bg-navy-850 border border-navy-700 group-hover:border-cyan/50 group-hover:bg-cyan/10 transition-colors">
                        <ChevronRight className="size-4 text-ink-400 group-hover:text-cyan transition-transform group-hover:translate-x-0.5" />
                      </div>
                    )}
                  </div>
                </button>

                {/* Reviewer Card */}
                <button
                  type="button"
                  onClick={() => handleDemoAccount("REVIEWER")}
                  disabled={loading}
                  className="group relative flex w-full items-center justify-between rounded-2xl border border-signal-green/40 bg-navy-950/70 p-4 text-left transition-all hover:border-signal-green hover:bg-navy-900 hover:shadow-[0_0_24px_rgba(52,211,153,0.18)] disabled:opacity-50"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex size-10 items-center justify-center rounded-xl border border-signal-green/40 bg-signal-greenDim text-signal-green shrink-0 transition-transform group-hover:scale-105">
                      <FileCheck2 className="size-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display text-sm font-bold text-ink-100 group-hover:text-signal-green transition-colors">
                          {DEMO_ACCOUNTS.REVIEWER.name}
                        </span>
                        <span className="rounded-full bg-signal-greenDim px-2 py-0.5 font-mono text-[9px] font-bold text-signal-green border border-signal-green/30">
                          REVIEWER
                        </span>
                      </div>
                      <div className="mt-0.5 text-xs text-ink-400 leading-tight">
                        {DEMO_ACCOUNTS.REVIEWER.desc}
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 pl-3">
                    {loading && activeDemoRole === "REVIEWER" ? (
                      <Loader2 className="size-4.5 animate-spin text-signal-green" />
                    ) : (
                      <div className="flex size-7 items-center justify-center rounded-lg bg-navy-850 border border-navy-700 group-hover:border-signal-green/50 group-hover:bg-signal-greenDim transition-colors">
                        <ChevronRight className="size-4 text-ink-400 group-hover:text-signal-green transition-transform group-hover:translate-x-0.5" />
                      </div>
                    )}
                  </div>
                </button>

                {/* Admin Card */}
                <button
                  type="button"
                  onClick={() => handleDemoAccount("ADMIN")}
                  disabled={loading}
                  className="group relative flex w-full items-center justify-between rounded-2xl border border-signal-purple/40 bg-navy-950/70 p-4 text-left transition-all hover:border-signal-purple hover:bg-navy-900 hover:shadow-[0_0_24px_rgba(168,85,247,0.18)] disabled:opacity-50"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex size-10 items-center justify-center rounded-xl border border-signal-purple/40 bg-signal-purpleDim text-signal-purple shrink-0 transition-transform group-hover:scale-105">
                      <Settings className="size-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display text-sm font-bold text-ink-100 group-hover:text-signal-purple transition-colors">
                          {DEMO_ACCOUNTS.ADMIN.name}
                        </span>
                        <span className="rounded-full bg-signal-purpleDim px-2 py-0.5 font-mono text-[9px] font-bold text-signal-purple border border-signal-purple/30">
                          ADMIN
                        </span>
                      </div>
                      <div className="mt-0.5 text-xs text-ink-400 leading-tight">
                        {DEMO_ACCOUNTS.ADMIN.desc}
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 pl-3">
                    {loading && activeDemoRole === "ADMIN" ? (
                      <Loader2 className="size-4.5 animate-spin text-signal-purple" />
                    ) : (
                      <div className="flex size-7 items-center justify-center rounded-lg bg-navy-850 border border-navy-700 group-hover:border-signal-purple/50 group-hover:bg-signal-purpleDim transition-colors">
                        <ChevronRight className="size-4 text-ink-400 group-hover:text-signal-purple transition-transform group-hover:translate-x-0.5" />
                      </div>
                    )}
                  </div>
                </button>
              </div>

              {/* Collapsible / Secondary Sign In Section */}
              <div className="mt-6 border-t border-navy-800/80 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowManualLogin(!showManualLogin);
                    setError(null);
                  }}
                  className="flex w-full items-center justify-between rounded-xl px-2 py-1.5 text-xs text-ink-400 transition-colors hover:text-ink-200"
                >
                  <div className="text-left">
                    <span className="font-medium">Sign in with custom credentials</span>
                    <span className="block text-[11px] text-ink-500">
                      For demo purposes, choose a pre-seeded role above.
                    </span>
                  </div>
                  {showManualLogin ? (
                    <ChevronUp className="size-4 text-ink-400" />
                  ) : (
                    <ChevronDown className="size-4 text-ink-400" />
                  )}
                </button>

                {showManualLogin && (
                  <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 border-t border-navy-800/50 pt-4 animate-fadeIn">
                    <div className="flex items-center justify-between pb-1">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink-400">
                        {isRegistering ? "Create New User" : "Workspace Credentials"}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setIsRegistering(!isRegistering);
                          setError(null);
                        }}
                        className="font-mono text-[11px] text-signal-blue hover:underline"
                      >
                        {isRegistering ? "Switch to Sign In" : "Register new account"}
                      </button>
                    </div>

                    {isRegistering && (
                      <div>
                        <label className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-400 mb-1">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-ink-500" />
                          <input
                            type="text"
                            required
                            placeholder="e.g. Alex Rivera"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-xl border border-navy-700 bg-navy-950/80 py-2 pl-9 pr-3 text-xs text-ink-100 placeholder-ink-600 outline-none transition-all focus:border-signal-blue focus:ring-1 focus:ring-signal-blue/50"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-400 mb-1">
                        Work Email Address
                      </label>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-ink-500" />
                        <input
                          type="email"
                          required
                          placeholder="name@disputeshield.ai"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full rounded-xl border border-navy-700 bg-navy-950/80 py-2 pl-9 pr-3 text-xs text-ink-100 placeholder-ink-600 outline-none transition-all focus:border-signal-blue focus:ring-1 focus:ring-signal-blue/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-400 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-ink-500" />
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full rounded-xl border border-navy-700 bg-navy-950/80 py-2 pl-9 pr-3 text-xs text-ink-100 placeholder-ink-600 outline-none transition-all focus:border-signal-blue focus:ring-1 focus:ring-signal-blue/50"
                        />
                      </div>
                    </div>

                    {isRegistering && (
                      <div>
                        <label className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-400 mb-1">
                          Role
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {(["ADMIN", "INVESTIGATOR", "REVIEWER"] as UserRole[]).map((r) => (
                            <button
                              key={r}
                              type="button"
                              onClick={() => setRole(r)}
                              className={`rounded-xl border py-1.5 text-center font-mono text-[10px] font-bold transition-all ${
                                role === r
                                  ? "border-signal-blue bg-signal-blue/20 text-signal-blue"
                                  : "border-navy-700 bg-navy-950/50 text-ink-400 hover:border-navy-600"
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
                      className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-signal-blue py-2.5 text-xs font-bold text-white shadow-[0_4px_16px_rgba(76,125,255,0.3)] transition-all hover:bg-signal-blue/90 disabled:opacity-50"
                    >
                      {loading && !activeDemoRole ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          <span>Authenticating...</span>
                        </>
                      ) : (
                        <>
                          <span>{isRegistering ? "Create & Sign In" : "Sign In to Workspace"}</span>
                          <ArrowRight className="size-3.5" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
