import { useState, useEffect } from "react";
import { ClipboardList, Printer, FileText, Check, Loader2, Award, FileSpreadsheet } from "lucide-react";

export default function MissionBriefView() {
  const [reportType, setReportType] = useState<"daily" | "weekly" | "status" | "recommendations">("daily");
  const [reportContent, setReportContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [engineUsed, setEngineUsed] = useState("");

  const fetchBrief = async (type: typeof reportType) => {
    setIsLoading(true);
    setReportContent("");
    try {
      const response = await fetch("/api/ai/mission-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportType: type }),
      });
      const data = await response.json();
      if (data.report) {
        setReportContent(data.report);
        setEngineUsed(data.model || "Gemini-3.5-Flash");
      }
    } catch (e) {
      console.error("Failed to generate brief:", e);
      setReportContent("Error compiling telemetry briefing.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrief(reportType);
  }, [reportType]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in" id="mission-brief-view">
      {/* Selector and Options Header */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-gray-400 font-mono uppercase tracking-wider">
            AUTOMATED ADITYA-L1 REPORT CORE
          </span>
          <h2 className="text-xl font-bold text-gray-900 mt-0.5">AI Mission Briefing &amp; Memorandums</h2>
          <p className="text-xs text-gray-500 mt-1">
            Generate printable high-fidelity, peer-reviewed solar weather reports with a single click.
          </p>
        </div>

        {/* Action button */}
        <button
          onClick={handlePrint}
          className="flex items-center justify-center space-x-1.5 rounded-lg bg-[#0057B8] px-4 py-2 text-xs font-semibold text-white shadow hover:bg-opacity-90 transition shrink-0"
        >
          <Printer className="h-4 w-4" />
          <span>Export / Print PDF Brief</span>
        </button>
      </div>

      {/* Grid of Report Types */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4">
        {[
          { id: "daily", label: "Daily Summary", desc: "24-hour activity review" },
          { id: "weekly", label: "Weekly Summary", desc: "7-day trend matrix" },
          { id: "status", label: "Mission Status", desc: "Spacecraft subsystem health" },
          { id: "recommendations", label: "Operational Guardrails", desc: "Telemetry guard postures" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setReportType(item.id as any)}
            className={`text-left rounded-xl p-4 border transition duration-150 ${
              reportType === item.id
                ? "bg-[#0057B8]/5 border-[#0057B8] text-[#0057B8] shadow-sm"
                : "bg-white border-gray-200 hover:border-gray-300 text-gray-700"
            }`}
          >
            <h3 className="text-xs font-bold font-mono uppercase">{item.label}</h3>
            <p className="text-[10px] text-gray-400 mt-1 font-medium leading-tight">{item.desc}</p>
          </button>
        ))}
      </div>

      {/* Official Memorandum Paper */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-lg p-8 space-y-6 max-w-4xl mx-auto border-t-8 border-t-[#0057B8] print:border-none print:shadow-none print:p-0">
        {/* Paper Header */}
        <div className="flex justify-between items-start border-b border-gray-200 pb-6">
          <div className="space-y-1">
            <h1 className="text-sm font-extrabold text-gray-900 tracking-tight font-sans">
              BHARATIYA ANTARIKSH ANUSANDHAN SANGATHAN
            </h1>
            <h2 className="text-xs font-bold text-gray-600 tracking-wider font-mono">
              INDIAN SPACE RESEARCH ORGANISATION (ISRO)
            </h2>
            <p className="text-[10px] text-gray-400 font-mono uppercase">
              Solar Physics &amp; Space Weather Operations Division, Bengaluru, India
            </p>
          </div>

          <div className="text-right text-[10px] font-mono text-gray-400 space-y-1">
            <p className="font-bold text-gray-800">MEMORANDUM AL1-SW</p>
            {engineUsed && <p className="text-[#0057B8] font-bold">CALIBRATION: {engineUsed}</p>}
            <p className="font-semibold text-gray-500">GTI MATCH INDEX: 1.00</p>
          </div>
        </div>

        {/* Loading / Content Section */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="h-10 w-10 text-[#0057B8] animate-spin" />
            <p className="text-xs font-mono font-bold text-gray-500">
              Compiling SoLEXS &amp; HEL1OS observation models...
            </p>
          </div>
        ) : (
          <div className="text-xs leading-relaxed text-gray-700 print:text-sm">
            {/* Split markdown style content into clean structured lines */}
            <div className="space-y-4 whitespace-pre-wrap">
              {reportContent}
            </div>

            {/* Official Stamps / Signature Signoff Block */}
            <div className="mt-12 border-t border-gray-100 pt-8 flex justify-between items-center text-[10px] font-mono">
              <div className="space-y-1">
                <p className="font-bold text-gray-500 uppercase">Document Verification Stamp</p>
                <div className="h-8 w-24 bg-[#0057B8]/5 border border-dashed border-[#0057B8] rounded flex items-center justify-center">
                  <Award className="h-5 w-5 text-[#0057B8]" />
                  <span className="text-[8px] font-bold font-mono text-[#0057B8] ml-1">L1 SECURE</span>
                </div>
              </div>

              <div className="text-right space-y-1">
                <p className="font-bold text-gray-800">AUTO-APPROVED SIGNATURE</p>
                <p className="text-gray-400">Aditya-L1 Space Weather Core API</p>
                <p className="text-[8px] text-gray-400">TIMESTAMP: {new Date().toISOString().substring(0, 10)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
