import {
  LayoutDashboard,
  Activity,
  Zap,
  TrendingUp,
  Table,
  History,
  Bot,
  ClipboardList,
  HeartPulse,
  BarChart3,
  BellRing,
  Settings,
  HelpCircle,
} from "lucide-react";
import { TabId } from "../types";

interface SidebarProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  unreadAlerts: number;
}

export default function Sidebar({ activeTab, setActiveTab, unreadAlerts }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, section: "Overview" },
    { id: "monitoring", label: "Live Monitoring", icon: Activity, section: "Observations" },
    { id: "nowcasting", label: "Nowcasting", icon: Zap, section: "Observations" },
    { id: "forecasting", label: "Forecasting", icon: TrendingUp, section: "Forecasting" },
    { id: "catalogue", label: "Master Flare Catalogue", icon: Table, section: "Data & Records" },
    { id: "historical", label: "Historical Analysis", icon: History, section: "Data & Records" },
    { id: "assistant", label: "AI Research Assistant", icon: Bot, section: "AI Engines" },
    { id: "brief", label: "Mission Brief", icon: ClipboardList, section: "AI Engines" },
    { id: "alerts", label: "Smart Alerts", icon: BellRing, section: "Operations", badge: unreadAlerts },
    { id: "health", label: "System Health", icon: HeartPulse, section: "Operations" },
    { id: "analytics", label: "Analytics", icon: BarChart3, section: "Operations" },
  ];

  // Group items by sections
  const sections = ["Overview", "Observations", "Forecasting", "Data & Records", "AI Engines", "Operations"];

  return (
    <aside className="w-64 border-r border-gray-200 bg-white flex flex-col h-[calc(100vh-4rem)] select-none shrink-0" id="left-sidebar">
      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {sections.map((section) => {
          const items = menuItems.filter((item) => item.section === section);
          return (
            <div key={section} className="space-y-1">
              <h3 className="text-[10px] font-bold tracking-wider text-gray-400 uppercase px-3 mb-2 font-mono">
                {section}
              </h3>
              <nav className="space-y-0.5">
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as TabId)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition duration-150 ${
                        isActive
                          ? "bg-[#0057B8]/10 text-[#0057B8] border-l-4 border-[#0057B8] rounded-l-none pl-2.5"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                      id={`nav-${item.id}`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`h-4 w-4 ${isActive ? "text-[#0057B8]" : "text-gray-400 group-hover:text-gray-500"}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="flex h-5 items-center justify-center rounded-full bg-[#DC2626] px-1.5 text-[10px] font-bold text-white font-mono">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          );
        })}
      </div>

      {/* Sidebar Footer with static mission guidelines */}
      <div className="border-t border-gray-200 bg-[#F7F9FC] p-4 text-xs">
        <div className="flex items-center justify-between text-gray-500 mb-1">
          <span className="font-semibold text-gray-700">Spacecraft Status</span>
          <span className="font-mono text-[10px] text-green-600 font-bold uppercase">L1 Halo Orbit</span>
        </div>
        <p className="text-[10px] text-gray-500 font-mono leading-relaxed leading-3">
          Aditya-L1 Spacecraft altitude: ~1.5 million km from Earth. Payloads locked in anti-solar alignment.
        </p>
      </div>
    </aside>
  );
}
