import { useEffect, useState } from "react";
import { Loader2, AlertTriangle, ShieldCheck } from "lucide-react";
import type { Dispute, DisputeCaseState } from "./types";
import { api } from "./api/client";
import Dashboard from "./components/Dashboard";
import Investigation from "./components/Investigation";
import EvaluationPanel from "./components/EvaluationPanel";
import { Card } from "./components/ui";

export default function App() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [caseStates, setCaseStates] = useState<Record<string, DisputeCaseState>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showEvaluation, setShowEvaluation] = useState(false);

  useEffect(() => {
    let active = true;
    api.listDisputes()
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
  }, []);

  async function handleRetry() {
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
    } catch (err: any) {
      setError(err.message || "Failed to load disputes from backend API.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSelect(id: string) {
    setSelectedId(id);
    setShowEvaluation(false);
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
    // Optimistic status flip
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

  const selectedDispute = selectedId ? disputes.find((d) => d.id === selectedId) ?? null : null;

  return (
    <div className="min-h-screen bg-navy-900 font-body text-ink-100">
      {loading && (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-signal-blueDim text-signal-blue">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <div className="flex items-center gap-2 font-mono text-sm text-ink-300">
            <Loader2 className="h-4 w-4 animate-spin text-signal-blue" />
            Connecting to DisputeShield backend API...
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="mx-auto max-w-lg px-6 py-20">
          <Card className="p-8 text-center">
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-signal-redDim text-signal-red">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg font-semibold text-ink-100">
              Unable to connect to API
            </h3>
            <p className="mt-1.5 text-xs text-ink-500">{error}</p>
            <button
              onClick={handleRetry}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-signal-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-signal-blue/90"
            >
              Retry Connection
            </button>
          </Card>
        </div>
      )}

      {!loading && !error && showEvaluation && (
        <EvaluationPanel onBack={() => setShowEvaluation(false)} />
      )}

      {!loading && !error && !showEvaluation && selectedDispute && (
        <Investigation
          dispute={selectedDispute}
          caseState={
            caseStates[selectedDispute.id] || {
              status: selectedDispute.status,
              packetApproved: false,
              submitted: false,
              audit: [],
            }
          }
          onBack={() => setSelectedId(null)}
          onAnalyzeStart={() => handleAnalyzeStart(selectedDispute.id)}
          onAnalyzeComplete={() => handleAnalyzeComplete(selectedDispute.id)}
          onGeneratePacket={() => handleGeneratePacket(selectedDispute.id)}
          onApprovePacket={() => handleApprovePacket(selectedDispute.id)}
          onSubmitPacket={() => handleSubmitPacket(selectedDispute.id)}
        />
      )}

      {!loading && !error && !showEvaluation && !selectedDispute && (
        <Dashboard
          disputes={disputes}
          caseStates={caseStates}
          onSelect={handleSelect}
          onViewEvaluation={() => setShowEvaluation(true)}
        />
      )}
    </div>
  );
}

