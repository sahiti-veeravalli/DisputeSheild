import { useState, type ReactNode } from "react";
import { ArrowLeft, Sparkles, FileCheck2, ListChecks, Search } from "lucide-react";
import type { Dispute, DisputeCaseState } from "../types";
import { DeadlinePill, Card } from "./ui";
import { formatINR } from "../utils/format";
import AgentTrace from "./AgentTrace";
import { EvidenceFoundPanel, AssessmentPanel, MissingEvidencePanel } from "./AnalysisResult";
import Packet from "./Packet";
import AuditTrail from "./AuditTrail";

type Tab = "investigation" | "packet" | "audit";

interface Props {
  dispute: Dispute;
  caseState: DisputeCaseState;
  onBack: () => void;
  onAnalyzeStart: () => void;
  onAnalyzeComplete: () => void;
  onGeneratePacket: () => void;
  onApprovePacket: () => void;
  onSubmitPacket: () => void;
}

export default function Investigation({
  dispute,
  caseState,
  onBack,
  onAnalyzeStart,
  onAnalyzeComplete,
  onGeneratePacket,
  onApprovePacket,
  onSubmitPacket,
}: Props) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [tab, setTab] = useState<Tab>("investigation");
  const hasAnalysis = !!caseState.analysis;

  function handleAnalyzeClick() {
    setIsAnalyzing(true);
    onAnalyzeStart();
  }

  function handleTraceComplete() {
    setIsAnalyzing(false);
    onAnalyzeComplete();
  }

  function handleGeneratePacket() {
    onGeneratePacket();
    setTab("packet");
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <button
        onClick={onBack}
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-ink-500 transition-colors hover:text-ink-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </button>

      <Card className="mb-6 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-1.5 flex items-center gap-2.5">
              <span className="font-mono text-lg font-semibold text-ink-100">{dispute.id}</span>
              <DeadlinePill days={dispute.deadlineDays} />
            </div>
            <div className="text-sm text-ink-500">{dispute.customer}</div>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm sm:flex sm:gap-8">
            <InfoField label="Amount" value={formatINR(dispute.amount)} />
            <InfoField label="Dispute Reason" value={dispute.reason} />
            <InfoField label="Response Deadline" value={`${dispute.deadlineDays} days remaining`} />
          </div>
        </div>
      </Card>

      <div className="mb-6 flex items-center gap-1 border-b border-navy-600">
        <TabButton icon={<Search className="h-4 w-4" />} label="Investigation" active={tab === "investigation"} onClick={() => setTab("investigation")} />
        <TabButton
          icon={<FileCheck2 className="h-4 w-4" />}
          label="Evidence Packet"
          active={tab === "packet"}
          disabled={!hasAnalysis}
          onClick={() => hasAnalysis && setTab("packet")}
        />
        <TabButton icon={<ListChecks className="h-4 w-4" />} label="Audit Trail" active={tab === "audit"} onClick={() => setTab("audit")} />
      </div>

      {tab === "investigation" && (
        <div className="space-y-6">
          {!hasAnalysis && !isAnalyzing && (
            <Card className="flex flex-col items-center justify-center gap-4 p-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-signal-blueDim text-signal-blue">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-ink-100">Run an AI-assisted evidence investigation</h3>
                <p className="mx-auto mt-1 max-w-md text-sm text-ink-500">
                  The agent will retrieve available merchant records, map them to this dispute reason,
                  and flag anything missing.
                </p>
              </div>
              <button
                onClick={handleAnalyzeClick}
                className="mt-2 inline-flex items-center gap-2 rounded-lg bg-signal-blue px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-signal-blue/90"
              >
                <Sparkles className="h-4 w-4" />
                Analyze Dispute
              </button>
            </Card>
          )}

          {isAnalyzing && <AgentTrace onComplete={handleTraceComplete} />}

          {hasAnalysis && caseState.analysis && !isAnalyzing && (
            <>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <EvidenceFoundPanel analysis={caseState.analysis} />
                </div>
                <div className="lg:col-span-5">
                  <AssessmentPanel analysis={caseState.analysis} />
                </div>
              </div>
              <MissingEvidencePanel analysis={caseState.analysis} />
              <div className="flex justify-end">
                <button
                  onClick={handleGeneratePacket}
                  className="inline-flex items-center gap-2 rounded-lg bg-signal-blue px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-signal-blue/90"
                >
                  <FileCheck2 className="h-4 w-4" />
                  Generate Defense Packet
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {tab === "packet" && hasAnalysis && caseState.analysis && (
        <Packet
          dispute={dispute}
          analysis={caseState.analysis}
          packetApproved={caseState.packetApproved}
          submitted={caseState.submitted}
          submissionRef={caseState.submissionRef}
          onApprove={onApprovePacket}
          onBack={() => setTab("investigation")}
          onSubmit={onSubmitPacket}
        />
      )}

      {tab === "audit" && <AuditTrail entries={caseState.audit} />}
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-ink-700">{label}</div>
      <div className="mt-0.5 font-medium text-ink-100">{value}</div>
    </div>
  );
}

function TabButton({
  icon,
  label,
  active,
  disabled = false,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
        active
          ? "border-signal-blue text-ink-100"
          : disabled
          ? "border-transparent text-ink-700 cursor-not-allowed"
          : "border-transparent text-ink-500 hover:text-ink-100"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
