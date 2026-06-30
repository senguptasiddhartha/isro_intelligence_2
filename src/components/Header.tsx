import { useState, useEffect } from "react";
import { Compass, Cpu, Bell, Radio, User, Edit2, Check } from "lucide-react";

interface HeaderProps {
  editableAppName: string;
  setEditableAppName: (name: string) => void;
  unreadCount: number;
  onAlertClick: () => void;
}

export default function Header({
  editableAppName,
  setEditableAppName,
  unreadCount,
  onAlertClick,
}: HeaderProps) {
  const [utcTime, setUtcTime] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(editableAppName);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toISOString().replace("T", " ").substring(0, 19) + " UTC");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSave = () => {
    if (tempName.trim()) {
      setEditableAppName(tempName);
    }
    setIsEditing(false);
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm" id="top-navbar">
      {/* Left: Mission Logo & Brand */}
      <div className="flex items-center space-x-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0057B8] text-white">
          <Compass className="h-6 w-6 animate-spin-slow" />
        </div>
        
        {/* Editable Application Name */}
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <div className="flex items-center space-x-1">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="rounded border border-[#0057B8] px-2 py-0.5 text-lg font-bold text-gray-800 focus:outline-none"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                  if (e.key === "Escape") {
                    setTempName(editableAppName);
                    setIsEditing(false);
                  }
                }}
              />
              <button
                onClick={handleSave}
                className="rounded bg-[#0057B8] p-1 text-white hover:bg-opacity-90"
                title="Save Name"
              >
                <Check className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-gray-900">
                {editableAppName}
              </h1>
              <button
                onClick={() => setIsEditing(true)}
                className="text-gray-400 hover:text-[#0057B8]"
                title="Edit Product Name"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            </div>
          )}
          <span className="hidden rounded-full bg-[#F7F9FC] border border-[#E5E7EB] px-2 py-0.5 text-[10px] font-mono font-semibold text-gray-500 sm:inline-block">
            ADITYA-L1 MISSION CONTROL
          </span>
        </div>
      </div>

      {/* Right: Operational Status, Realtime UTC, Notifications, and Profile */}
      <div className="flex items-center space-x-6">
        {/* Real-time UTC clock */}
        <div className="hidden items-center space-x-2 border-r border-gray-200 pr-6 md:flex">
          <Cpu className="h-4 w-4 text-gray-400" />
          <span className="font-mono text-sm font-semibold text-gray-700">{utcTime}</span>
        </div>

        {/* Spacecraft Link Status */}
        <div className="flex items-center space-x-2 rounded-full bg-[#EAF7ED] px-3 py-1 text-xs font-semibold text-[#16A34A] border border-[#C6ECD2]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#16A34A] opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#16A34A]"></span>
          </span>
          <Radio className="h-3 w-3 inline-block" />
          <span className="font-mono tracking-tight">ISTRAC LINK: LOCKED</span>
        </div>

        {/* Notifications Icon with Badge */}
        <button
          onClick={onAlertClick}
          className="relative rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition"
          id="notif-btn"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#DC2626] text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User profile */}
        <div className="flex items-center space-x-3 border-l border-gray-200 pl-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F57C00] text-white font-bold text-sm">
            IO
          </div>
          <div className="hidden flex-col items-start leading-none md:flex">
            <span className="text-xs font-semibold text-gray-800">ISRO Operator</span>
            <span className="text-[10px] font-medium text-[#0057B8] tracking-wider uppercase font-mono">ISRO OPERATOR</span>
          </div>
        </div>
      </div>
    </header>
  );
}
