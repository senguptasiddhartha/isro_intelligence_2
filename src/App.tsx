import { useState, useEffect } from "react";
import { X, Bot, ShieldAlert, Cpu } from "lucide-react";
import { TabId, FlareEvent, SolarTelemetry, ForecastCardData, SystemStatusData } from "./types";
import {
  generateTelemetryData,
  initialFlareCatalogue,
  initialForecasts,
  defaultSystemStatus,
  initialAlerts,
  SpaceWeatherAlert,
} from "./data";

// Component imports
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import DashboardView from "./components/DashboardView";
import MonitoringView from "./components/MonitoringView";
import NowcastingView from "./components/NowcastingView";
import ForecastingView from "./components/ForecastingView";
import CatalogueView from "./components/CatalogueView";
import HistoricalView from "./components/HistoricalView";
import AssistantView from "./components/AssistantView";
import MissionBriefView from "./components/MissionBriefView";
import AlertsPanel from "./components/AlertsPanel";
import SystemHealthView from "./components/SystemHealthView";
import AnalyticsView from "./components/AnalyticsView";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [editableAppName, setEditableAppName] = useState("Aditya-L1 Space Weather Monitoring Centre");
  const [telemetry, setTelemetry] = useState<SolarTelemetry[]>([]);
  const [catalog, setCatalog] = useState<FlareEvent[]>(initialFlareCatalogue);
  const [alerts, setAlerts] = useState<SpaceWeatherAlert[]>(initialAlerts);
  const [systemStatus, setSystemStatus] = useState<SystemStatusData>(defaultSystemStatus);

  // Explanation Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");

  // Populate initial simulated telemetry on mount
  useEffect(() => {
    setTelemetry(generateTelemetryData());
  }, []);

  // Set up a tiny background interval to simulate gradual real-time data ticks every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry((prev) => {
        if (prev.length === 0) return prev;
        const last = prev[prev.length - 1];
        const nextTime = new Date();
        const timeStr = nextTime.toISOString().substring(11, 16) + " UTC";
        
        // Minor sinusoidal baseline fluctuations
        const fluctuation = (Math.random() - 0.5) * 1.5e-7;
        const nextSoft = Math.max(1e-8, last.softXrayFlux + fluctuation);
        const nextHard = Math.max(1e-9, last.hardXrayFlux + (Math.random() - 0.5) * 4e-9);

        const newPoint: SolarTelemetry = {
          timestamp: timeStr,
          softXrayFlux: parseFloat(nextSoft.toExponential(4)),
          hardXrayFlux: parseFloat(nextHard.toExponential(4)),
          activeRegionTemp: parseFloat((8.5 + (nextSoft * 2e5)).toFixed(2)),
          detectorTemp: parseFloat((18.0 + (Math.random() - 0.5) * 0.1).toFixed(2)),
          gtiStatus: 1.0,
        };

        // Maintain size constraint of 100 entries
        const updated = [...prev.slice(1), newPoint];
        return updated;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const openExplainModal = (title: string, content: string) => {
    setModalTitle(title);
    setModalContent(content);
    setModalOpen(true);
  };

  const handleAcknowledgeAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === id ? { ...alert, acknowledged: true } : alert))
    );
  };

  const handleAcknowledgeAllAlerts = () => {
    setAlerts((prev) => prev.map((alert) => ({ ...alert, acknowledged: true })));
  };

  const unreadAlertsCount = alerts.filter((a) => !a.acknowledged).length;

  // Tab rendering router
  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardView
            telemetry={telemetry}
            catalog={catalog}
            forecasts={initialForecasts}
            onNavigate={(tab) => setActiveTab(tab)}
            openExplainModal={openExplainModal}
          />
        );
      case "monitoring":
        return <MonitoringView telemetry={telemetry} openExplainModal={openExplainModal} />;
      case "nowcasting":
        return <NowcastingView catalog={catalog} openExplainModal={openExplainModal} />;
      case "forecasting":
        return <ForecastingView forecasts={initialForecasts} openExplainModal={openExplainModal} />;
      case "catalogue":
        return <CatalogueView catalog={catalog} openExplainModal={openExplainModal} />;
      case "historical":
        return <HistoricalView />;
      case "assistant":
        return <AssistantView />;
      case "brief":
        return <MissionBriefView />;
      case "alerts":
        return (
          <AlertsPanel
            alerts={alerts}
            onAcknowledge={handleAcknowledgeAlert}
            onAcknowledgeAll={handleAcknowledgeAllAlerts}
          />
        );
      case "health":
        return <SystemHealthView status={systemStatus} />;
      case "analytics":
        return <AnalyticsView openExplainModal={openExplainModal} />;
      default:
        return (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
            Feature view is undergoing calibration checks.
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col bg-white text-gray-800 antialiased overflow-hidden select-none" id="main-container">
      {/* Top Header */}
      <Header
        editableAppName={editableAppName}
        setEditableAppName={setEditableAppName}
        unreadCount={unreadAlertsCount}
        onAlertClick={() => setActiveTab("alerts")}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} unreadAlerts={unreadAlertsCount} />

        {/* Main Content Pane */}
        <main className="flex-1 overflow-y-auto bg-[#F7F9FC] p-8 print:bg-white print:p-0">
          <div className="mx-auto max-w-7xl">{renderTabContent()}</div>
        </main>
      </div>

      {/* Unified Explain/Help Dialog (Modal) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4 animate-fade-in" id="explain-modal">
          <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
              title="Close Panel"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-2 border-b border-gray-100 pb-3 mb-4">
              <Bot className="h-5 w-5 text-[#0057B8]" />
              <h3 className="text-sm font-bold text-gray-900 font-mono uppercase tracking-wider">{modalTitle}</h3>
            </div>

            <div className="text-xs leading-relaxed text-gray-600 whitespace-pre-line space-y-2">
              {modalContent}
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg bg-gray-100 hover:bg-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 transition"
              >
                Close Explanation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
