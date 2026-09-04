import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  X,
  User,
  LogOut,
  Check,
  Search,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import type { UserRole } from "../../types";
import { useAuth } from "../../context/AuthContext";

export interface RoleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RoleCardMeta {
  role: UserRole;
  title: string;
  subtitle: string;
  description: string;
  badgeLabel: string;
  badgeStyle: string;
  activeBg: string;
  activeBorder: string;
  activeText: string;
  icon: typeof Search;
  avatarStyle: string;
}

export const ROLE_CARD_DATA: Record<UserRole, RoleCardMeta> = {
  INVESTIGATOR: {
    role: "INVESTIGATOR",
    title: "Investigator",
    subtitle: "Lead Investigator",
    description: "Investigation & defense packet operations",
    badgeLabel: "INVESTIGATOR",
    badgeStyle: "bg-cyan/15 text-cyan border-cyan/30",
    activeBg: "bg-cyan/10",
    activeBorder: "border-cyan/50",
    activeText: "text-cyan",
    icon: Search,
    avatarStyle: "bg-cyan/15 text-cyan border-cyan/30 shadow-[0_0_14px_rgba(56,189,248,0.25)]",
  },
  REVIEWER: {
    role: "REVIEWER",
    title: "Reviewer",
    subtitle: "Compliance Reviewer",
    description: "Evidence review & response approval",
    badgeLabel: "REVIEWER",
    badgeStyle: "bg-signal-greenDim text-signal-green border-signal-green/30",
    activeBg: "bg-signal-greenDim/80",
    activeBorder: "border-signal-green/50",
    activeText: "text-signal-green",
    icon: ShieldCheck,
    avatarStyle: "bg-signal-greenDim text-signal-green border-signal-green/30 shadow-[0_0_14px_rgba(52,211,153,0.25)]",
  },
  ADMIN: {
    role: "ADMIN",
    title: "Admin",
    subtitle: "Platform Administrator",
    description: "Full platform and security access",
    badgeLabel: "ADMIN",
    badgeStyle: "bg-signal-purpleDim text-signal-purple border-signal-purple/30",
    activeBg: "bg-signal-purpleDim/80",
    activeBorder: "border-signal-purple/50",
    activeText: "text-signal-purple",
    icon: ShieldAlert,
    avatarStyle: "bg-signal-purpleDim text-signal-purple border-signal-purple/30 shadow-[0_0_14px_rgba(168,85,247,0.25)]",
  },
};

const ROLES_LIST: UserRole[] = ["INVESTIGATOR", "REVIEWER", "ADMIN"];

function cleanUserName(rawName?: string): string {
  if (!rawName) return "Merchant Ops Admin";
  return rawName.replace(/\s*\([^)]*\)/, "").trim();
}

