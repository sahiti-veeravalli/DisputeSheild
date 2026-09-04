import { useEffect, useState } from "react";
import { Loader2, AlertTriangle, ShieldCheck } from "lucide-react";
import type { Dispute, DisputeCaseState } from "./types";
import { api } from "./api/client";
import LandingPage from "./components/site/LandingPage";
import { AppShell } from "./components/layout/AppShell";
import { LoginPage } from "./components/auth/LoginPage";
import type { WorkspaceTab } from "./components/layout/Sidebar";
import { Card } from "./components/ui";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

type AppView = "landing" | "login" | "app";

function DisputeShieldApp() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [caseStates, setCaseStates] = useState<Record<string, DisputeCaseState>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<WorkspaceTab>("command-center");

  const [view, setView] = useState<AppView>(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash === "#app" || hash === "#dashboard") return "app";
      if (hash === "#login") return "login";
    }
    return "landing";
  });

  // Fetch disputes whenever user becomes authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    api
      .listDisputes()
      .then((data) => {
        if (active) {
          setDisputes(data);
          const map: Record<string, DisputeCaseState> = {};
          for (const d of data) {
            map[d.id] = {
              status: d.status,
              analysis: d.analysis,
              packetApproved: !!d.packetApproved,
              submitted: !!d.submitted,
              submissionRef: d.submissionRef,
              audit: [{ label: "Dispute opened", timestamp: d.openedAt }],
            };
          }
          setCaseStates(map);
          if (data.length > 0) {
            setSelectedId((prev) => prev || data[0].id);
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message || "Failed to load disputes from backend API.");
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [isAuthenticated, view]);

  async function handleRetry() {
    if (!isAuthenticated) {
      setView("login");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await api.listDisputes();
      setDisputes(data);
      const map: Record<string, DisputeCaseState> = {};
      for (const d of data) {
        map[d.id] = {
          status: d.status,
          analysis: d.analysis,
          packetApproved: !!d.packetApproved,
          submitted: !!d.submitted,
          submissionRef: d.submissionRef,
          audit: [{ label: "Dispute opened", timestamp: d.openedAt }],
        };
      }
      setCaseStates(map);
      if (data.length > 0 && !selectedId) {
        setSelectedId(data[0].id);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load disputes from backend API.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectDispute(id: string) {
    setSelectedId(id);
    try {
      const audit = await api.getAudit(id);
      setCaseStates((prev) => ({
        ...prev,
        [id]: {
          ...(prev[id] || {
            status: "New",
            packetApproved: false,
            submitted: false,
            audit: [],
          }),
          audit,
        },
      }));
    } catch {
      // Keep existing audit state if fetch fails
    }
  }

  function updateCase(id: string, updater: (c: DisputeCaseState) => DisputeCaseState) {
    setCaseStates((prev) => ({
      ...prev,
      [id]: prev[id] ? updater(prev[id]) : prev[id],
    }));
  }

  function handleAnalyzeStart(id: string) {
    updateCase(id, (c) => ({ ...c, status: "Investigating" }));
    setDisputes((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "Investigating" } : d))
    );
  }

  async function handleAnalyzeComplete(id: string) {
    try {
      const result = await api.analyze(id);
      const audit = await api.getAudit(id);
      updateCase(id, (c) => ({
        ...c,
        status: "Investigating",
        analysis: result,
        audit,
      }));
      setDisputes((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: "Investigating", analysis: result } : d))
      );
    } catch (err: any) {
      console.error("Failed to analyze dispute:", err);
    }
  }

  async function handleGeneratePacket(id: string) {
    try {
      await api.generatePacket(id);
      const audit = await api.getAudit(id);
      updateCase(id, (c) => ({
        ...c,
        audit,
      }));
    } catch (err: any) {
      console.error("Failed to generate packet:", err);
    }
  }

  async function handleApprovePacket(id: string) {
    try {
      await api.approvePacket(id);
      const audit = await api.getAudit(id);
      updateCase(id, (c) => ({
        ...c,
        packetApproved: true,
        audit,
      }));
    } catch (err: any) {
      console.error("Failed to approve packet:", err);
    }
  }

  async function handleSubmitPacket(id: string) {
    try {
      const response = await api.submitPacket(id);
      const audit = await api.getAudit(id);
      const updated = await api.getDispute(id);

      updateCase(id, (c) => ({
        ...c,
        status: "Resolved",
        submitted: true,
        submissionRef: response.submissionRef || updated.submissionRef,
        audit,
      }));

      setDisputes((prev) =>
        prev.map((d) =>
          d.id === id
            ? {
                ...d,
                status: "Resolved",
                submitted: true,
                submissionRef: response.submissionRef || updated.submissionRef,
              }
            : d
        )
      );
    } catch (err: any) {
      console.error("Failed to submit packet:", err);
    }
  }

  // Initial Auth Loading Spinner
  if (authLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-navy-950 px-6 font-body text-ink-100">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-signal-blueDim text-signal-blue border border-signal-blue/30 shadow-[0_0_25px_rgba(76,125,255,0.25)]">
          <ShieldCheck className="size-8" />
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-ink-300">
          <Loader2 className="size-4 animate-spin text-signal-blue" />
          Verifying security credentials...
        </div>
      </div>
    );
  }

  // Public Landing Page view
  if (view === "landing") {
    return (
      <LandingPage
        onLaunchDemo={() => {
          setView("login");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onViewEvaluation={() => {
          if (isAuthenticated) {
            setActiveWorkspaceTab("model");
            setView("app");
          } else {
            setView("login");
          }
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    );
  }

  // Login & Registration Page view
  if (view === "login" || !isAuthenticated) {
    return (
      <LoginPage
        onSuccess={() => {
          setView("app");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onBackToLanding={() => {
          setView("landing");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-navy-950 font-body text-ink-100">
      {loading && (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-signal-blueDim text-signal-blue border border-signal-blue/30 shadow-[0_0_25px_rgba(76,125,255,0.25)]">
            <ShieldCheck className="size-8" />
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-ink-300">
            <Loader2 className="size-4 animate-spin text-signal-blue" />
            Connecting to DisputeShield AI Live Engine...
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="mx-auto max-w-lg px-6 py-20">
          <Card className="p-8 text-center border-signal-red/30 bg-navy-900">
            <div className="mb-3 inline-flex size-12 items-center justify-center rounded-full bg-signal-redDim text-signal-red">
              <AlertTriangle className="size-6" />
            </div>
            <h3 className="font-display text-lg font-semibold text-ink-100">
              Unable to connect to DisputeShield Backend
            </h3>
            <p className="mt-1.5 text-xs text-ink-500 font-mono">{error}</p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                onClick={() => setView("landing")}
                className="rounded-xl border border-navy-500 bg-navy-800 px-4 py-2 text-xs font-semibold text-ink-300 hover:bg-navy-700"
              >
                Back to Landing Page
              </button>
              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-2 rounded-xl bg-signal-blue px-4 py-2 text-xs font-semibold text-white hover:bg-signal-blue/90"
              >
                Retry Connection
              </button>
            </div>
          </Card>
        </div>
      )}

      {!loading && !error && (
        <AppShell
          disputes={disputes}
          caseStates={caseStates}
          selectedDisputeId={selectedId}
          onSelectDispute={handleSelectDispute}
          onAnalyzeStart={handleAnalyzeStart}
          onAnalyzeComplete={handleAnalyzeComplete}
          onGeneratePacket={handleGeneratePacket}
          onApprovePacket={handleApprovePacket}
          onSubmitPacket={handleSubmitPacket}
          onBackToLanding={() => {
            setView("landing");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          initialTab={activeWorkspaceTab}
        />
      )}
    </div>
  );
}
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DisputeShieldApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
