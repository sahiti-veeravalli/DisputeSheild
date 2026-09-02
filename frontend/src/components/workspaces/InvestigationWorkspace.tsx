import { useState } from "react";
import {
  Sparkles,
  ArrowLeft,
  FileCheck2,
  ListChecks,
  Search,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  Bot,
  Zap,
  RotateCw,
  Cpu,
} from "lucide-react";
import type { Dispute, DisputeCaseState } from "../../types";
import { formatINR } from "../../utils/format";
import { DeadlinePill, Card } from "../ui";
import { EvidenceFoundPanel, AssessmentPanel, MissingEvidencePanel } from "../AnalysisResult";
import Packet from "../Packet";
import AuditTrail from "../AuditTrail";

interface InvestigationWorkspaceProps {
  dispute: Dispute;
  caseState: DisputeCaseState;
  onBack: () => void;
  onAnalyzeStart: () => void;
  onAnalyzeComplete: () => void;
  onGeneratePacket: () => void;
  onApprovePacket: () => void;
  onSubmitPacket: () => void;
}

type ActiveTab = "pipeline" | "evidence" | "packet" | "audit";

const PIPELINE_STAGES = [
  {
    step: 1,
    id: "alert",
    name: "Dispute Alert",
    desc: "Gateway chargeback notification & reason code parsed",
    icon: Clock,
  },
  {
    step: 2,
    id: "context",
    name: "Transaction Context",
    desc: "Order record, payment capture & customer session loaded",
    icon: Layers,
  },
  {
    step: 3,
    id: "mapping",
    name: "Evidence Mapped",
    desc: "Deterministic criteria mapped to card network requirements",
    icon: Search,
  },
  {
    step: 4,
    id: "rules",
    name: "Rules Evaluated",
    desc: "Deterministic rule engine matching verified proofs vs gaps",
    icon: ShieldCheck,
  },
  {
    step: 5,
    id: "ml",
    name: "ML Readiness Assessed",
    desc: "Logistic regression calculates Evidence Sufficiency Probability",
    icon: Cpu,
  },
  {
    step: 6,
    id: "decision",
    name: "Decision Support",
    desc: "Positive factors & critical gaps highlighted for investigator",
    icon: Bot,
  },
  {
    step: 7,
    id: "human",
    name: "Human Review",
    desc: "Response packet compiled for explicit merchant approval",
    icon: FileCheck2,
  },
];

