import { FileCheck2, CheckCircle2, ArrowLeft } from "lucide-react";
import type { AnalysisResult, Dispute, EvidenceCategory } from "../types";
import { Card } from "./ui";
import { CATEGORY_ICON } from "../utils/constants";
import { formatINR } from "../utils/format";

const SECTIONS: { category: EvidenceCategory; title: string }[] = [
  { category: "Transaction", title: "Section 1 — Transaction Details" },
  { category: "Order", title: "Section 2 — Order Details" },
  { category: "Delivery", title: "Section 3 — Delivery Evidence" },
  { category: "Customer Communication", title: "Section 4 — Customer Communication" },
  { category: "Device & Payment Signals", title: "Section 5 — Supporting Signals" },
];

interface Props {
  dispute: Dispute;
  analysis: AnalysisResult;
  packetApproved: boolean;
  submitted: boolean;
  submissionRef?: string;
  onApprove: () => void;
  onBack: () => void;
  onSubmit: () => void;
}

export default function Packet({
  dispute,
  analysis,
  packetApproved,
  submitted,
  submissionRef,
  onApprove,
  onBack,
  onSubmit,
}: Props) {
  return (
    <div className="space-y-5">
      <Card className="p-6">
        <div className="mb-5 flex items-center gap-2.5 border-b border-navy-600 pb-4">
          <FileCheck2 className="h-5 w-5 text-signal-blue" />
          <div>
            <h3 className="font-display text-base font-semibold text-ink-100">
              Chargeback Response Packet
            </h3>
            <p className="text-xs text-ink-500">Compiled from evidence retrieved during analysis</p>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-3 gap-4 rounded-lg border border-navy-600 bg-navy-700/40 p-4 font-mono text-xs">
          <div>
            <div className="text-ink-700">Case ID</div>
            <div className="mt-0.5 text-ink-100">{dispute.id}</div>
          </div>
          <div>
            <div className="text-ink-700">Dispute Reason</div>
            <div className="mt-0.5 text-ink-100">{dispute.reason}</div>
          </div>
          <div>
            <div className="text-ink-700">Transaction Amount</div>
            <div className="mt-0.5 text-ink-100">{formatINR(dispute.amount)}</div>
          </div>
        </div>

        <div className="space-y-6">
          {SECTIONS.map((section) => {
            const items = analysis.found.filter((f) => f.category === section.category);
            return (
              <div key={section.category}>
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink-100">
                  <span className="text-signal-blue">{CATEGORY_ICON[section.category]}</span>
                  {section.title}
                </div>
                {items.length === 0 ? (
                  <p className="pl-6 text-xs italic text-ink-700">No supporting evidence on file in this category.</p>
                ) : (
                  <div className="space-y-3 pl-6">
                    {items.map((item) => (
                      <div key={item.key} className="border-l-2 border-navy-600 pl-3">
                        <div className="text-sm font-medium text-ink-100">{item.name}</div>
                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 font-mono text-xs text-ink-500">
                          {item.details.map((d) => (
                            <span key={d.label}>
                              {d.label}: <span className="text-ink-300">{d.value}</span>
                            </span>
                          ))}
                        </div>
                        <p className="mt-1.5 text-xs leading-relaxed text-ink-500">
                          <span className="text-ink-700">Included because: </span>
                          {item.why}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="mb-1 font-display text-base font-semibold text-ink-100">
          Review &amp; Approve Evidence Packet
        </h3>
        <p className="mb-4 text-sm text-ink-500">
          A merchant must review and approve this packet before it can be submitted. Nothing is sent
          automatically.
        </p>

        {!submitted && (
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 rounded-lg border border-navy-500 px-4 py-2.5 text-sm font-medium text-ink-300 transition-colors hover:bg-navy-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Investigation
            </button>
            {!packetApproved ? (
              <button
                onClick={onApprove}
                className="inline-flex items-center gap-1.5 rounded-lg bg-signal-blue px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-signal-blue/90"
              >
                <CheckCircle2 className="h-4 w-4" />
                Approve Packet
              </button>
            ) : (
              <button
                onClick={onSubmit}
                className="inline-flex items-center gap-1.5 rounded-lg bg-signal-green px-4 py-2.5 text-sm font-medium text-navy-950 transition-colors hover:bg-signal-green/90"
              >
                Submit Response
              </button>
            )}
            {packetApproved && (
              <span className="text-xs text-signal-green">Packet approved — ready to submit.</span>
            )}
          </div>
        )}

        {submitted && (
          <div className="animate-fadeUp rounded-lg border border-signal-green/30 bg-signal-greenDim/40 p-5">
            <div className="mb-2 flex items-center gap-2 text-signal-green">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-display text-base font-semibold">Evidence Packet Submitted</span>
            </div>
            <p className="text-sm text-ink-300">
              This is a simulated submission for demo purposes. No live dispute network was contacted.
            </p>
            <div className="mt-3 font-mono text-sm text-ink-100">
              Submission Reference: <span className="text-signal-green">{submissionRef}</span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
