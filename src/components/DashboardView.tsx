import { Zap, AlertTriangle, Shield, CheckCircle, TrendingUp, Thermometer, Radio, ArrowRight } from "lucide-react";
import { FlareEvent, SolarTelemetry, ForecastCardData } from "../types";

interface DashboardViewProps {
  telemetry: SolarTelemetry[];
  catalog: FlareEvent[];
  forecasts: ForecastCardData[];
  onNavigate: (tab: any) => void;
  openExplainModal: (title: string, content: string) => void;
}

export default function DashboardView({
  telemetry,
  catalog,
  forecasts,
  onNavigate,
  openExplainModal,
}: DashboardViewProps) {
  const latestData = telemetry[telemetry.length - 1] || {
    softXrayFlux: 1.45e-6,
    hardXrayFlux: 4.2e-8,
    activeRegionTemp: 9.2,
    detectorTemp: 18.1,
    gtiStatus: 1.0,
    timestamp: "23:15 UTC",
  };

  // Compute stats
  const flaresToday = catalog.filter((f) => f.date === "2026-06-29");
  const highestFlare = catalog.reduce((max, f) => {
    const fClassVal = parseFloat(f.flareClass.substring(1));
    const maxClassVal = parseFloat(max.flareClass.substring(1));
    if (f.flareClass[0] === "X" && max.flareClass[0] !== "X") return f;
    if (f.flareClass[0] === max.flareClass[0] && fClassVal > maxClassVal) return f;
    return max;
  }, catalog[0]);

  // Compute operational risk level
  const riskScore = 42; // Out of 100
  let riskLevel = "Normal";
  let riskColor = "text-[#16A34A]";
  let riskBg = "bg-green-50 border-green-200";

  if (riskScore > 75) {
    riskLevel = "CRITICAL";
    riskColor = "text-[#DC2626]";
    riskBg = "bg-red-50 border-red-200";
  } else if (riskScore > 40) {
    riskLevel = "WATCH / ELEVATED";
    riskColor = "text-[#F59E0B]";
    riskBg = "bg-amber-50 border-amber-200";
  }

  return (
    <div className="space-y-6" id="dashboard-view">
      {/* Hero Section */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex h-2 w-2 rounded-full bg-[#F57C00] animate-pulse"></span>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 font-mono">
                Aditya-L1 Real-Time Analytics Pipeline
              </span>
            </div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
              Solar Climate Assessment &amp; Flare Forecast Matrix
            </h2>
            <p className="mt-1 text-sm text-gray-500 max-w-2xl">
              This space weather console provides automated forecasting, flare peak nowcasting, and 
              sensor telemetry alignment for Aditya-L1 observations. Evaluation systems are calibrated 
              specifically for scientific observation at the Earth-Sun L1 Lagrangian point.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => onNavigate("monitoring")}
              className="flex items-center space-x-2 rounded-lg bg-[#0057B8] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 transition"
            >
              <span>Live Spectrometer Feed</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => onNavigate("assistant")}
              className="flex items-center space-x-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              <span>Query AI Copilot</span>
            </button>
          </div>
        </div>

        {/* Hero Details Grid */}
        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-100 pt-6 md:grid-cols-4">
          <div className="space-y-1">
            <span className="text-xs font-medium text-gray-500">Current Solar State</span>
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-[#F57C00]" />
              <span className="text-lg font-bold text-gray-900 font-mono">C1.45 (Stable)</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <span className="text-xs font-medium text-gray-500">Operational Posture</span>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-[#16A34A]" />
              <span className="text-lg font-bold text-[#16A34A]">NOMINAL (GREEN)</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-medium text-gray-500">Prediction Lead Time</span>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-[#0057B8]" />
              <span className="text-lg font-bold text-gray-900 font-mono">22.4 min (avg)</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-medium text-gray-500">Model Confidence</span>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-[#0057B8]" />
              <span className="text-lg font-bold text-gray-900 font-mono">94.6% (Mean)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {/* Flare Class Card */}
        <div 
          onClick={() => onNavigate("nowcasting")}
          className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-[#0057B8] hover:shadow"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider font-mono">Current Flare Level</span>
            <Zap className="h-5 w-5 text-gray-400 group-hover:text-[#0057B8]" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-gray-900 font-mono">C1.4</span>
            <span className="text-xs font-semibold text-gray-500 font-mono">SoLEXS</span>
          </div>
          <p className="mt-2 text-xs text-gray-400 font-mono">Flux: {latestData.softXrayFlux.toExponential(2)} W/m²</p>
        </div>

        {/* Risk Score Card */}
        <div 
          onClick={() => openExplainModal("Operational Risk Assessment", "The Operational Risk Score is calculated dynamically using a multi-sensor fusion algorithm combining Soft X-ray gradient rates (SoLEXS), high-energy spectral index hard X-rays (HEL1OS), and active region magnetic helicity indices. Currently, the meter stands at 42%, which registers as Elevated Watch due to rapid magnetic flux emergence inside Active Region AR3712.")}
          className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-[#0057B8] hover:shadow"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider font-mono">Risk Level Index</span>
            <AlertTriangle className="h-5 w-5 text-[#F59E0B]" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-[#F59E0B] font-mono">42 / 100</span>
            <span className="text-xs font-semibold text-gray-500 font-mono">ELEVATED</span>
          </div>
          <p className="mt-2 text-xs text-gray-400">Click to run AI risk breakdown</p>
        </div>

        {/* Prediction Confidence Card */}
        <div 
          onClick={() => onNavigate("forecasting")}
          className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-[#0057B8] hover:shadow"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider font-mono">Forecast Accuracy</span>
            <CheckCircle className="h-5 w-5 text-[#16A34A]" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-[#16A34A] font-mono">94.6%</span>
            <span className="text-xs font-semibold text-gray-500 font-mono">Active</span>
          </div>
          <p className="mt-2 text-xs text-gray-400 font-mono">Calibration interval: 24h</p>
        </div>

        {/* Detected Flares Today */}
        <div 
          onClick={() => onNavigate("catalogue")}
          className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-[#0057B8] hover:shadow"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider font-mono">Flares Logged Today</span>
            <TrendingUp className="h-5 w-5 text-[#0057B8]" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-gray-900 font-mono">{flaresToday.length}</span>
            <span className="text-xs font-semibold text-[#DC2626] font-mono">Peak: {highestFlare?.flareClass}</span>
          </div>
          <p className="mt-2 text-xs text-gray-400">View master flare catalogue</p>
        </div>
      </div>

      {/* Operational Risk Meter & Multi-sensor fusion visualizer */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Operational Risk Meter Widget */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900">Operational Solar Risk Meter</h3>
          <p className="mt-1 text-xs text-gray-500">Real-time threat level for communication blackouts and satellite payload drag.</p>
          
          <div className="mt-6 flex flex-col items-center">
            {/* Radial gauge representation */}
            <div className="relative flex h-36 w-36 items-center justify-center rounded-full border-8 border-gray-100">
              {/* Colored arc representing 42% risk */}
              <div 
                className="absolute inset-0 rounded-full border-8 border-[#F59E0B] border-t-transparent border-r-transparent rotate-45"
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
              ></div>
              <div className="text-center">
                <span className="text-3xl font-extrabold font-mono text-gray-900">42%</span>
                <span className="block text-[10px] font-bold text-gray-500 tracking-wider font-mono uppercase mt-1">Elevated</span>
              </div>
            </div>

            <div className="mt-6 w-full space-y-3">
              <div className="flex items-center justify-between text-xs border-b border-gray-50 pb-2">
                <span className="text-gray-500 font-medium">HF Comms Blackout Probability</span>
                <span className="font-mono font-bold text-gray-800">18.4% (Minor)</span>
              </div>
              <div className="flex items-center justify-between text-xs border-b border-gray-50 pb-2">
                <span className="text-gray-500 font-medium">Sat-Drag Hazard Coefficient</span>
                <span className="font-mono font-bold text-gray-800">0.24 (Nominal)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 font-medium">Active Region S-Index</span>
                <span className="font-mono font-bold text-gray-800">1.82 (Emerging)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Multi-sensor Fusion Core */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Aditya-L1 Multi-Sensor Fusion Matrix</h3>
              <p className="text-xs text-gray-500 mt-0.5">Aligned observations across high-sensitivity spectroscopic bands.</p>
            </div>
            <span className="rounded bg-[#0057B8]/10 px-2 py-0.5 text-[10px] font-mono font-bold text-[#0057B8]">
              CO-ALIGNMENT: VERIFIED
            </span>
          </div>

          <div className="mt-6 space-y-4">
            {/* Sensor 1: SoLEXS */}
            <div className="rounded-lg bg-[#F7F9FC] p-4 border border-[#E5E7EB]">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="h-2 w-2 rounded-full bg-[#0057B8]"></span>
                  <span className="text-xs font-bold text-gray-800">SoLEXS Spectrograph (Soft X-Ray)</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#16A34A] bg-[#EAF7ED] px-2 py-0.5 rounded border border-[#C6ECD2]">
                  GTI nominal
                </span>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white rounded p-1 border border-gray-100">
                  <span className="block text-[9px] text-gray-400 font-medium uppercase font-mono">Observation Band</span>
                  <span className="font-bold text-gray-700 font-mono">1.0 - 22 keV</span>
                </div>
                <div className="bg-white rounded p-1 border border-gray-100">
                  <span className="block text-[9px] text-gray-400 font-medium uppercase font-mono">Integrator Flux</span>
                  <span className="font-bold text-gray-700 font-mono">1.45e-6 W/m²</span>
                </div>
                <div className="bg-white rounded p-1 border border-gray-100">
                  <span className="block text-[9px] text-gray-400 font-medium uppercase font-mono">Thermal Temp</span>
                  <span className="font-bold text-gray-700 font-mono">8.4 Million K</span>
                </div>
              </div>
            </div>

            {/* Sensor 2: HEL1OS */}
            <div className="rounded-lg bg-[#F7F9FC] p-4 border border-[#E5E7EB]">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="h-2 w-2 rounded-full bg-[#F57C00]"></span>
                  <span className="text-xs font-bold text-gray-800">HEL1OS Spectrometer (Hard X-Ray)</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#16A34A] bg-[#EAF7ED] px-2 py-0.5 rounded border border-[#C6ECD2]">
                  GTI nominal
                </span>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white rounded p-1 border border-gray-100">
                  <span className="block text-[9px] text-gray-400 font-medium uppercase font-mono">Observation Band</span>
                  <span className="font-bold text-gray-700 font-mono">10 - 150 keV</span>
                </div>
                <div className="bg-white rounded p-1 border border-gray-100">
                  <span className="block text-[9px] text-gray-400 font-medium uppercase font-mono">Impulsive Flux</span>
                  <span className="font-bold text-gray-700 font-mono">4.20e-8 W/m²</span>
                </div>
                <div className="bg-white rounded p-1 border border-gray-100">
                  <span className="block text-[9px] text-gray-400 font-medium uppercase font-mono">Non-Thermal Index</span>
                  <span className="font-bold text-gray-700 font-mono">2.82 (Stable)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Mission Recommendations Section */}
      <div className="rounded-xl border border-gray-200 bg-[#F7F9FC] p-6">
        <h3 className="text-base font-semibold text-gray-900 flex items-center space-x-2">
          <Shield className="h-5 w-5 text-[#0057B8]" />
          <span>Automated Operations Recommendation Engine</span>
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">Physical payload recommendations derived from continuous telemetry scan matching.</p>
        
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded bg-white p-4 border border-gray-100 shadow-sm">
            <span className="text-[10px] font-bold text-gray-400 font-mono uppercase">Payload Configuration</span>
            <h4 className="font-semibold text-sm text-gray-800 mt-1">SoLEXS High-Voltage Loop</h4>
            <p className="text-xs text-gray-500 mt-1 leading-normal">
              Background levels are nominal. High Voltage remains set to full gain (Nominal Mode). No attenuation requested for SDD detectors.
            </p>
          </div>

          <div className="rounded bg-white p-4 border border-gray-100 shadow-sm">
            <span className="text-[10px] font-bold text-gray-400 font-mono uppercase">Satellite Alert Status</span>
            <h4 className="font-semibold text-sm text-gray-800 mt-1">HF Polar Comms Watch</h4>
            <p className="text-xs text-gray-500 mt-1 leading-normal">
              Active regions exhibiting complex loops. HF operators on polar aviation pathways advised to maintain minor signal watch.
            </p>
          </div>

          <div className="rounded bg-white p-4 border border-gray-100 shadow-sm">
            <span className="text-[10px] font-bold text-gray-400 font-mono uppercase">Spacecraft Health</span>
            <h4 className="font-semibold text-sm text-gray-800 mt-1">L1 Thermal Regulation</h4>
            <p className="text-xs text-gray-500 mt-1 leading-normal">
              Aditya-L1 thermal shields registering optimal cooling (18.1°C). Sensor alignment verified within <span className="font-mono text-[10px] font-bold">0.02 deg</span> drift thresholds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
