import { useState, useRef, useEffect } from "react";
import { Search, Bell, Sparkles, ExternalLink, User } from "lucide-react";
import type { Dispute } from "../../types";
import { formatINR } from "../../utils/format";
import type { WorkspaceTab } from "./Sidebar";

interface HeaderProps {
  currentTab: WorkspaceTab;
  disputes: Dispute[];
  onSelectDispute: (id: string) => void;
  onNavigateTab: (tab: WorkspaceTab) => void;
  onBackToLanding: () => void;
}

const TAB_META: Record<WorkspaceTab, { title: string; subtitle: string }> = {
  "command-center": {
    title: "Command Center",
    subtitle: "Real-time dispute triage, financial exposure & urgent risk queue",
  },
  disputes: {
    title: "Dispute Queue",
    subtitle: "Complete merchant dispute records, multi-criteria filtering & readiness",
  },
  investigation: {
    title: "AI Investigation Workspace",
    subtitle: "7-stage deterministic rule engine, live ML evidence scoring & decision support",
  },
  evidence: {
    title: "Evidence Vault",
    subtitle: "Aggregated merchant documentation, delivery proofs, support chats & gaps",
  },
  analytics: {
    title: "Analytics & Risk Intelligence",
    subtitle: "Financial exposure metrics, win probability distribution & volume trends",
  },
  packets: {
    title: "Defense Packets",
    subtitle: "Document-style chargeback response packets ready for merchant review",
  },
  model: {
    title: "Model Intelligence & Explainability",
    subtitle: "Reproducible Track 02 held-out benchmark metrics (Seed 42, 200 disputes)",
  },
  settings: {
    title: "Settings & Gateways",
    subtitle: "Payment processor connection, risk thresholds & notification webhooks",
  },
};

