import { useState } from "react";
import {
  FileCheck2,
  Printer,
  CheckCircle2,
  AlertTriangle,
  FileText,
} from "lucide-react";
import type { Dispute, DisputeCaseState } from "../../types";
import { formatINR } from "../../utils/format";
import { Card } from "../ui";

interface DefensePacketsWorkspaceProps {
  disputes: Dispute[];
  caseStates: Record<string, DisputeCaseState>;
  onSelectDispute: (id: string) => void;
  onApprovePacket: (id: string) => void;
  onSubmitPacket: (id: string) => void;
}

export function DefensePacketsWorkspace({
  disputes,
  caseStates,
  onSelectDispute,
  onApprovePacket,
  onSubmitPacket,
}: DefensePacketsWorkspaceProps) {
  const [selectedDisputeId, setSelectedDisputeId] = useState<string>(disputes[0]?.id || "");
  const activeDispute = disputes.find((d) => d.id === selectedDisputeId) || disputes[0];
  const activeState = caseStates[activeDispute?.id || ""];

  const hasAnalysis = !!activeState?.analysis;
  const isApproved = activeState?.packetApproved;
  const isSubmitted = activeState?.submitted;

  function handlePrint() {
    window.print();
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="font-display text-xl font-bold text-ink-100 sm:text-2xl flex items-center gap-2">
            <FileCheck2 className="size-6 text-signal-blue" />
            Defense Response Packets
          </h2>
          <p className="mt-1 text-xs text-ink-400">
            Formal, human-reviewed response packets formatted for Visa, Mastercard &amp; NPCI payment networks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-xl border border-navy-600 bg-navy-800 px-3.5 py-2 text-xs font-semibold text-ink-200 hover:bg-navy-700"
          >
            <Printer className="size-3.5" />
            Print / Export
          </button>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Packet List */}
        <div className="space-y-3 lg:col-span-4">
          <h3 className="font-display text-sm font-bold text-ink-200">
            Active Case Packets ({disputes.length})
          </h3>

          <div className="space-y-2.5 max-h-[680px] overflow-y-auto scrollbar-thin pr-1">
            {disputes.map((d) => {
              const state = caseStates[d.id];
              const isSelected = d.id === selectedDisputeId;
              const analyzed = !!state?.analysis;
              const approved = state?.packetApproved;
              const submitted = state?.submitted;

              return (
                <div
                  key={d.id}
                  onClick={() => setSelectedDisputeId(d.id)}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${
                    isSelected
                      ? "border-signal-blue bg-navy-800 shadow-[0_0_15px_rgba(76,125,255,0.25)]"
                      : "border-navy-700 bg-navy-900/60 hover:bg-navy-800/80"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-signal-blue">{d.id}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 font-mono text-[9px] font-bold ${
                        submitted
                          ? "bg-signal-greenDim text-signal-green border border-signal-green/30"
                          : approved
                          ? "bg-signal-blueDim text-signal-blue border border-signal-blue/30"
                          : analyzed
                          ? "bg-signal-amberDim text-signal-amber border border-signal-amber/30"
                          : "bg-navy-700 text-ink-400"
                      }`}
                    >
                      {submitted
                        ? "SUBMITTED"
                        : approved
                        ? "APPROVED"
                        : analyzed
                        ? "DRAFT READY"
                        : "UNANALYZED"}
                    </span>
                  </div>

                  <div className="mt-2 text-sm font-semibold text-ink-100">{d.customer}</div>
                  <div className="font-mono text-xs font-bold text-signal-amber">
                    {formatINR(d.amount)}
                  </div>
                  <div className="mt-1 text-[11px] text-ink-400 truncate">{d.reason}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Formal Document Preview */}
        <div className="lg:col-span-8 space-y-4">
          {activeDispute && (
            <Card className="p-8 border-navy-600 bg-navy-900 shadow-2xl relative">
              {/* Document Header */}
              <div className="border-b border-navy-700 pb-6 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex size-7 items-center justify-center rounded-lg bg-signal-blueDim text-signal-blue font-mono text-xs font-bold">
                      DS
                    </div>
                    <span className="font-display font-bold text-sm text-ink-100 tracking-tight">
                      DISPUTESHIELD AI DEFENSE DOCUMENT
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-lg font-bold text-ink-100">
                    Formal Chargeback Rebuttal &amp; Evidence Packet
                  </h3>
                  <p className="font-mono text-[11px] text-ink-400 mt-0.5">
                    Case Reference: {activeDispute.id} • Issued to Payment Scheme Arbitrator
                  </p>
                </div>

                <div className="text-right">
                  <span className="rounded-md border border-navy-600 bg-navy-800 px-2.5 py-1 font-mono text-xs text-ink-300">
                    CONFIDENTIAL
                  </span>
                </div>
              </div>

              {/* Case Metadata Grid */}
              <div className="my-6 grid grid-cols-2 gap-4 rounded-xl border border-navy-700 bg-navy-950/60 p-4 font-mono text-xs sm:grid-cols-4">
                <div>
                  <div className="text-ink-500 uppercase text-[10px]">Merchant Account</div>
                  <div className="font-bold text-ink-100 mt-0.5">Prime Mart India</div>
                </div>
                <div>
                  <div className="text-ink-500 uppercase text-[10px]">Cardholder Name</div>
                  <div className="font-bold text-ink-100 mt-0.5">{activeDispute.customer}</div>
                </div>
                <div>
                  <div className="text-ink-500 uppercase text-[10px]">Transaction Value</div>
                  <div className="font-bold text-signal-amber mt-0.5">
                    {formatINR(activeDispute.amount)}
                  </div>
                </div>
                <div>
                  <div className="text-ink-500 uppercase text-[10px]">Reason Code</div>
                  <div className="font-bold text-ink-100 mt-0.5">{activeDispute.reason}</div>
                </div>
              </div>

              {/* Document Sections */}
              {hasAnalysis ? (
                <div className="space-y-6 text-xs text-ink-300">
                  {/* Executive Summary */}
                  <div>
                    <h4 className="font-mono text-[11px] font-bold text-signal-blue uppercase tracking-wider mb-1.5">
                      1. Executive Case Summary
                    </h4>
                    <p className="leading-relaxed bg-navy-800/40 p-3 rounded-lg border border-navy-700 text-ink-200">
                      {activeState.analysis?.summary}
                    </p>
                  </div>

                  {/* Evidence Items */}
                  <div>
                    <h4 className="font-mono text-[11px] font-bold text-signal-blue uppercase tracking-wider mb-2">
                      2. Supporting Evidence Artifacts ({activeState.analysis?.found.length} Items Verified)
                    </h4>
                    <div className="space-y-2.5">
                      {activeState.analysis?.found.map((item) => (
                        <div
                          key={item.key}
                          className="rounded-lg border border-navy-700 bg-navy-800/60 p-3"
                        >
                          <div className="flex items-center justify-between font-semibold text-ink-100">
                            <span className="flex items-center gap-2">
                              <CheckCircle2 className="size-3.5 text-signal-green" />
                              {item.name}
                            </span>
                            <span className="font-mono text-[10px] text-ink-400">
                              Relevance: {item.relevance}%
                            </span>
                          </div>
                          <p className="mt-1 text-[11px] text-ink-400">{item.why}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Approval Action Bar */}
                  <div className="mt-8 pt-6 border-t border-navy-700 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      {isSubmitted ? (
                        <span className="text-signal-green font-mono text-xs font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="size-4" />
                          Submitted with Ref: {activeState.submissionRef}
                        </span>
                      ) : isApproved ? (
                        <span className="text-signal-blue font-mono text-xs font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="size-4" />
                          Merchant Approved — Ready for Scheme Submission
                        </span>
                      ) : (
                        <span className="text-signal-amber font-mono text-xs font-bold flex items-center gap-1.5">
                          <AlertTriangle className="size-4" />
                          Pending Human Review
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onSelectDispute(activeDispute.id)}
                        className="rounded-xl border border-navy-600 bg-navy-800 px-4 py-2 text-xs font-semibold text-ink-200 hover:bg-navy-700"
                      >
                        Open Investigation
                      </button>

                      {!isApproved && !isSubmitted && (
                        <button
                          onClick={() => onApprovePacket(activeDispute.id)}
                          className="rounded-xl bg-signal-blue px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-signal-blue/90"
                        >
                          Approve Packet
                        </button>
                      )}

                      {isApproved && !isSubmitted && (
                        <button
                          onClick={() => onSubmitPacket(activeDispute.id)}
                          className="rounded-xl bg-signal-green px-4 py-2 text-xs font-bold text-navy-950 shadow-md hover:bg-signal-green/90"
                        >
                          Submit to Network
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <FileText className="mx-auto size-10 text-ink-600 mb-3" />
                  <h4 className="font-display text-sm font-bold text-ink-200">
                    No Analysis Run for Case {activeDispute.id}
                  </h4>
                  <p className="text-xs text-ink-500 mt-1 max-w-sm mx-auto">
                    Run the 7-stage AI investigation pipeline first to compile merchant records into this packet.
                  </p>
                  <button
                    onClick={() => onSelectDispute(activeDispute.id)}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-signal-blue px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-signal-blue/90"
                  >
                    Run AI Investigation
                  </button>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
