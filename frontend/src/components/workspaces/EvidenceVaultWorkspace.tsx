import { useState, useMemo } from "react";
import {
  FolderLock,
  Search,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import type { Dispute, DisputeCaseState, EvidenceCategory, EvidenceStrength } from "../../types";
import { Card, StrengthPill } from "../ui";
import { CATEGORY_ICON } from "../../utils/constants";

interface EvidenceVaultWorkspaceProps {
  disputes: Dispute[];
  caseStates: Record<string, DisputeCaseState>;
  onSelectDispute: (id: string) => void;
}

interface VaultItem {
  id: string;
  name: string;
  category: EvidenceCategory;
  sourceSystem: string;
  strength: EvidenceStrength;
  status: "Verified" | "Gap";
  linkedDisputeId: string;
  customer: string;
  why: string;
  timestamp: string;
}

export function EvidenceVaultWorkspace({
  disputes,
  caseStates,
  onSelectDispute,
}: EvidenceVaultWorkspaceProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  // Aggregate vault items from all disputes and their analysis states
  const vaultItems = useMemo<VaultItem[]>(() => {
    const items: VaultItem[] = [];

    disputes.forEach((d) => {
      const state = caseStates[d.id];
      if (state?.analysis) {
        // Found items
        state.analysis.found.forEach((f) => {
          items.push({
            id: `${d.id}-${f.key}`,
            name: f.name,
            category: f.category,
            sourceSystem: getSourceSystem(f.category),
            strength: f.strength,
            status: "Verified",
            linkedDisputeId: d.id,
            customer: d.customer,
            why: f.why,
            timestamp: d.openedAt,
          });
        });

        // Missing items
        state.analysis.missing.forEach((m) => {
          items.push({
            id: `${d.id}-gap-${m.key}`,
            name: m.name,
            category: inferCategoryFromKey(m.key),
            sourceSystem: getSourceSystem(inferCategoryFromKey(m.key)),
            strength: m.critical ? "Strong" : "Moderate",
            status: "Gap",
            linkedDisputeId: d.id,
            customer: d.customer,
            why: m.why,
            timestamp: d.openedAt,
          });
        });
      } else {
        // Unanalyzed baseline items
        items.push({
          id: `${d.id}-tx-base`,
          name: "Payment Gateway Capture Ledger",
          category: "Transaction",
          sourceSystem: "Razorpay Core Ledger",
          strength: "Strong",
          status: "Verified",
          linkedDisputeId: d.id,
          customer: d.customer,
          why: "Baseline payment capture record confirming settlement authorization.",
          timestamp: d.openedAt,
        });
        items.push({
          id: `${d.id}-ord-base`,
          name: "Merchant Order Specifications",
          category: "Order",
          sourceSystem: "Shopify / ERP OMS",
          strength: "Moderate",
          status: "Verified",
          linkedDisputeId: d.id,
          customer: d.customer,
          why: "Order receipt establishing item description and fulfillment terms.",
          timestamp: d.openedAt,
        });
      }
    });

    return items;
  }, [disputes, caseStates]);

  const filteredItems = vaultItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.linkedDisputeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sourceSystem.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;

    const matchesStatus =
      selectedStatus === "All" || item.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const verifiedCount = vaultItems.filter((i) => i.status === "Verified").length;
  const gapCount = vaultItems.filter((i) => i.status === "Gap").length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="font-display text-xl font-bold text-ink-100 sm:text-2xl flex items-center gap-2.5">
            <FolderLock className="size-6 text-signal-blue" />
            Merchant Evidence Vault
          </h2>
          <p className="mt-1 text-xs text-ink-400">
            Unified evidence artifact index across payment gateways, courier logistics, support channels &amp; fraud logs.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="rounded-xl border border-signal-green/30 bg-signal-greenDim/30 px-3 py-1.5 text-signal-green font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5" />
            {verifiedCount} Verified Artifacts
          </span>
          <span className="rounded-xl border border-signal-amber/30 bg-signal-amberDim/30 px-3 py-1.5 text-signal-amber font-semibold flex items-center gap-1.5">
            <AlertTriangle className="size-3.5" />
            {gapCount} Gaps Flagged
          </span>
        </div>
      </div>

      {/* Filter Controls */}
      <Card className="p-4 space-y-3">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
          {/* Search Box */}
          <div className="relative md:col-span-6">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-ink-500" />
            <input
              type="text"
              placeholder="Search evidence artifacts, source systems, dispute IDs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-navy-600 bg-navy-900 py-2 pl-9 pr-3 text-xs text-ink-100 placeholder-ink-500 outline-none focus:border-signal-blue"
            />
          </div>

          {/* Category Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-xl border border-navy-600 bg-navy-900 px-3 py-2 text-xs text-ink-200 outline-none focus:border-signal-blue"
            >
              <option value="All">All Evidence Categories</option>
              <option value="Transaction">Transaction &amp; Gateway</option>
              <option value="Order">Order Specifications</option>
              <option value="Delivery">Delivery &amp; Courier POD</option>
              <option value="Customer Communication">Customer Communication</option>
              <option value="Device & Payment Signals">Device &amp; Fraud Signals</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-xl border border-navy-600 bg-navy-900 px-3 py-2 text-xs text-ink-200 outline-none focus:border-signal-blue"
            >
              <option value="All">All Artifact States</option>
              <option value="Verified">Verified on File</option>
              <option value="Gap">Missing / Critical Gap</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Evidence Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectDispute(item.linkedDisputeId)}
            className="group cursor-pointer rounded-2xl border border-navy-600 bg-navy-800 p-4 transition-all duration-200 hover:-translate-y-1 hover:border-signal-blue/50 hover:shadow-card"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-signal-blue">{CATEGORY_ICON[item.category]}</span>
                <span className="font-mono text-[10px] font-semibold text-ink-500 uppercase tracking-wider">
                  {item.category}
                </span>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 font-mono text-[9px] font-bold ${
                  item.status === "Verified"
                    ? "bg-signal-greenDim text-signal-green border border-signal-green/30"
                    : "bg-signal-amberDim text-signal-amber border border-signal-amber/30"
                }`}
              >
                {item.status === "Verified" ? "VERIFIED" : "GAP DETECTED"}
              </span>
            </div>

            <h4 className="mt-2.5 font-display text-sm font-bold text-ink-100 group-hover:text-signal-blue transition-colors">
              {item.name}
            </h4>

            <p className="mt-1.5 text-xs text-ink-400 line-clamp-2 leading-relaxed">
              {item.why}
            </p>

            <div className="mt-3 pt-3 border-t border-navy-700 flex items-center justify-between font-mono text-[11px] text-ink-500">
              <span className="text-signal-blue font-bold">{item.linkedDisputeId}</span>
              <span>{item.sourceSystem}</span>
              <StrengthPill strength={item.strength} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getSourceSystem(cat: EvidenceCategory): string {
  switch (cat) {
    case "Transaction":
      return "Razorpay Gateway";
    case "Order":
      return "Merchant OMS";
    case "Delivery":
      return "BlueDart / Delhivery 3PL";
    case "Customer Communication":
      return "Zendesk Helpdesk";
    case "Device & Payment Signals":
      return "Fraud Risk Engine";
    default:
      return "Merchant Records";
  }
}

function inferCategoryFromKey(key: string): EvidenceCategory {
  if (key.includes("delivery") || key.includes("Proof") || key.includes("tracking")) return "Delivery";
  if (key.includes("device") || key.includes("ip") || key.includes("Auth") || key.includes("Signal"))
    return "Device & Payment Signals";
  if (key.includes("refund") || key.includes("duplicate") || key.includes("Payment"))
    return "Transaction";
  if (key.includes("Support") || key.includes("Message") || key.includes("Notification"))
    return "Customer Communication";
  return "Order";
}
