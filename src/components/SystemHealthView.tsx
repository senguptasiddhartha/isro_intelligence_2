import { HeartPulse, CheckCircle, AlertTriangle, ShieldCheck, Cpu, HardDrive, Network, Globe } from "lucide-react";
import { SystemStatusData } from "../types";

interface SystemHealthViewProps {
  status: SystemStatusData;
}

export default function SystemHealthView({ status }: SystemHealthViewProps) {
  const subsystems = [
    { name: "SoLEXS Spectrum Ingestion Engine", status: "Nominal", latency: "14ms", details: "Processing 5-second cadence Soft X-ray packets" },
    { name: "HEL1OS CdTe Micro-pixel Array Array", status: "Nominal", latency: "18ms", details: "Observing high-energy CZT pixels 10-150 keV" },
    { name: "Spacecraft High-gain S-Band Antenna Core", status: "Nominal", latency: "110ms", details: "ISTRAC deep space station downlink locked" },
    { name: "Deep Neural Network Forecasting Server", status: "Nominal", latency: "24ms", details: "XAI prediction weights updated at 1h intervals" },
    { name: "Space Weather Emergency Alert Pipeline", status: "Nominal", latency: "4ms", details: "Broadcasting emergency notifications to ISRO grid" },
  ];

  return (
    <div className="space-y-6 animate-fade-in" id="system-health-view">
      {/* Title Header */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-gray-400 font-mono uppercase tracking-wider">
            MISSION HARDWARE &amp; PIPELINES
          </span>
          <h2 className="text-xl font-bold text-gray-900 mt-0.5">System Health &amp; Telemetry Status</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Spacecraft downlink locks, spectrometer temperatures, and machine learning pipeline integrity.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-green-600 bg-[#EAF7ED] px-3 py-1.5 rounded-full font-bold border border-[#C6ECD2] font-mono">
          <ShieldCheck className="h-4 w-4 animate-pulse" />
          <span>MISSION STATUS: NOMINAL</span>
        </div>
      </div>

      {/* Grid of Key Telemetry Indicators */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {/* Metric 1 */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-400 uppercase font-mono">SoLEXS Detector</span>
            <span className="inline-block h-2 w-2 rounded-full bg-[#16A34A]"></span>
          </div>
          <p className="text-2xl font-extrabold text-gray-900 uppercase font-mono">{status.solexsStatus}</p>
          <span className="block text-[10px] text-gray-400">1.0-22.0 keV Silicon Drift</span>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-400 uppercase font-mono">HEL1OS CZT Array</span>
            <span className="inline-block h-2 w-2 rounded-full bg-[#16A34A]"></span>
          </div>
          <p className="text-2xl font-extrabold text-gray-900 uppercase font-mono">{status.hel1osStatus}</p>
          <span className="block text-[10px] text-gray-400">10.0-150.0 keV CZT Pixels</span>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-400 uppercase font-mono">GTI Packet Coverage</span>
            <span className="inline-block h-2 w-2 rounded-full bg-[#0057B8]"></span>
          </div>
          <p className="text-2xl font-extrabold text-gray-900 font-mono">{(status.gtiQuality * 100).toFixed(1)}%</p>
          <span className="block text-[10px] text-gray-400">Occultation package index</span>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-400 uppercase font-mono">Pipeline Ingestion Latency</span>
            <span className="inline-block h-2 w-2 rounded-full bg-[#0057B8]"></span>
          </div>
          <p className="text-2xl font-extrabold text-gray-900 font-mono">{status.pipelineLatencyMs} ms</p>
          <span className="block text-[10px] text-gray-400">L1-to-Ground ingestion time</span>
        </div>
      </div>

      {/* Pipeline Visual Flow Representation */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider font-mono mb-6">
          Real-Time Observational Data Flow Pipeline
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 text-center text-xs relative">
          {/* Step 1 */}
          <div className="bg-[#F7F9FC] border border-gray-100 rounded-xl p-4 flex flex-col items-center space-y-2">
            <Globe className="h-6 w-6 text-[#0057B8]" />
            <h4 className="font-bold text-gray-800">1. Spacecraft Transmit</h4>
            <p className="text-[10px] text-gray-500 leading-normal">Aditya-L1 streams S-Band telemetry to Deep Space network.</p>
            <span className="text-[9px] font-mono text-green-600 font-bold uppercase bg-green-50 px-2 rounded">Downlink Locked</span>
          </div>

          {/* Step 2 */}
          <div className="bg-[#F7F9FC] border border-gray-100 rounded-xl p-4 flex flex-col items-center space-y-2">
            <HardDrive className="h-6 w-6 text-[#0057B8]" />
            <h4 className="font-bold text-gray-800">2. Ingest &amp; Decrypt</h4>
            <p className="text-[10px] text-gray-500 leading-normal">ISTRAC decodes raw hex packets, computing GTI alignment index.</p>
            <span className="text-[9px] font-mono text-green-600 font-bold uppercase bg-green-50 px-2 rounded">Error Rate &lt; 0.01%</span>
          </div>

          {/* Step 3 */}
          <div className="bg-[#F7F9FC] border border-gray-100 rounded-xl p-4 flex flex-col items-center space-y-2">
            <Cpu className="h-6 w-6 text-[#0057B8]" />
            <h4 className="font-bold text-gray-800">3. Neural Forecast</h4>
            <p className="text-[10px] text-gray-500 leading-normal">Aditya-L1 AI models compute rise slope and predict flare classes.</p>
            <span className="text-[9px] font-mono text-green-600 font-bold uppercase bg-green-50 px-2 rounded">Precision: 94.6%</span>
          </div>

          {/* Step 4 */}
          <div className="bg-[#F7F9FC] border border-gray-100 rounded-xl p-4 flex flex-col items-center space-y-2">
            <Network className="h-6 w-6 text-[#0057B8]" />
            <h4 className="font-bold text-gray-800">4. Disseminate</h4>
            <p className="text-[10px] text-gray-500 leading-normal">Operational dashboards publish nowcasts and alerts to global grids.</p>
            <span className="text-[9px] font-mono text-green-600 font-bold uppercase bg-green-50 px-2 rounded">API Stream Active</span>
          </div>
        </div>
      </div>

      {/* Subsystems Detailed Checklist Table */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider font-mono p-5 border-b border-gray-100 bg-[#F7F9FC]">
          Subsystem Status Checklist
        </h3>
        
        <table className="w-full text-left text-xs text-gray-700">
          <thead>
            <tr className="bg-gray-50 text-gray-500 uppercase tracking-wider font-mono font-bold border-b border-gray-100">
              <th className="py-3 px-6">Subsystem Ingestion Pipeline</th>
              <th className="py-3 px-6">Telemetry Status</th>
              <th className="py-3 px-6">Local Processing Latency</th>
              <th className="py-3 px-6">Active Task Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium">
            {subsystems.map((sub, idx) => (
              <tr key={idx} className="hover:bg-gray-50/50">
                <td className="py-3.5 px-6 font-bold text-gray-900">{sub.name}</td>
                <td className="py-3.5 px-6">
                  <span className="inline-flex items-center space-x-1 bg-[#EAF7ED] text-[#16A34A] border border-[#C6ECD2] rounded px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase">
                    <CheckCircle className="h-3 w-3" />
                    <span>{sub.status}</span>
                  </span>
                </td>
                <td className="py-3.5 px-6 font-mono text-gray-500">{sub.latency}</td>
                <td className="py-3.5 px-6 text-gray-500 leading-normal">{sub.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
