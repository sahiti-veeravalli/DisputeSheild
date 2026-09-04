import {
  LayoutDashboard,
  ShieldAlert,
  Search,
  FolderLock,
  BarChart3,
  FileCheck2,
  Cpu,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { GithubIcon } from "../../lib/icons";
import { SITE } from "../../lib/site";
import { useAuth } from "../../context/AuthContext";
import type { UserRole } from "../../types";

export type WorkspaceTab =
  | "command-center"
  | "disputes"
  | "investigation"
  | "evidence"
  | "analytics"
  | "packets"
  | "model"
  | "settings";

interface SidebarProps {
  currentTab: WorkspaceTab;
  onSelectTab: (tab: WorkspaceTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  openDisputesCount: number;
  urgentCount: number;
  onBackToLanding: () => void;
}

interface NavItem {
  id: WorkspaceTab;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: number | string;
  badgeColor?: string;
  description: string;
  allowedRoles: UserRole[];
}

export function Sidebar({
  currentTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  openDisputesCount,
  urgentCount,
  onBackToLanding,
}: SidebarProps) {
  const { user } = useAuth();
  const userRole: UserRole = user?.role || "INVESTIGATOR";

  const allNavItems: NavItem[] = [
    {
      id: "command-center",
      label: "Command Center",
      icon: LayoutDashboard,
      description: "Overview & urgent triage",
      allowedRoles: ["ADMIN", "INVESTIGATOR", "REVIEWER"],
    },
    {
      id: "disputes",
      label: "Disputes",
      icon: ShieldAlert,
      badge: openDisputesCount,
      badgeColor: "bg-signal-blueDim text-signal-blue border border-signal-blue/30",
      description: "Dispute queue & filters",
      allowedRoles: ["ADMIN", "INVESTIGATOR", "REVIEWER"],
    },
    {
      id: "investigation",
      label: "AI Investigation",
      icon: Search,
      badge: "LIVE",
      badgeColor: "bg-cyan/15 text-cyan border border-cyan/30",
      description: "Interactive pipeline & ML scoring",
      allowedRoles: ["ADMIN", "INVESTIGATOR"],
    },
    {
      id: "evidence",
      label: "Evidence Vault",
      icon: FolderLock,
      description: "Merchant artifacts & gaps",
      allowedRoles: ["ADMIN", "INVESTIGATOR", "REVIEWER"],
    },
    {
      id: "analytics",
      label: "Analytics & Risk",
      icon: BarChart3,
      description: "Exposure & readiness trends",
      allowedRoles: ["ADMIN", "INVESTIGATOR", "REVIEWER"],
    },
    {
      id: "packets",
      label: "Defense Packets",
      icon: FileCheck2,
      description: "Case packet previews & approval",
      allowedRoles: ["ADMIN", "INVESTIGATOR", "REVIEWER"],
    },
    {
      id: "model",
      label: "Model Intelligence",
      icon: Cpu,
      badge: "Seed 42",
      badgeColor: "bg-surface-2 text-ink-300 border border-navy-500",
      description: "Held-out benchmark metrics",
      allowedRoles: ["ADMIN", "INVESTIGATOR"],
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      description: "Gateway & risk thresholds",
      allowedRoles: ["ADMIN"],
    },
  ];

  const visibleNavItems = allNavItems.filter((item) =>
    item.allowedRoles.includes(userRole)
  );

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col border-r border-navy-700 bg-navy-950/95 backdrop-blur-xl transition-all duration-300 ease-in-out ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-navy-700 px-4">
        {!collapsed ? (
          <button
            onClick={onBackToLanding}
            className="group flex items-center gap-2.5 text-left transition-opacity hover:opacity-85"
            title="Return to Product Landing Page"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-signal-blue/40 bg-signal-blueDim text-signal-blue shadow-[0_0_15px_rgba(76,125,255,0.25)]">
              <ShieldCheck className="size-5" />
            </div>
            <div className="min-w-0">
              <div className="font-display truncate text-sm font-bold tracking-tight text-ink-100">
                DisputeShield <span className="text-signal-blue">AI</span>
              </div>
              <div className="truncate font-mono text-[10px] tracking-wider text-ink-500 uppercase">
                Merchant Ops
              </div>
            </div>
          </button>
        ) : (
          <button
            onClick={onBackToLanding}
            className="mx-auto flex size-9 items-center justify-center rounded-xl border border-signal-blue/40 bg-signal-blueDim text-signal-blue hover:opacity-85"
            title="DisputeShield AI"
          >
            <ShieldCheck className="size-5" />
          </button>
        )}

        <button
          onClick={onToggleCollapse}
          className="hidden size-7 items-center justify-center rounded-lg border border-navy-600 bg-navy-800/80 text-ink-400 transition-colors hover:bg-navy-700 hover:text-ink-100 md:flex"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin">
        {!collapsed && (
          <div className="px-3 pb-2 text-[10px] font-semibold tracking-widest text-ink-600 uppercase font-mono">
            Platform Workspaces
          </div>
        )}

        {visibleNavItems.map((item) => {
          const isActive = currentTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-medium transition-all duration-200 ${
                isActive
                  ? "bg-signal-blue text-white shadow-[0_4px_16px_rgba(76,125,255,0.3)] font-semibold"
                  : "text-ink-400 hover:bg-navy-800/70 hover:text-ink-100"
              }`}
              title={collapsed ? `${item.label} — ${item.description}` : undefined}
            >
              <Icon
                className={`size-4.5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? "text-white" : "text-ink-400 group-hover:text-signal-blue"
                }`}
              />

              {!collapsed && (
                <div className="flex min-w-0 flex-1 items-center justify-between gap-1.5">
                  <span className="truncate">{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold leading-none ${
                        isActive
                          ? "bg-white/20 text-white"
                          : item.badgeColor || "bg-navy-700 text-ink-300"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}

              {/* Collapsed dot indicator */}
              {collapsed && isActive && (
                <span className="absolute right-2 size-1.5 rounded-full bg-cyan shadow-[0_0_8px_#38BDF8]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Urgent Alert Callout */}
      {!collapsed && urgentCount > 0 && (
        <div className="mx-3 mb-3 rounded-xl border border-signal-amber/30 bg-signal-amberDim/30 p-3 text-xs">
          <div className="flex items-center justify-between text-signal-amber font-semibold">
            <span className="flex items-center gap-1.5">
              <span className="size-2 animate-ping rounded-full bg-signal-amber" />
              Action Required
            </span>
            <span className="font-mono">{urgentCount} urgent</span>
          </div>
          <p className="mt-1 text-[11px] text-ink-300 leading-snug">
            {urgentCount} dispute{urgentCount > 1 ? "s" : ""} due within 48h.
          </p>
          <button
            onClick={() => onSelectTab("disputes")}
            className="mt-2 text-[11px] font-semibold text-signal-amber underline underline-offset-2 hover:text-ink-100"
          >
            Review priority queue →
          </button>
        </div>
      )}

      {/* Bottom Footer Section */}
      <div className="border-t border-navy-700 p-3 space-y-2">
        {!collapsed ? (
          <>
            <div className="flex items-center justify-between rounded-lg border border-navy-700 bg-navy-900/60 p-2 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-signal-green shadow-[0_0_6px_#34D399]" />
                <span className="font-medium text-ink-200">Razorpay Ops Live</span>
              </div>
              <span className="font-mono text-[10px] text-ink-500">v1.0</span>
            </div>

            <div className="flex items-center justify-between px-1 text-[11px] text-ink-500">
              <button
                onClick={onBackToLanding}
                className="hover:text-signal-blue transition-colors flex items-center gap-1"
              >
                ← Product Page
              </button>
              <a
                href={SITE.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-ink-100 transition-colors flex items-center gap-1"
                title="GitHub Repository"
              >
                <GithubIcon className="size-3.5" />
                GitHub
              </a>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 py-1">
            <button
              onClick={onBackToLanding}
              className="text-ink-500 hover:text-signal-blue"
              title="Return to Product Page"
            >
              ←
            </button>
            <a
              href={SITE.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="text-ink-500 hover:text-ink-100"
              title="GitHub"
            >
              <GithubIcon className="size-4" />
            </a>
          </div>
        )}
      </div>
    </aside>
  );
}
