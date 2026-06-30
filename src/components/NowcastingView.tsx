import { Zap, Play, Radio, Calendar, Shield, Cpu, HelpCircle } from "lucide-react";
import { FlareEvent } from "../types";

interface NowcastingViewProps {
  catalog: FlareEvent[];
  openExplainModal: (title: string, content: string) => void;
}

export default function NowcastingView({ catalog, openExplainModal }: NowcastingViewProps) {
  // Find the most recent active or completed flare from the mock dataset
  const activeFlare = catalog[0] || {
    id: "FL-2026-102",
    date: "2026-06-29",
    startTime: "18:42",
    peakTime: "18:55",
    endTime: "19:24",
    flareClass: "M5.2",
    leadTimeMin: 18,
    confidenceScore: 92,
    activeRegion: "AR3712",
    status: "Completed",
    peakFlux: 5.2e-5,
  };

  const explainNeupertEffect = () => {
    openExplainModal(
      "The Neupert Effect in Nowcasting",
      "In solar physics, the Neupert Effect states that the hard X-ray emission (non-thermal, energetic particle acceleration, HEL1OS) is proportional to the time-derivative of the soft X-ray emission (thermal coronal plasma heating, SoLEXS). Our Aditya-L1 nowcasting pipeline continuously computes d(SoLEXS)/dt and aligns it with HEL1OS peaks to estimate the exact culmination time (Peak Time) of the flare 12-18 minutes before it saturates, allowing operations teams to issue polar HF radio blackouts warnings instantly."
    );
  };

  const timelineSteps = [
    {
      name: "Pre-Flare Phase",
      status: "completed",
      time: activeFlare.startTime,
      desc: "Background X-ray flux is steady. High-temperature active region loops (AR3712) expand.",
    },
    {
      name: "Impulsive Rise Phase",
      status: "completed",
      time: activeFlare.peakTime,
      desc: "Reconnection triggers electron beams. Non-thermal hard X-ray emissions spike on HEL1OS.",
    },
    {
      name: "Thermal Peak Saturation",
      status: "active",
      time: activeFlare.peakTime,
      desc: "SoLEXS records max soft X-ray thermal emission at M5.2 level. Plasma heating peaks at 14.2 MK.",
    },
    {
      name: "Gradual Cooling Phase",
      status: "pending",
      time: activeFlare.endTime,
      desc: "Convective cooling and loop conduction. Soft X-ray fluxes exponentially decay to normal background.",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in" id="nowcasting-view">
      {/* Primary Nowcast Header */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-6">
          <div>
            <span className="text-[10px] font-bold text-gray-400 font-mono uppercase tracking-wider">
              REAL-TIME FLARE NOWCAST CORE
            </span>
            <h2 className="text-xl font-bold text-gray-900 mt-0.5">Ongoing Event Signature Analysis</h2>
          </div>

          <button
            onClick={explainNeupertEffect}
            className="flex items-center space-x-1.5 rounded-lg border border-gray-200 bg-[#F7F9FC] px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
          >
            <HelpCircle className="h-3.5 w-3.5 text-gray-400" />
            <span>Neupert Effect Alignment</span>
          </button>
        </div>

        {/* Large Event Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-lg bg-[#F7F9FC] p-6 border border-gray-100 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider font-mono">
                Active Flare Signature
              </span>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-5xl font-extrabold text-[#F57C00] font-mono tracking-tight">
                  {activeFlare.flareClass}
                </span>
                <span className="text-sm font-semibold text-gray-400 font-mono">Class</span>
              </div>
            </div>

            <div className="mt-6 space-y-2 border-t border-gray-200 pt-4">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 font-medium">Target Active Region:</span>
                <span className="font-mono font-bold text-gray-800">{activeFlare.activeRegion}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 font-medium">Observed Peak Flux:</span>
                <span className="font-mono font-bold text-gray-800">{activeFlare.peakFlux.toExponential(2)} W/m²</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 font-medium">Pipeline Severity:</span>
                <span className="font-mono font-bold text-[#F59E0B] uppercase">MODERATE</span>
              </div>
            </div>
          </div>

          {/* Time Records */}
          <div className="rounded-lg bg-white border border-gray-200 p-6 md:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider font-mono border-b border-gray-50 pb-2">
              Time Signature Milestones
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded border border-gray-100 p-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase font-mono">Observation Date</span>
                <p className="mt-1 text-sm font-bold text-gray-800 flex items-center space-x-1.5">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>{activeFlare.date}</span>
                </p>
              </div>

              <div className="rounded border border-gray-100 p-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase font-mono">Trigger Phase Start</span>
                <p className="mt-1 text-sm font-bold text-gray-800 flex items-center space-x-1.5">
                  <Play className="h-4 w-4 text-[#16A34A]" />
                  <span className="font-mono">{activeFlare.startTime} UTC</span>
                </p>
              </div>

              <div className="rounded border border-gray-100 p-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase font-mono">Reconnection Peak</span>
                <p className="mt-1 text-sm font-bold text-gray-800 flex items-center space-x-1.5">
                  <Cpu className="h-4 w-4 text-[#F57C00]" />
                  <span className="font-mono">{activeFlare.peakTime} UTC</span>
                </p>
              </div>

              <div className="rounded border border-gray-100 p-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase font-mono">Gradual End (Est.)</span>
                <p className="mt-1 text-sm font-bold text-gray-800 flex items-center space-x-1.5">
                  <Shield className="h-4 w-4 text-[#0057B8]" />
                  <span className="font-mono">{activeFlare.endTime} UTC</span>
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 bg-[#F7F9FC] p-3 rounded">
              <span className="font-medium">Active Sensor Fusion Loop:</span>
              <span className="font-mono font-bold text-gray-700">SoLEXS Core-A + HEL1OS CDTE Pixel Detector</span>
            </div>
          </div>
        </div>
      </div>

      {/* Flare Evolution Timeline Visualizer */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900 mb-6">Thermal &amp; Non-Thermal Phase Timeline</h3>

        <div className="relative">
          {/* Timeline background vertical line */}
          <div className="absolute left-4 top-1 h-full w-0.5 bg-gray-100 md:left-1/2 md:-translate-x-1/2"></div>

          <div className="space-y-8">
            {timelineSteps.map((step, idx) => {
              const isActive = step.status === "active";
              const isCompleted = step.status === "completed";

              return (
                <div key={idx} className="relative flex flex-col md:flex-row md:items-center">
                  {/* Circle Indicator */}
                  <div className="absolute left-2.5 top-0 flex h-4 w-4 items-center justify-center md:left-1/2 md:-translate-x-1/2 md:top-auto">
                    <span
                      className={`h-3 w-3 rounded-full border-2 ${
                        isActive
                          ? "bg-[#F57C00] border-[#F57C00] animate-ping"
                          : isCompleted
                          ? "bg-[#16A34A] border-[#16A34A]"
                          : "bg-white border-gray-300"
                      }`}
                    ></span>
                  </div>

                  {/* Content Left (MD+ Screens) */}
                  <div className={`ml-10 md:ml-0 md:w-1/2 md:pr-8 ${idx % 2 === 0 ? "md:text-right" : "md:opacity-0 md:h-0 md:overflow-hidden"}`}>
                    <span className="text-[10px] font-bold text-gray-400 font-mono uppercase">{step.time} UTC</span>
                    <h4 className="text-sm font-bold text-gray-900 mt-0.5">{step.name}</h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{step.desc}</p>
                  </div>

                  {/* Content Right (MD+ Screens) */}
                  <div className={`ml-10 md:ml-0 md:w-1/2 md:pl-8 ${idx % 2 !== 0 ? "md:text-left" : "md:opacity-0 md:h-0 md:overflow-hidden"}`}>
                    <span className="text-[10px] font-bold text-gray-400 font-mono uppercase">{step.time} UTC</span>
                    <h4 className="text-sm font-bold text-gray-900 mt-0.5">{step.name}</h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