export function InvestigationWorkspace({
  dispute,
  caseState,
  onBack,
  onAnalyzeStart,
  onAnalyzeComplete,
  onGeneratePacket,
  onApprovePacket,
  onSubmitPacket,
}: InvestigationWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("pipeline");
  const [activePipelineStep, setActivePipelineStep] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const hasAnalysis = !!caseState.analysis;
  const sufficiency = caseState.analysis?.evidenceSufficiencyProbability;
  const pct = sufficiency != null ? Math.round(sufficiency * 100) : null;

  function runInvestigationPipeline() {
    setIsAnalyzing(true);
    setActivePipelineStep(1);
    onAnalyzeStart();

    // Staggered interactive pipeline reveal
    const timers = [
      setTimeout(() => setActivePipelineStep(2), 350),
      setTimeout(() => setActivePipelineStep(3), 700),
      setTimeout(() => setActivePipelineStep(4), 1050),
      setTimeout(() => setActivePipelineStep(5), 1400),
      setTimeout(() => setActivePipelineStep(6), 1750),
      setTimeout(() => {
        setActivePipelineStep(7);
        setIsAnalyzing(false);
        onAnalyzeComplete();
      }, 2100),
    ];

    return () => timers.forEach(clearTimeout);
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Navigation & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-400 transition-colors hover:text-ink-100"
        >
          <ArrowLeft className="size-4" />
          Back to Command Center
        </button>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-ink-400">Case Identifier:</span>
          <span className="rounded-lg bg-navy-800 border border-navy-600 px-2.5 py-1 font-mono text-xs font-bold text-signal-blue">
            {dispute.id}
          </span>
        </div>
      </div>

      {/* Case Header Card */}
      <Card className="p-5 border-signal-blue/30 bg-gradient-to-r from-navy-800 via-navy-800/90 to-navy-900">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="font-display text-xl font-bold text-ink-100 sm:text-2xl">
                {dispute.customer}
              </h2>
              <DeadlinePill days={dispute.deadlineDays} />
              <span className="rounded-full border border-navy-600 bg-navy-900/80 px-2.5 py-0.5 font-mono text-[10px] text-ink-300">
                {dispute.reason}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-4 text-xs text-ink-400 font-mono">
              <span>Opened: {dispute.openedAt}</span>
              <span>•</span>
              <span>Gateway Ref: pay_live_{dispute.id.replace("DSP-", "ind_")}</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-right">
            <div>
              <div className="text-[10px] font-mono text-ink-500 uppercase tracking-wider">
                Disputed Amount
              </div>
              <div className="font-display text-2xl font-bold text-signal-amber">
                {formatINR(dispute.amount)}
              </div>
            </div>

            {hasAnalysis ? (
              <div className="pl-6 border-l border-navy-700">
                <div className="text-[10px] font-mono text-ink-500 uppercase tracking-wider">
                  Evidence Sufficiency
                </div>
                <div className="font-display text-2xl font-bold text-cyan">
                  {pct}%
                </div>
              </div>
            ) : (
              <button
                onClick={runInvestigationPipeline}
                disabled={isAnalyzing}
                className="inline-flex items-center gap-2 rounded-xl bg-signal-blue px-4 py-2.5 text-xs font-bold text-white shadow-[0_4px_20px_rgba(76,125,255,0.4)] transition-transform hover:scale-[1.02] disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <RotateCw className="size-4 animate-spin" />
                    Executing Pipeline...
                  </>
                ) : (
                  <>
                    <Zap className="size-4" />
                    Run AI Investigation
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* 7-STAGE PIPELINE VISUALIZATION */}
      <Card className="p-5 border-navy-600 bg-navy-900/60">
        <div className="flex items-center justify-between border-b border-navy-700 pb-3">
          <div>
            <h3 className="font-display text-sm font-bold text-ink-100 flex items-center gap-2">
              <Sparkles className="size-4 text-signal-blue" />
              7-Stage AI Defense Investigation Pipeline
            </h3>
            <p className="text-[11px] text-ink-400 mt-0.5">
              Deterministic evidence retrieval, rule validation, and calibrated logistic regression scoring.
            </p>
          </div>

          {!hasAnalysis && !isAnalyzing && (
            <button
              onClick={runInvestigationPipeline}
              className="text-xs font-semibold text-signal-blue hover:underline flex items-center gap-1"
            >
              Start Investigation →
            </button>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {PIPELINE_STAGES.map((st) => {
            const isDone = hasAnalysis || activePipelineStep >= st.step;
            const isCurrent = isAnalyzing && activePipelineStep === st.step;
            const Icon = st.icon;

            return (
              <div
                key={st.id}
                className={`relative flex flex-col justify-between rounded-xl border p-3 transition-all duration-300 ${
                  isCurrent
                    ? "border-signal-blue bg-signal-blueDim/40 shadow-[0_0_15px_rgba(76,125,255,0.3)] scale-[1.03]"
                    : isDone
                    ? "border-signal-green/40 bg-navy-800/90 text-ink-100"
                    : "border-navy-700/60 bg-navy-950/40 text-ink-500 opacity-60"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-ink-400">
                      0{st.step}
                    </span>
                    {isDone && !isCurrent ? (
                      <CheckCircle2 className="size-3.5 text-signal-green" />
                    ) : isCurrent ? (
                      <RotateCw className="size-3.5 text-signal-blue animate-spin" />
                    ) : (
                      <Icon className="size-3.5 text-ink-600" />
                    )}
                  </div>
                  <div className="mt-2 text-xs font-bold leading-snug">{st.name}</div>
                </div>
                <p className="mt-2 text-[10px] text-ink-400 leading-tight">{st.desc}</p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-navy-700">
        <button
          onClick={() => setActiveTab("pipeline")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition-colors ${
            activeTab === "pipeline"
              ? "border-signal-blue text-white"
              : "border-transparent text-ink-400 hover:text-ink-200"
          }`}
        >
          <Zap className="size-4 text-signal-blue" />
          AI Analysis &amp; Findings
        </button>

        <button
          onClick={() => hasAnalysis && setActiveTab("packet")}
          disabled={!hasAnalysis}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition-colors ${
            activeTab === "packet"
              ? "border-signal-blue text-white"
              : !hasAnalysis
              ? "border-transparent text-ink-600 cursor-not-allowed"
              : "border-transparent text-ink-400 hover:text-ink-200"
          }`}
        >
          <FileCheck2 className="size-4 text-cyan" />
          Defense Packet &amp; Review
        </button>

        <button
          onClick={() => setActiveTab("audit")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition-colors ${
            activeTab === "audit"
              ? "border-signal-blue text-white"
              : "border-transparent text-ink-400 hover:text-ink-200"
          }`}
        >
          <ListChecks className="size-4 text-signal-amber" />
          Audit Trail Log
        </button>
      </div>

      {/* TAB CONTENT: Pipeline & Analysis */}
      {activeTab === "pipeline" && (
        <div className="space-y-6">
          {!hasAnalysis && !isAnalyzing ? (
            <Card className="flex flex-col items-center justify-center p-12 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-signal-blueDim text-signal-blue border border-signal-blue/30 shadow-[0_0_25px_rgba(76,125,255,0.25)]">
                <Sparkles className="size-7" />
              </div>
              <h3 className="font-display mt-4 text-lg font-bold text-ink-100">
                Ready to Investigate Case {dispute.id}
              </h3>
              <p className="mt-1.5 max-w-md text-xs text-ink-400 leading-relaxed">
                DisputeShield AI will inspect merchant transaction ledgers, delivery scan records, customer support threads, and device signals to determine evidence sufficiency.
              </p>
              <button
                onClick={runInvestigationPipeline}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-signal-blue px-6 py-3 text-xs font-bold text-white shadow-lg transition-transform hover:scale-105"
              >
                <Zap className="size-4" />
                Analyze Case Now
              </button>
            </Card>
          ) : (
            <>
              {/* Evidence & Assessment Grid */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  {caseState.analysis && <EvidenceFoundPanel analysis={caseState.analysis} />}
                </div>
                <div className="lg:col-span-5">
                  {caseState.analysis && <AssessmentPanel analysis={caseState.analysis} />}
                </div>
              </div>

              {/* Missing Evidence Gaps */}
              {caseState.analysis && <MissingEvidencePanel analysis={caseState.analysis} />}

              {/* Action Banner */}
              <Card className="flex items-center justify-between p-5 bg-gradient-to-r from-navy-800 to-navy-900 border-navy-600">
                <div>
                  <h4 className="font-display text-sm font-bold text-ink-100">
                    Next Step: Compile Defense Packet
                  </h4>
                  <p className="text-xs text-ink-400">
                    Assemble found evidence items into a structured card network response document.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onGeneratePacket();
                    setActiveTab("packet");
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-signal-blue px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-signal-blue/90"
                >
                  <FileCheck2 className="size-4" />
                  Generate Defense Packet
                </button>
              </Card>
            </>
          )}
        </div>
      )}

      {/* TAB CONTENT: Defense Packet */}
      {activeTab === "packet" && hasAnalysis && caseState.analysis && (
        <Packet
          dispute={dispute}
          analysis={caseState.analysis}
          packetApproved={caseState.packetApproved}
          submitted={caseState.submitted}
          submissionRef={caseState.submissionRef}
          onApprove={onApprovePacket}
          onBack={() => setActiveTab("pipeline")}
          onSubmit={onSubmitPacket}
        />
      )}

      {/* TAB CONTENT: Audit Trail */}
      {activeTab === "audit" && <AuditTrail entries={caseState.audit} />}
    </div>
  );
}
