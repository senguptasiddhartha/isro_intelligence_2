import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Info, Maximize2, Sparkles, Filter, RefreshCw } from "lucide-react";
import { SolarTelemetry } from "../types";

interface MonitoringViewProps {
  telemetry: SolarTelemetry[];
  openExplainModal: (title: string, content: string) => void;
}

export default function MonitoringView({ telemetry, openExplainModal }: MonitoringViewProps) {
  const [timeRange, setTimeRange] = useState<"1h" | "3h" | "6h" | "12h">("6h");

  // Filter telemetry according to selection
  let pointsToShow = 50;
  if (timeRange === "1h") pointsToShow = 12;
  if (timeRange === "3h") pointsToShow = 36;
  if (timeRange === "6h") pointsToShow = 72;
  if (timeRange === "12h") pointsToShow = 100;

  const chartData = telemetry.slice(-pointsToShow);
  const latestPoint = telemetry[telemetry.length - 1] || {
    softXrayFlux: 1.45e-6,
    hardXrayFlux: 4.2e-8,
    activeRegionTemp: 8.5,
    detectorTemp: 18.2,
    gtiStatus: 1.0,
    timestamp: "23:15 UTC",
  };

  // Explanation blocks
  const softXrayExplanation = `
    SoLEXS measures soft X-rays in the 1.0 to 22.0 keV range. 
    Its primary purpose is to capture thermal emissions of plasma trapped in active region magnetic loops. 
    The background levels map directly to solar flare classifications:
    - A (<1.0e-8), B (1e-8 to 1e-7), C (1e-7 to 1e-6), M (1e-6 to 1e-5), and X (>1e-5) Watts/m².
    Sudden, exponential increases in Soft X-ray emission indicate magnetic reconnection and rapid plasma heating.
  `;

  const hardXrayExplanation = `
    HEL1OS measures hard X-rays in the 10.0 to 150.0 keV range.
    These observations capture non-thermal bremsstrahlung emissions produced by high-energy electron beams 
    impacting the dense lower solar atmosphere (chromosphere).
    Unlike Soft X-rays, Hard X-ray profiles are highly impulsive, spiking in short, rapid bursts. 
    Analyzing the hard X-ray spectrum allows scientists to map electron acceleration mechanisms during magnetic reconnection.
  `;

  return (
    <div className="space-y-6 animate-fade-in" id="monitoring-view">
      {/* Controls & Metrics Strip */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-4">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider font-mono">Time Range Selector</span>
          <div className="flex bg-[#F7F9FC] border border-[#E5E7EB] rounded-lg p-0.5">
            {(["1h", "3h", "6h", "12h"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                  timeRange === r
                    ? "bg-white text-[#0057B8] shadow-sm border border-gray-100"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {r === "1h" ? "Last 1 Hour" : r === "3h" ? "Last 3 Hours" : r === "6h" ? "Last 6 Hours" : "Last 12 Hours"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-gray-700">SoLEXS Detector:</span>
            <span className="font-mono text-green-600 font-bold uppercase">18.1°C (Nominal)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-gray-700">HEL1OS CZT Sensor:</span>
            <span className="font-mono text-green-600 font-bold uppercase">18.4°C (Nominal)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-gray-700">GTI Quality:</span>
            <span className="font-mono text-[#0057B8] font-bold">100.0% (Excellent)</span>
          </div>
        </div>
      </div>

      {/* Soft X-ray Spectrometer (SoLEXS) */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-[#0057B8]"></span>
              <h3 className="text-base font-bold text-gray-900">
                SoLEXS Spectrometer — Soft X-Ray Flux Light Curve (1.0 - 22 keV)
              </h3>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Thermal coronal emissions tracking active region plasma heating indices.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => openExplainModal("SoLEXS Soft X-Ray Physics", softXrayExplanation)}
              className="flex items-center space-x-1.5 rounded-lg border border-gray-200 bg-[#F7F9FC] px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
            >
              <Info className="h-3.5 w-3.5 text-gray-400" />
              <span>Spectral Info</span>
            </button>
            <span className="font-mono text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded">
              Current: {latestPoint.softXrayFlux.toExponential(4)} W/m²
            </span>
          </div>
        </div>

        {/* GOES Class helper line legends */}
        <div className="flex flex-wrap gap-4 text-[10px] font-mono font-bold mb-4 text-gray-500">
          <span className="flex items-center space-x-1">
            <span className="inline-block w-3 h-0.5 border-t-2 border-red-500 border-dashed"></span>
            <span>X-Class Boundary (&gt; 10⁻⁵ W/m²)</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="inline-block w-3 h-0.5 border-t-2 border-amber-500 border-dashed"></span>
            <span>M-Class Boundary (&gt; 10⁻⁶ W/m²)</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="inline-block w-3 h-0.5 border-t-2 border-yellow-500 border-dashed"></span>
            <span>C-Class Boundary (&gt; 10⁻⁷ W/m²)</span>
          </span>
        </div>

        {/* Real-time Line Chart */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F3F5" />
              <XAxis dataKey="timestamp" stroke="#9CA3AF" fontSize={10} fontStyle="mono" />
              <YAxis
                scale="log"
                domain={[1e-8, 1e-4]}
                type="number"
                stroke="#9CA3AF"
                fontSize={10}
                fontStyle="mono"
                tickFormatter={(val) => val.toExponential(0)}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as SolarTelemetry;
                    return (
                      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg text-xs font-mono">
                        <p className="font-bold text-gray-900 border-b border-gray-100 pb-1 mb-1.5">
                          {data.timestamp}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-semibold text-gray-800">Soft X-Ray Flux:</span>{" "}
                          {data.softXrayFlux.toExponential(4)} W/m²
                        </p>
                        <p className="text-gray-600">
                          <span className="font-semibold text-gray-800">Equivalent Class:</span>{" "}
                          {data.softXrayFlux >= 1e-5 ? "X-Class" : data.softXrayFlux >= 1e-6 ? "M-Class" : "C-Class"}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {/* GOES thresholds boundaries */}
              <ReferenceLine y={1e-5} stroke="#DC2626" strokeDasharray="4 4" strokeWidth={1} label={{ value: "X-Class Threshold", position: "insideTopRight", fill: "#DC2626", fontSize: 9, fontStyle: "mono", fontWeight: "bold" }} />
              <ReferenceLine y={1e-6} stroke="#F59E0B" strokeDasharray="4 4" strokeWidth={1} label={{ value: "M-Class Threshold", position: "insideTopRight", fill: "#F59E0B", fontSize: 9, fontStyle: "mono", fontWeight: "bold" }} />
              <ReferenceLine y={1e-7} stroke="#EAB308" strokeDasharray="4 4" strokeWidth={1} label={{ value: "C-Class Threshold", position: "insideTopRight", fill: "#EAB308", fontSize: 9, fontStyle: "mono", fontWeight: "bold" }} />
              
              <Line
                type="monotone"
                dataKey="softXrayFlux"
                stroke="#0057B8"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hard X-ray Spectrometer (HEL1OS) */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-[#F57C00]"></span>
              <h3 className="text-base font-bold text-gray-900">
                HEL1OS Spectrometer — Hard X-Ray Flux Light Curve (10 - 150 keV)
              </h3>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Impulsive electron acceleration spikes tracking high-energy magnetic reconnection.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => openExplainModal("HEL1OS Hard X-Ray Physics", hardXrayExplanation)}
              className="flex items-center space-x-1.5 rounded-lg border border-gray-200 bg-[#F7F9FC] px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
            >
              <Info className="h-3.5 w-3.5 text-gray-400" />
              <span>Spectral Info</span>
            </button>
            <span className="font-mono text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded">
              Current: {latestPoint.hardXrayFlux.toExponential(4)} W/m²
            </span>
          </div>
        </div>

        {/* Real-time Line Chart */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F3F5" />
              <XAxis dataKey="timestamp" stroke="#9CA3AF" fontSize={10} fontStyle="mono" />
              <YAxis
                scale="linear"
                type="number"
                stroke="#9CA3AF"
                fontSize={10}
                fontStyle="mono"
                tickFormatter={(val) => val.toExponential(0)}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as SolarTelemetry;
                    return (
                      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg text-xs font-mono">
                        <p className="font-bold text-gray-900 border-b border-gray-100 pb-1 mb-1.5">
                          {data.timestamp}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-semibold text-[#F57C00]">Hard X-Ray Flux:</span>{" "}
                          {data.hardXrayFlux.toExponential(4)} W/m²
                        </p>
                        <p className="text-gray-600">
                          <span className="font-semibold text-gray-800">Non-Thermal Activity:</span>{" "}
                          {data.hardXrayFlux > 5e-7 ? "HIGH / IMPULSIVE SPARK" : "LOW / STEADY"}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="hardXrayFlux"
                stroke="#F57C00"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
