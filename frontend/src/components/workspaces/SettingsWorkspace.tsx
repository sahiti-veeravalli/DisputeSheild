import { useState } from "react";
import {
  Settings,
  ShieldCheck,
  Zap,
  Key,
  CheckCircle2,
  Globe,
  Save,
} from "lucide-react";
import { Card } from "../ui";

export function SettingsWorkspace() {
  const [saved, setSaved] = useState(false);
  const [highValueThreshold, setHighValueThreshold] = useState("10000");
  const [autoInvestigate, setAutoInvestigate] = useState(true);
  const [urgentDeadlineAlerts, setUrgentDeadlineAlerts] = useState(true);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="font-display text-xl font-bold text-ink-100 sm:text-2xl flex items-center gap-2">
            <Settings className="size-6 text-signal-blue" />
            Platform &amp; Gateway Settings
          </h2>
          <p className="mt-1 text-xs text-ink-400">
            Configure payment processor webhooks, risk thresholds, and automated investigation rules.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 rounded-xl bg-signal-blue px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-signal-blue/90"
        >
          {saved ? <CheckCircle2 className="size-4 text-signal-green" /> : <Save className="size-4" />}
          {saved ? "Settings Saved" : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Payment Gateway Connection */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-navy-700 pb-3">
            <h3 className="font-display text-sm font-bold text-ink-100 flex items-center gap-2">
              <Globe className="size-4 text-signal-blue" />
              Gateway Integrations
            </h3>
            <span className="rounded-full bg-signal-greenDim border border-signal-green/30 px-2 py-0.5 font-mono text-[10px] text-signal-green font-bold">
              CONNECTED
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-mono text-[10px] text-ink-500 uppercase">
                Active Payment Gateway
              </label>
              <div className="mt-1 rounded-xl border border-navy-700 bg-navy-900/60 p-3 font-medium text-ink-100 flex items-center justify-between">
                <span>Razorpay Payments India (Live Demo Stream)</span>
                <ShieldCheck className="size-4 text-signal-green" />
              </div>
            </div>

            <div>
              <label className="font-mono text-[10px] text-ink-500 uppercase">
                Webhook Event Listener
              </label>
              <div className="mt-1 rounded-xl border border-navy-700 bg-navy-900/60 p-3 font-mono text-ink-300">
                https://api.disputeshield.ai/api/webhooks/disputes
              </div>
            </div>

            <div>
              <label className="font-mono text-[10px] text-ink-500 uppercase">
                Demo Authentication API Key
              </label>
              <div className="mt-1 rounded-xl border border-navy-700 bg-navy-900/60 p-3 font-mono text-ink-300 flex items-center justify-between">
                <span>disputeshield-demo-key-2026</span>
                <Key className="size-3.5 text-ink-500" />
              </div>
            </div>
          </div>
        </Card>

        {/* Risk Thresholds & Automated Rules */}
        <Card className="p-6 space-y-4">
          <div className="border-b border-navy-700 pb-3">
            <h3 className="font-display text-sm font-bold text-ink-100 flex items-center gap-2">
              <Zap className="size-4 text-cyan" />
              AI Automation &amp; Risk Thresholds
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-ink-100">Auto-Run Evidence Mapping</div>
                <div className="text-[11px] text-ink-500">
                  Automatically retrieve courier and order logs when a chargeback alert arrives.
                </div>
              </div>
              <input
                type="checkbox"
                checked={autoInvestigate}
                onChange={(e) => setAutoInvestigate(e.target.checked)}
                className="size-4 rounded accent-signal-blue"
              />
            </div>

            <div className="flex items-center justify-between border-t border-navy-700 pt-3">
              <div>
                <div className="font-semibold text-ink-100">Critical Deadline Notifications</div>
                <div className="text-[11px] text-ink-500">
                  Alert merchant ops when response deadline drops to ≤ 48 hours.
                </div>
              </div>
              <input
                type="checkbox"
                checked={urgentDeadlineAlerts}
                onChange={(e) => setUrgentDeadlineAlerts(e.target.checked)}
                className="size-4 rounded accent-signal-blue"
              />
            </div>

            <div className="border-t border-navy-700 pt-3">
              <label className="font-semibold text-ink-100">
                High-Value Senior Review Escalation (INR)
              </label>
              <div className="text-[11px] text-ink-500 mb-2">
                Flag disputes above this transaction amount for senior compliance sign-off.
              </div>
              <input
                type="number"
                value={highValueThreshold}
                onChange={(e) => setHighValueThreshold(e.target.value)}
                className="w-full rounded-xl border border-navy-700 bg-navy-900 px-3 py-2 text-xs font-mono text-ink-100 outline-none focus:border-signal-blue"
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
