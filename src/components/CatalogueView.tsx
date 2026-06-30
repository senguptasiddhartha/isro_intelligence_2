import { useState } from "react";
import { Table, Search, ArrowUpDown, Download, Filter, Eye, X, BookOpen } from "lucide-react";
import { FlareEvent } from "../types";

interface CatalogueViewProps {
  catalog: FlareEvent[];
  openExplainModal: (title: string, content: string) => void;
}

export default function CatalogueView({ catalog, openExplainModal }: CatalogueViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState<"date" | "class" | "confidence" | "leadTime">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedFlare, setSelectedFlare] = useState<FlareEvent | null>(null);

  // Filter & Search logic
  const filteredCatalog = catalog.filter((flare) => {
    const matchesSearch =
      flare.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flare.activeRegion.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesClass =
      classFilter === "ALL" || flare.flareClass.startsWith(classFilter);

    const matchesStatus =
      statusFilter === "ALL" || flare.status === statusFilter;

    return matchesSearch && matchesClass && matchesStatus;
  });

  // Sorting logic
  const sortedCatalog = [...filteredCatalog].sort((a, b) => {
    let valueA: any = a[sortBy];
    let valueB: any = b[sortBy];

    if (sortBy === "class") {
      valueA = a.flareClass;
      valueB = b.flareClass;
    }

    if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
    if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("desc");
    }
  };

  // CSV Exporter
  const exportCSV = () => {
    const headers = ["Flare ID", "Date", "Start Time", "Peak Time", "End Time", "Class", "Lead Time (min)", "Confidence (%)", "Active Region", "Status", "Peak Flux (W/m2)"];
    const rows = sortedCatalog.map((f) => [
      f.id,
      f.date,
      f.startTime,
      f.peakTime,
      f.endTime,
      f.flareClass,
      f.leadTimeMin,
      f.confidenceScore,
      f.activeRegion,
      f.status,
      f.peakFlux,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Aditya-L1_Flare_Catalogue_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // PDF / Print Layout trigger
  const triggerPrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in" id="catalogue-view">
      {/* Title block */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-gray-400 font-mono uppercase tracking-wider">
            ISRO SPACE WEATHER SCIENTIFIC DATASET
          </span>
          <h2 className="text-xl font-bold text-gray-900 mt-0.5">Master Solar Flare Catalogue</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Archived and active flare telemetry recordings observed by Aditya-L1 payloads.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={exportCSV}
            className="flex items-center space-x-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            <Download className="h-4 w-4 text-gray-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={triggerPrint}
            className="flex items-center space-x-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            <Table className="h-4 w-4 text-gray-400" />
            <span>Print Catalogue</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Panel */}
      <div className="bg-[#F7F9FC] border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row items-center gap-4">
        {/* Text Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Flare ID or Active Region..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-4 text-xs font-medium text-gray-800 placeholder-gray-400 focus:border-[#0057B8] focus:outline-none focus:ring-1 focus:ring-[#0057B8]"
          />
        </div>

        {/* Flare Class Filter */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">Class:</span>
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white py-1.5 px-3 text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#0057B8]"
          >
            <option value="ALL">All Classes</option>
            <option value="X">X-Class</option>
            <option value="M">M-Class</option>
            <option value="C">C-Class</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white py-1.5 px-3 text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#0057B8]"
          >
            <option value="ALL">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Predicted">Predicted</option>
          </select>
        </div>

        {/* Total records counter */}
        <div className="ml-auto text-xs font-mono font-bold text-gray-500">
          Showing {sortedCatalog.length} of {catalog.length} records
        </div>
      </div>

      {/* Catalogue Table */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F7F9FC] border-b border-gray-200 text-xs font-bold text-gray-500 uppercase font-mono tracking-wider select-none">
                <th className="py-3 px-4">Flare ID</th>
                <th className="py-3 px-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort("date")}>
                  <div className="flex items-center space-x-1">
                    <span>Date</span>
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </div>
                </th>
                <th className="py-3 px-4">Start (UTC)</th>
                <th className="py-3 px-4">Peak (UTC)</th>
                <th className="py-3 px-4">End (UTC)</th>
                <th className="py-3 px-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort("class")}>
                  <div className="flex items-center space-x-1">
                    <span>Class</span>
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort("leadTime")}>
                  <div className="flex items-center space-x-1">
                    <span>Lead Time</span>
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort("confidence")}>
                  <div className="flex items-center space-x-1">
                    <span>Confidence</span>
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </div>
                </th>
                <th className="py-3 px-4">Active Region</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-xs text-gray-700">
              {sortedCatalog.map((flare) => {
                let badgeColor = "bg-green-50 text-green-700 border-green-200";
                if (flare.flareClass.startsWith("X")) {
                  badgeColor = "bg-red-50 text-[#DC2626] border-red-200 font-bold";
                } else if (flare.flareClass.startsWith("M")) {
                  badgeColor = "bg-amber-50 text-[#F57C00] border-amber-200 font-bold";
                }

                return (
                  <tr
                    key={flare.id}
                    onClick={() => setSelectedFlare(flare)}
                    className="hover:bg-gray-50/85 transition cursor-pointer"
                  >
                    <td className="py-3 px-4 font-bold font-mono text-gray-900">{flare.id}</td>
                    <td className="py-3 px-4 font-mono">{flare.date}</td>
                    <td className="py-3 px-4 font-mono">{flare.startTime}</td>
                    <td className="py-3 px-4 font-mono">{flare.peakTime}</td>
                    <td className="py-3 px-4 font-mono">{flare.endTime}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded border text-[11px] font-mono ${badgeColor}`}>
                        {flare.flareClass}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono">{flare.leadTimeMin} min</td>
                    <td className="py-3 px-4 font-mono font-semibold">{flare.confidenceScore}%</td>
                    <td className="py-3 px-4 font-bold text-[#0057B8] font-mono">{flare.activeRegion}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          flare.status === "Completed"
                            ? "bg-gray-100 text-gray-600"
                            : flare.status === "Ongoing"
                            ? "bg-[#EAF7ED] text-[#16A34A] animate-pulse"
                            : "bg-[#0057B8]/10 text-[#0057B8]"
                        }`}
                      >
                        {flare.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedFlare(flare)}
                        className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-[#0057B8]"
                        title="View Scientific Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Event Details Overlay Slideout or Dialog */}
      {selectedFlare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4 animate-fade-in" id="flare-detail-modal">
          <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedFlare(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-2 border-b border-gray-100 pb-3 mb-4">
              <BookOpen className="h-5 w-5 text-[#0057B8]" />
              <h3 className="text-base font-bold text-gray-900">Aditya-L1 Event Log Summary</h3>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center bg-[#F7F9FC] p-3 rounded">
                <span className="text-xs font-semibold text-gray-500 font-mono">EVENT ID</span>
                <span className="text-sm font-bold text-gray-900 font-mono">{selectedFlare.id}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="block text-gray-400 font-semibold uppercase font-mono text-[9px]">Observation Date</span>
                  <span className="font-bold text-gray-700">{selectedFlare.date}</span>
                </div>
                <div>
                  <span className="block text-gray-400 font-semibold uppercase font-mono text-[9px]">Active region target</span>
                  <span className="font-bold text-[#0057B8] font-mono">{selectedFlare.activeRegion}</span>
                </div>
                <div>
                  <span className="block text-gray-400 font-semibold uppercase font-mono text-[9px]">Event start time</span>
                  <span className="font-mono text-gray-800">{selectedFlare.startTime} UTC</span>
                </div>
                <div>
                  <span className="block text-gray-400 font-semibold uppercase font-mono text-[9px]">Event peak saturation</span>
                  <span className="font-mono text-gray-800">{selectedFlare.peakTime} UTC</span>
                </div>
                <div>
                  <span className="block text-gray-400 font-semibold uppercase font-mono text-[9px]">Calculated lead time</span>
                  <span className="font-mono text-gray-800">{selectedFlare.leadTimeMin} Minutes</span>
                </div>
                <div>
                  <span className="block text-gray-400 font-semibold uppercase font-mono text-[9px]">Detector Confidence</span>
                  <span className="font-mono font-bold text-[#16A34A]">{selectedFlare.confidenceScore}%</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2">
                <h4 className="text-xs font-bold text-gray-800 font-mono">PHYSICAL SPECIFICATIONS</h4>
                <p className="text-xs text-gray-500 leading-normal">
                  This solar event, centering in Active Region <strong className="text-gray-700">{selectedFlare.activeRegion}</strong>, peaked at a raw irradiance of <strong className="text-gray-700">{selectedFlare.peakFlux.toExponential(4)} Watts/m²</strong> in the soft X-ray spectrometer. Standard spectro-imaging logs confirmed robust thermal magnetic loop expansion with corresponding high-energy bremsstrahlung impulses recorded in the cad-tel pixel detectors on HEL1OS, indicating rapid non-thermal particle acceleration.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedFlare(null)}
                className="rounded-lg bg-gray-100 hover:bg-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 transition"
              >
                Close Logs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
