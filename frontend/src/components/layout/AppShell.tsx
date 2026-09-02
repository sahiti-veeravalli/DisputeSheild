import { useState } from "react";
import type { Dispute, DisputeCaseState, DisputeStatus } from "../../types";
import { Sidebar, type WorkspaceTab } from "./Sidebar";
import { Header } from "./Header";
import { CommandCenter } from "../workspaces/CommandCenter";
import { DisputesWorkspace } from "../workspaces/DisputesWorkspace";
import { InvestigationWorkspace } from "../workspaces/InvestigationWorkspace";
import { EvidenceVaultWorkspace } from "../workspaces/EvidenceVaultWorkspace";
import { AnalyticsWorkspace } from "../workspaces/AnalyticsWorkspace";
import { DefensePacketsWorkspace } from "../workspaces/DefensePacketsWorkspace";
import { ModelIntelligenceWorkspace } from "../workspaces/ModelIntelligenceWorkspace";
import { SettingsWorkspace } from "../workspaces/SettingsWorkspace";

interface AppShellProps {
  disputes: Dispute[];
  caseStates: Record<string, DisputeCaseState>;
  selectedDisputeId: string | null;
  onSelectDispute: (id: string) => void;
  onAnalyzeStart: (id: string) => void;
  onAnalyzeComplete: (id: string) => void;
  onGeneratePacket: (id: string) => void;
  onApprovePacket: (id: string) => void;
  onSubmitPacket: (id: string) => void;
  onBackToLanding: () => void;
  initialTab?: WorkspaceTab;
}

export function AppShell({
  disputes,
  caseStates,
  selectedDisputeId,
  onSelectDispute,
  onAnalyzeStart,
  onAnalyzeComplete,
  onGeneratePacket,
  onApprovePacket,
  onSubmitPacket,
  onBackToLanding,
  initialTab = "command-center",
}: AppShellProps) {
  const [currentTab, setCurrentTab] = useState<WorkspaceTab>(initialTab);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Selected dispute object
  const activeDispute =
    disputes.find((d) => d.id === selectedDisputeId) || disputes[0];
  const activeState: DisputeCaseState = activeDispute
    ? caseStates[activeDispute.id] || {
        status: activeDispute.status,
        packetApproved: false,
        submitted: false,
        audit: [],
      }
    : {
        status: "New" as DisputeStatus,
        packetApproved: false,
        submitted: false,
        audit: [],
      };

  const openDisputesCount = disputes.filter(
    (d) => caseStates[d.id]?.status !== "Resolved"
  ).length;
  const urgentCount = disputes.filter((d) => d.deadlineDays <= 2).length;

  function handleSelectDispute(id: string) {
    onSelectDispute(id);
    setCurrentTab("investigation");
  }

  return (
    <div className="min-h-screen bg-navy-950 text-ink-100 flex">
      {/* Collapsible Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        openDisputesCount={openDisputesCount}
        urgentCount={urgentCount}
        onBackToLanding={onBackToLanding}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          sidebarCollapsed ? "pl-20" : "pl-64"
        }`}
      >
        {/* Top Header */}
        <Header
          currentTab={currentTab}
          disputes={disputes}
          onSelectDispute={handleSelectDispute}
          onNavigateTab={setCurrentTab}
          onBackToLanding={onBackToLanding}
        />

        {/* Workspace Body */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto animate-fadeUp">
          {currentTab === "command-center" && (
            <CommandCenter
              disputes={disputes}
              caseStates={caseStates}
              onSelectDispute={handleSelectDispute}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === "disputes" && (
            <DisputesWorkspace
              disputes={disputes}
              caseStates={caseStates}
              onSelectDispute={handleSelectDispute}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === "investigation" && activeDispute && (
            <InvestigationWorkspace
              dispute={activeDispute}
              caseState={activeState}
              onBack={() => setCurrentTab("command-center")}
              onAnalyzeStart={() => onAnalyzeStart(activeDispute.id)}
              onAnalyzeComplete={() => onAnalyzeComplete(activeDispute.id)}
              onGeneratePacket={() => onGeneratePacket(activeDispute.id)}
              onApprovePacket={() => onApprovePacket(activeDispute.id)}
              onSubmitPacket={() => onSubmitPacket(activeDispute.id)}
            />
          )}

          {currentTab === "evidence" && (
            <EvidenceVaultWorkspace
              disputes={disputes}
              caseStates={caseStates}
              onSelectDispute={handleSelectDispute}
            />
          )}

          {currentTab === "analytics" && (
            <AnalyticsWorkspace
              disputes={disputes}
              caseStates={caseStates}
              onSelectDispute={handleSelectDispute}
            />
          )}

          {currentTab === "packets" && (
            <DefensePacketsWorkspace
              disputes={disputes}
              caseStates={caseStates}
              onSelectDispute={handleSelectDispute}
              onApprovePacket={onApprovePacket}
              onSubmitPacket={onSubmitPacket}
            />
          )}

          {currentTab === "model" && <ModelIntelligenceWorkspace />}

          {currentTab === "settings" && <SettingsWorkspace />}
        </main>
      </div>
    </div>
  );
}
