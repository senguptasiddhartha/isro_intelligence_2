import { useState } from "react";
import { BellRing, ShieldAlert, AlertTriangle, CheckCircle2, ShieldCheck, Check } from "lucide-react";
import { SpaceWeatherAlert, initialAlerts } from "../data";

interface AlertsPanelProps {
  alerts: SpaceWeatherAlert[];
  onAcknowledge: (id: string) => void;
  onAcknowledgeAll: () => void;
}

export default function AlertsPanel({ alerts, onAcknowledge, onAcknowledgeAll }: AlertsPanelProps) {
  const [filter, setFilter] = useState<"ALL" | "critical" | "warning" | "watch" | "normal">("ALL");

  const filteredAlerts = alerts.filter((alert) => {
    return filter === "ALL" || alert.severity === filter;
  });

  const getSeverityStyle = (severity: typeof filter) => {
    switch (severity) {
      case "critical":
        return {
          bg: "bg-red-50 border-red-200 text-[#DC2626]",
          icon: ShieldAlert,
          label: "CRITICAL HAZARD",
        };
      case "warning":
        return {
          bg: "bg-amber-50 border-amber-200 text-[#F57C00]",
          icon: AlertTriangle,
          label: "WARNING",
        };
      case "watch":
        return {
          bg: "bg-yellow-50 border-yellow-200 text-[#F59E0B]",
          icon: AlertTriangle,
          label: "WATCH",
        };
      default:
        return {
          bg: "bg-green-50 border-green-200 text-[#16A34A]",
          icon: CheckCircle2,
          label: "NORMAL / BRIEFING",
        };
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" id="alerts-panel">
      {/* Header and Bulk Actions */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-gray-400 font-mono uppercase tracking-wider">
            MISSION OPERATIONAL THREAT SHIELD
          </span>
          <h2 className="text-xl font-bold text-gray-900 mt-0.5">Smart Alerts &amp; Notification Logs</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Active warnings and telemetry threshold exceedance logs matching Aditya-L1 observations.
          </p>
        </div>

        <button
          onClick={onAcknowledgeAll}
          className="flex items-center justify-center space-x-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition shrink-0"
        >
          <Check className="h-4 w-4" />
          <span>Acknowledge All</span>
        </button>
      </div>

      {/* Filter and Stats Segment */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Filters */}
        <div className="md:col-span-1 bg-white border border-gray-200 p-4 rounded-xl shadow-sm h-fit space-y-2">
          <span className="text-[10px] font-bold text-gray-400 font-mono uppercase block mb-3">Severity Filters</span>
          {(["ALL", "critical", "warning", "watch", "normal"] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilter(lvl)}
              className={`w-full text-left rounded-lg px-3 py-2 text-xs font-semibold uppercase transition flex justify-between items-center ${
                filter === lvl
                  ? "bg-[#0057B8]/10 text-[#0057B8] font-bold"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span>{lvl === "ALL" ? "All Alerts" : lvl}</span>
              <span className="text-[10px] font-mono text-gray-400">
                ({lvl === "ALL" ? alerts.length : alerts.filter((a) => a.severity === lvl).length})
              </span>
            </button>
          ))}
        </div>

        {/* Alerts Stream List */}
        <div className="md:col-span-4 space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-xs text-gray-500">
              <ShieldCheck className="h-10 w-10 text-green-500 mx-auto mb-3" />
              <p className="font-mono font-bold uppercase text-gray-700">No warnings registered</p>
              <p className="mt-1 text-gray-400">All space weather sensors and telemetry grids are working nominally.</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const meta = getSeverityStyle(alert.severity);
              const SeverityIcon = meta.icon;

              return (
                <div
                  key={alert.id}
                  className={`rounded-xl border p-5 bg-white shadow-sm transition flex flex-col sm:flex-row gap-4 items-start ${
                    alert.acknowledged ? "opacity-60 border-gray-100" : "border-gray-200"
                  }`}
                >
                  {/* Badge & Icon Column */}
                  <div className={`rounded-lg p-2 ${meta.bg} border shrink-0`}>
                    <SeverityIcon className="h-5 w-5" />
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-gray-900 font-mono">{alert.id}</span>
                      <span className={`text-[9px] font-bold font-mono uppercase rounded px-2 py-0.5 border ${meta.bg}`}>
                        {meta.label}
                      </span>
                      <span className="text-[10px] font-mono text-gray-400">
                        {new Date(alert.timestamp).toISOString().replace("T", " ").substring(0, 16)} UTC
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-800 leading-snug">{alert.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{alert.message}</p>
                    <div className="flex items-center space-x-3 text-[10px] font-mono font-bold text-gray-400 pt-2">
                      <span>INSTRUMENT: {alert.instrument}</span>
                      <span>•</span>
                      <span>STATUS: {alert.acknowledged ? "ACKNOWLEDGED" : "ACTIVE MONITOR"}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  {!alert.acknowledged && (
                    <button
                      onClick={() => onAcknowledge(alert.id)}
                      className="rounded border border-gray-200 bg-white hover:bg-gray-50 px-3 py-1 text-[11px] font-semibold text-gray-700 transition shrink-0"
                    >
                      Acknowledge
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