export function RoleDrawer({ isOpen, onClose }: RoleDrawerProps) {
  const { user, logout, demoLogin } = useAuth();
  const currentRole: UserRole = user?.role || "INVESTIGATOR";
  const activeMeta = ROLE_CARD_DATA[currentRole] || ROLE_CARD_DATA.INVESTIGATOR;
  const userName = cleanUserName(user?.name);
  const userEmail = user?.email || `${currentRole.toLowerCase()}@disputeshield.ai`;

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const handleSelectRole = async (role: UserRole) => {
    if (role !== currentRole) {
      await demoLogin(role);
    }
    onClose();
  };

  const handleSignOut = () => {
    onClose();
    logout();
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="role-drawer-title"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* Right-Side Drawer Panel */}
      <div className="fixed inset-y-0 right-0 flex max-w-full">
        <aside
          onClick={(e) => e.stopPropagation()}
          className="relative flex h-full w-[min(380px,calc(100vw-16px))] flex-col justify-between border-l border-navy-600/80 bg-navy-900 text-ink-100 shadow-2xl transition-transform duration-300 ease-out animate-slideInRight overflow-y-auto"
        >
          {/* Main Content Area */}
          <div className="p-5 space-y-6">
            {/* Top Bar: Title & Close Button */}
            <div className="flex items-center justify-between border-b border-navy-700/80 pb-4">
              <span
                id="role-drawer-title"
                className="font-mono text-xs font-semibold uppercase tracking-wider text-ink-400"
              >
                ACCOUNT
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close role drawer"
                className="flex size-8 items-center justify-center rounded-xl border border-navy-700 bg-navy-800/80 text-ink-400 transition-colors hover:border-navy-600 hover:bg-navy-700 hover:text-ink-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-blue"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Account Profile Card */}
            <div className="flex items-start gap-3.5 rounded-2xl border border-navy-700/80 bg-navy-950/70 p-4 shadow-inner">
              <div
                className={`flex size-11 shrink-0 items-center justify-center rounded-xl border font-mono text-sm font-bold ${activeMeta.avatarStyle}`}
              >
                <User className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-ink-100 truncate">
                  {userName}
                </div>
                <div className="text-xs font-semibold text-ink-300 mt-0.5">
                  {activeMeta.subtitle}
                </div>
                <div className="font-mono text-[11px] text-ink-500 truncate mt-1">
                  {userEmail}
                </div>
              </div>
            </div>

            {/* Workspace Role Section */}
            <div className="space-y-3 pt-1">
              <div>
                <h3 className="font-mono text-[11px] font-bold uppercase tracking-wider text-ink-400">
                  WORKSPACE ROLE
                </h3>
                <p className="text-xs text-ink-500 mt-0.5">
                  Choose the workspace context you want to operate in.
                </p>
              </div>

              {/* Role Cards List */}
              <div className="space-y-2.5 pt-1">
                {ROLES_LIST.map((r) => {
                  const card = ROLE_CARD_DATA[r];
                  const isActive = currentRole === r;

                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleSelectRole(r)}
                      aria-pressed={isActive}
                      className={`group relative flex w-full flex-col rounded-2xl border p-4 text-left transition-all duration-200 ${
                        isActive
                          ? `${card.activeBg} ${card.activeBorder} shadow-[0_0_20px_rgba(0,0,0,0.15)]`
                          : "border-navy-700/80 bg-navy-950/60 hover:border-navy-600 hover:bg-navy-800/80"
                      } focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-blue`}
                    >
                      {/* Top Header of Card */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`flex size-8 shrink-0 items-center justify-center rounded-xl border transition-colors ${
                              isActive
                                ? card.avatarStyle
                                : "border-navy-700 bg-navy-800/90 text-ink-400 group-hover:border-navy-600 group-hover:text-ink-200"
                            }`}
                          >
                            <card.icon className="size-4" />
                          </div>
                          <div>
                            <span
                              className={`text-sm font-bold ${
                                isActive ? "text-ink-100" : "text-ink-200 group-hover:text-ink-100"
                              }`}
                            >
                              {card.title}
                            </span>
                            <div className="text-xs text-ink-400 font-medium leading-tight">
                              {card.subtitle}
                            </div>
                          </div>
                        </div>

                        {/* Status / Checkmark Indicator */}
                        {isActive ? (
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`rounded-full px-2 py-0.5 font-mono text-[8.5px] font-bold border ${card.badgeStyle}`}
                            >
                              ACTIVE
                            </span>
                            <div
                              className={`flex size-5 items-center justify-center rounded-full ${card.activeBg} border ${card.activeBorder}`}
                            >
                              <Check className={`size-3 stroke-[2.5] ${card.activeText}`} />
                            </div>
                          </div>
                        ) : (
                          <ArrowRight className="size-4 text-ink-600 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-ink-300" />
                        )}
                      </div>

                      {/* Card Description */}
                      <p className="mt-2.5 text-xs text-ink-400 leading-relaxed pl-[42px]">
                        {card.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="border-t border-navy-700/80 p-5 space-y-3 bg-navy-850/80">
            <div className="flex items-center justify-between rounded-xl border border-navy-700/80 bg-navy-950/60 px-3.5 py-2.5">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-ink-500">
                  Current workspace
                </div>
                <div className="text-xs font-semibold text-ink-200 mt-0.5">
                  Merchant Operations
                </div>
              </div>
              <span className="font-mono text-[10px] text-signal-green font-medium flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-signal-green animate-pulse" />
                Live
              </span>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-transparent px-3 py-2.5 text-xs font-semibold text-ink-400 transition-colors hover:border-signal-red/30 hover:bg-signal-redDim/30 hover:text-signal-red focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-red"
            >
              <LogOut className="size-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>
      </div>
    </div>,
    document.body
  );
}
