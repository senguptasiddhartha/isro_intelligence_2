import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { History, BarChart2, PieChart as PieIcon, Flame, Sliders } from "lucide-react";

export default function HistoricalView() {
  const [selectedCycle, setSelectedCycle] = useState("Cycle 25");

  // Monthly Flare Counts for current year (2026)
  const monthlyData = [
    { month: "Jan", C: 42, M: 12, X: 1 },
    { month: "Feb", C: 38, M: 15, X: 2 },
    { month: "Mar", C: 48, M: 18, X: 4 },
    { month: "Apr", C: 52, M: 22, X: 3 },
    { month: "May", C: 61, M: 28, X: 6 },
    { month: "Jun", C: 70, M: 34, X: 8 },
  ];

  // Flare Class Distribution for current year
  const pieData = [
    { name: "C-Class", value: 311, color: "#EAB308" },
    { name: "M-Class", value: 129, color: "#F57C00" },
    { name: "X-Class", value: 24, color: "#DC2626" },
  ];

  // Solar Cycle 25 Climb Trend (2021 - 2026)
  const cycleTrendData = [
    { year: "2021", flares: 142, sunspots: 35 },
    { year: "2022", flares: 284, sunspots: 82 },
    { year: "2023", flares: 512, sunspots: 125 },
    { year: "2024", flares: 730, sunspots: 160 },
    { year: "2025", flares: 890, sunspots: 185 },
    { year: "2026 (YTD)", flares: 984, sunspots: 210 },
  ];

  return (
    <div className="space-y-6 animate-fade-in" id="historical-view">
      {/* Page Title */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-gray-400 font-mono uppercase tracking-wider">
            LONG-TERM OBSERVATIONAL TRENDS
          </span>
          <h2 className="text-xl font-bold text-gray-900 mt-0.5">Historical Solar Flare Analysis</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Climb profile of Solar Cycle 25 and spectral distributions observed across Aditya-L1 missions.
          </p>
        </div>

        <div className="flex bg-[#F7F9FC] border border-[#E5E7EB] rounded-lg p-0.5 text-xs font-mono">
          <button
            onClick={() => setSelectedCycle("Cycle 25")}
            className={`px-3 py-1.5 font-semibold rounded-md transition ${
              selectedCycle === "Cycle 25" ? "bg-white text-[#0057B8] shadow-sm border" : "text-gray-500"
            }`}
          >
            Solar Cycle 25 (Active)
          </button>
          <button
            onClick={() => setSelectedCycle("Cycle 24")}
            className={`px-3 py-1.5 font-semibold rounded-md transition ${
              selectedCycle === "Cycle 24" ? "bg-white text-[#0057B8] shadow-sm border" : "text-gray-500"
            }`}
          >
            Solar Cycle 24 (Archived)
          </button>
        </div>
      </div>

      {/* Main Historical Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Distribution Block */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider font-mono mb-6">
            Monthly Solar Flare Intensity Distribution (2026 YTD)
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F3F5" />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={10} fontStyle="mono" />
                <YAxis stroke="#9CA3AF" fontSize={10} fontStyle="mono" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg text-xs font-mono">
                          <p className="font-bold text-gray-900 border-b pb-1 mb-1.5">{data.month} 2026</p>
                          <p className="text-yellow-600">C-Class: {data.C}</p>
                          <p className="text-[#F57C00]">M-Class: {data.M}</p>
                          <p className="text-[#DC2626]">X-Class: {data.X}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="C" stackId="a" fill="#EAB308" radius={[0, 0, 0, 0]} />
                <Bar dataKey="M" stackId="a" fill="#F57C00" radius={[0, 0, 0, 0]} />
                <Bar dataKey="X" stackId="a" fill="#DC2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Flare Class Share Pie Chart */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider font-mono mb-4">
              Flare Class Proportions (YTD)
            </h3>
            <p className="text-xs text-gray-500 leading-normal">
              Breakdown of total solar eruptions classified by the Aditya-L1 algorithm over the ongoing tracking season.
            </p>
          </div>

          <div className="h-44 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Total flare count absolute centering overlay */}
            <div className="absolute text-center">
              <span className="block text-2xl font-extrabold font-mono text-gray-900">464</span>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider font-mono">Total Flares</span>
            </div>
          </div>

          {/* Color Indicators Legend */}
          <div className="space-y-2 border-t border-gray-100 pt-4">
            {pieData.map((entry) => (
              <div key={entry.name} className="flex justify-between items-center text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></span>
                  <span className="text-gray-600 font-medium">{entry.name}</span>
                </div>
                <span className="font-mono font-bold text-gray-800">{entry.value} events</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Solar Cycle 25 Climb Trend Area Chart */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider font-mono mb-6">
          Solar Cycle 25 Solar Flare &amp; Sunspot Progression (2021 - 2026 Climb Profile)
        </h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cycleTrendData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="colorFlares" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0057B8" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#0057B8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F3F5" />
              <XAxis dataKey="year" stroke="#9CA3AF" fontSize={10} fontStyle="mono" />
              <YAxis stroke="#9CA3AF" fontSize={10} fontStyle="mono" />
              <Tooltip />
              <Area type="monotone" dataKey="flares" stroke="#0057B8" fillOpacity={1} fill="url(#colorFlares)" strokeWidth={2.5} name="Annual Flares Observed" />
              <Area type="monotone" dataKey="sunspots" stroke="#F57C00" fillOpacity={0} strokeWidth={2} name="Average Sunspot Number (RI)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