export function Header({
  currentTab,
  disputes,
  onSelectDispute,
  onNavigateTab,
  onBackToLanding,
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const urgentDisputes = disputes.filter((d) => d.deadlineDays <= 2);
  const unanalyzedCount = disputes.filter((d) => d.status === "New").length;

  const filteredDisputes = searchQuery.trim()
    ? disputes.filter(
        (d) =>
          d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.reason.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const meta = TAB_META[currentTab] || {
    title: "DisputeShield AI",
    subtitle: "Merchant dispute intelligence operations",
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-navy-700 bg-navy-900/80 px-6 backdrop-blur-xl">
      {/* Title & Breadcrumbs */}
      <div className="min-w-0 pr-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-semibold text-signal-blue tracking-wider uppercase">
            Platform / {currentTab.replace("-", " ")}
          </span>
        </div>
        <h1 className="font-display truncate text-base font-bold text-ink-100 sm:text-lg">
          {meta.title}
        </h1>
      </div>

      {/* Center / Right controls */}
      <div className="flex items-center gap-3">
        {/* Global Search */}
        <div ref={searchRef} className="relative hidden sm:block w-64 lg:w-80">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-ink-500" />
            <input
              type="text"
              placeholder="Search disputes, customers, reason codes..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              className="w-full rounded-xl border border-navy-600 bg-navy-950/80 py-2 pl-9 pr-3 text-xs text-ink-100 placeholder-ink-500 outline-none transition-all focus:border-signal-blue focus:ring-1 focus:ring-signal-blue/50"
            />
          </div>

          {/* Search Dropdown */}
          {searchOpen && searchQuery.trim() && (
            <div className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-xl border border-navy-600 bg-navy-900/95 p-2 shadow-2xl backdrop-blur-xl">
              <div className="px-2 py-1 font-mono text-[10px] text-ink-500 uppercase tracking-wider">
                Matching Disputes ({filteredDisputes.length})
              </div>
              {filteredDisputes.length > 0 ? (
                <div className="max-h-60 overflow-y-auto space-y-1 scrollbar-thin">
                  {filteredDisputes.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => {
                        onSelectDispute(d.id);
                        setSearchOpen(false);
                        setSearchQuery("");
                      }}
                      className="flex w-full items-center justify-between rounded-lg p-2 text-left text-xs transition-colors hover:bg-navy-800"
                    >
                      <div>
                        <span className="font-mono font-semibold text-signal-blue">{d.id}</span>
                        <span className="ml-2 text-ink-200">{d.customer}</span>
                        <div className="text-[11px] text-ink-500">{d.reason}</div>
                      </div>
                      <div className="text-right font-mono text-xs text-ink-100">
                        {formatINR(d.amount)}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-3 text-center text-xs text-ink-500">
                  No disputes matched &ldquo;{searchQuery}&rdquo;
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative flex size-9 items-center justify-center rounded-xl border border-navy-600 bg-navy-800 text-ink-400 transition-colors hover:bg-navy-700 hover:text-ink-100"
            aria-label="Notifications"
          >
            <Bell className="size-4" />
            {urgentDisputes.length > 0 && (
              <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-signal-red font-mono text-[9px] font-bold text-white shadow-[0_0_8px_rgba(248,113,113,0.6)]">
                {urgentDisputes.length}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-2xl border border-navy-600 bg-navy-900/95 p-3 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-navy-700 pb-2 px-1">
                <span className="font-display text-xs font-semibold text-ink-100">
                  Operations Notifications
                </span>
                <span className="font-mono text-[10px] text-signal-amber font-medium">
                  {urgentDisputes.length} critical
                </span>
              </div>

              <div className="mt-2 space-y-2 max-h-72 overflow-y-auto scrollbar-thin">
                {urgentDisputes.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => {
                      onSelectDispute(d.id);
                      setNotificationsOpen(false);
                    }}
                    className="cursor-pointer rounded-xl border border-signal-amber/30 bg-signal-amberDim/20 p-2.5 transition-colors hover:bg-signal-amberDim/40"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-signal-amber">
                      <span className="font-mono">{d.id}</span>
                      <span>{d.deadlineDays}d remaining</span>
                    </div>
                    <div className="mt-0.5 text-xs text-ink-200">{d.customer}</div>
                    <div className="mt-1 flex items-center justify-between font-mono text-[11px] text-ink-400">
                      <span>{formatINR(d.amount)}</span>
                      <span className="text-signal-blue font-sans">Investigate →</span>
                    </div>
                  </div>
                ))}

                {unanalyzedCount > 0 && (
                  <div
                    onClick={() => {
                      onNavigateTab("disputes");
                      setNotificationsOpen(false);
                    }}
                    className="cursor-pointer rounded-xl border border-navy-700 bg-navy-800/60 p-2.5 text-xs hover:bg-navy-800"
                  >
                    <div className="flex items-center gap-1.5 font-semibold text-ink-200">
                      <Sparkles className="size-3.5 text-signal-blue" />
                      {unanalyzedCount} disputes awaiting AI investigation
                    </div>
                    <p className="mt-1 text-[11px] text-ink-500">
                      Run automated evidence mapping and ML sufficiency scoring.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Back to Landing Page CTA */}
        <button
          onClick={onBackToLanding}
          className="hidden md:inline-flex items-center gap-1.5 rounded-xl border border-navy-600 bg-navy-800 px-3 py-2 text-xs font-medium text-ink-300 transition-colors hover:bg-navy-700 hover:text-white"
        >
          <span>Landing Page</span>
          <ExternalLink className="size-3 text-ink-500" />
        </button>

        {/* Merchant User Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-navy-700">
          <div className="flex size-8 items-center justify-center rounded-xl bg-signal-blueDim border border-signal-blue/30 text-signal-blue font-mono text-xs font-bold">
            <User className="size-4" />
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-semibold text-ink-100 leading-tight">
              Merchant Ops Admin
            </div>
            <div className="font-mono text-[10px] text-ink-500 leading-tight">
              Prime Mart India
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
