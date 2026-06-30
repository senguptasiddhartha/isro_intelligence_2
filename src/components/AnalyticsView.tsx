import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { BarChart3, HelpCircle, ShieldAlert, CheckCircle2, ChevronRight, Info } from "lucide-react";
import { analyticsMetrics } from "../data";

interface AnalyticsViewProps {
  openExplainModal: (title: string, content: string) => void;
}

export default function AnalyticsView({ openExplainModal }: AnalyticsViewProps) {
  const [selectedThreshold, setSelectedThreshold] = useState<number>(0.5);

  // Generate dynamic ROC coordinates representing AUC of 0.962
  const rocData = [
    { fpr: 0.00, tpr: 0.00, threshold: 1.0 },
    { fpr: 0.01, tpr: 0.35, threshold: 0.9 },
    { fpr: 0.02, tpr: 0.65, threshold: 0.8 },
    { fpr: 0.04, tpr: 0.82, threshold: 0.7 },
    { fpr: 0.05, tpr: 0.92, threshold: 0.5 }, // Chosen default
    { fpr: 0.10, tpr: 0.95, threshold: 0.3 },
    { fpr: 0.22, tpr: 0.97, threshold: 0.2 },
    { fpr: 0.45, tpr: 0.99, threshold: 0.1 },
    { fpr: 1.00, tpr: 1.00, threshold: 0.0 },
  ];

  const explainConfusionMatrix = (quadrant: string) => {
    let title = "";
    let explanation = "";
    switch (quadrant) {
      case "TP":
        title = "True Positives (TP)";
        explanation = "True Positives represent instances where the Aditya-L1 AI model successfully forecasted a solar flare within the lead time window, and the flare was subsequently detected by SoLEXS/HEL1OS. Our YTD count is 412 successful flare predictions.";
        break;
      case "FP":
        title = "False Positives (FP) / False Alarms";
        explanation = "False Positives represent 'False Alarms' where the AI models forecasted an impending solar flare, but the magnetic reconnection loops subsided, resulting in no actual eruption. Currently held to a very low 4.8% rate.";
        break;
      case "TN":
        title = "True Negatives (TN)";
        explanation = "True Negatives indicate periods where the model correctly predicted quiet solar background states (no flare activity), verified subsequently by steady baseline soft X-ray observations. Fulfills 1248 quiet slots.";
        break;
      case "FN":
        title = "False Negatives (FN) / Missed Triggers";
        explanation = "False Negatives are critical 'Missed Triggers' where a solar flare erupted unexpectedly without prior neural network warnings. Restricting FN is the absolute highest priority of our model calibration (currently at 37 missed triggers).";
        break;
    }
    openExplainModal(title, explanation);
  };

  const activeRocPoint = rocData.find((p) => p.threshold === selectedThreshold) || rocData[4];

  return (
    <div className="space-y-6 animate-fade-in" id="analytics-view">
      {/* Page Title */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-gray-400 font-mono uppercase tracking-wider">
            PREDICTIVE MODEL BENCHMARKS
          </span>
          <h2 className="text-xl font-bold text-gray-900 mt-0.5">Statistical Performance Analytics</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Validation scores, receiver operating curves (ROC), and confusion matrix quadrants evaluated YTD.
          </p>
        </div>

        <span className="text-xs font-mono font-bold text-[#0057B8] bg-[#0057B8]/10 border border-[#0057B8]/20 px-3 py-1.5 rounded-lg">
          ROC AREA UNDER CURVE (AUC): 0.962
        </span>
      </div>

      {/* Grid of Standard Scores */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
        {[
          { label: "Accuracy", value: `${analyticsMetrics.accuracy}%`, color: "text-gray-900" },
          { label: "Precision", value: `${analyticsMetrics.precision}%`, color: "text-gray-900" },
          { label: "Recall / Sensitivity", value: `${analyticsMetrics.recall}%`, color: "text-gray-900" },
          { label: "F1 Score", value: `${analyticsMetrics.f1Score}%`, color: "text-gray-900" },
          { label: "False Alarm Rate", value: `${analyticsMetrics.falseAlarmRate}%`, color: "text-red-600" },
          { label: "Mean Lead Time", value: `${analyticsMetrics.meanLeadTimeMin} min`, color: "text-[#0057B8]" },
        ].map((score, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm text-center">
            <span className="text-[9px] font-bold text-gray-400 uppercase font-mono block tracking-wider leading-tight h-6">
              {score.label}
            </span>
            <p className={`text-xl font-extrabold font-mono mt-1 ${score.color}`}>{score.value}</p>
          </div>
        ))}
      </div>

      {/* Interactive ROC and Confusion Matrix layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Confusion Matrix Interactive Quadrant */}
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider font-mono">
              YTD Operational Confusion Matrix (Events Count)
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Click on any quadrant below to display physical definitions and target limits.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* True Positive */}
            <div
              onClick={() => explainConfusionMatrix("TP")}
              className="border-2 border-green-200 hover:border-green-500 rounded-xl p-5 bg-green-50/50 cursor-pointer transition text-center select-none"
            >
              <span className="block text-[10px] font-bold text-green-700 font-mono">TRUE POSITIVES (TP)</span>
              <p className="text-3xl font-extrabold font-mono text-green-800 mt-2">
                {analyticsMetrics.confusionMatrix.truePositive}
              </p>
              <span className="block text-[10px] text-green-600 mt-1">Flares predicted &amp; observed</span>
            </div>

            {/* False Positive */}
            <div
              onClick={() => explainConfusionMatrix("FP")}
              className="border-2 border-red-200 hover:border-red-400 rounded-xl p-5 bg-red-50/30 cursor-pointer transition text-center select-none"
            >
              <span className="block text-[10px] font-bold text-red-700 font-mono">FALSE POSITIVES (FP)</span>
              <p className="text-3xl font-extrabold font-mono text-red-700 mt-2">
                {analyticsMetrics.confusionMatrix.falsePositive}
              </p>
              <span className="block text-[10px] text-red-600 mt-1">False alarms issued</span>
            </div>

            {/* False Negative */}
            <div
              onClick={() => explainConfusionMatrix("FN")}
              className="border-2 border-amber-200 hover:border-amber-400 rounded-xl p-5 bg-amber-50/30 cursor-pointer transition text-center select-none"
            >
              <span className="block text-[10px] font-bold text-amber-700 font-mono font-bold">FALSE NEGATIVES (FN)</span>
              <p className="text-3xl font-extrabold font-mono text-amber-700 mt-2">
                {analyticsMetrics.confusionMatrix.falseNegative}
              </p>
              <span className="block text-[10px] text-amber-600 mt-1">Missed solar eruptions</span>
            </div>

            {/* True Negative */}
            <div
              onClick={() => explainConfusionMatrix("TN")}
              className="border-2 border-gray-200 hover:border-gray-400 rounded-xl p-5 bg-gray-50 cursor-pointer transition text-center select-none"
            >
              <span className="block text-[10px] font-bold text-gray-500 font-mono">TRUE NEGATIVES (TN)</span>
              <p className="text-3xl font-extrabold font-mono text-gray-700 mt-2">
                {analyticsMetrics.confusionMatrix.trueNegative}
              </p>
              <span className="block text-[10px] text-gray-400 mt-1">Correctly quiet indices</span>
            </div>
          </div>
        </div>

        {/* Interactive ROC curve */}
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider font-mono">
                Model Receiver Operating Curve (ROC)
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">Toggle thresholds to optimize True/False Positive rates.</p>
            </div>

            {/* Threshold Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-gray-500 font-mono">Cutoff:</span>
              <select
                value={selectedThreshold}
                onChange={(e) => setSelectedThreshold(parseFloat(e.target.value))}
                className="rounded border border-gray-200 py-1 px-2 text-xs font-bold font-mono focus:outline-none"
              >
                <option value={0.9}>0.90</option>
                <option value={0.8}>0.80</option>
                <option value={0.7}>0.70</option>
                <option value={0.5}>0.50 (Nominal)</option>
                <option value={0.3}>0.30</option>
                <option value={0.2}>0.20</option>
                <option value={0.1}>0.10</option>
              </select>
            </div>
          </div>

          {/* Curve plot */}
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rocData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRoc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0057B8" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0057B8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F3F5" />
                <XAxis dataKey="fpr" type="number" domain={[0, 1]} stroke="#9CA3AF" fontSize={9} fontStyle="mono" />
                <YAxis dataKey="tpr" type="number" domain={[0, 1]} stroke="#9CA3AF" fontSize={9} fontStyle="mono" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded border border-gray-200 bg-white p-2.5 text-[10px] font-mono shadow">
                          <p className="font-bold text-gray-900">Cutoff Threshold: {data.threshold}</p>
                          <p className="text-[#16A34A] font-semibold">True Positive Rate (TPR): {data.tpr}</p>
                          <p className="text-[#DC2626] font-semibold">False Positive Rate (FPR): {data.fpr}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {/* Baseline 50% diagonal line */}
                <ReferenceLine segment={[{ x: 0, y: 0 }, { x: 1, y: 1 }]} stroke="#9CA3AF" strokeDasharray="3 3" />
                
                {/* Active selection dot helper */}
                <ReferenceLine x={activeRocPoint.fpr} stroke="#0057B8" strokeDasharray="2 2" />
                <ReferenceLine y={activeRocPoint.tpr} stroke="#0057B8" strokeDasharray="2 2" />

                <Area type="monotone" dataKey="tpr" stroke="#0057B8" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRoc)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Dynamic calibration message */}
          <div className="rounded-lg bg-[#F7F9FC] border border-gray-100 p-4 text-xs flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Info className="h-4.5 w-4.5 text-[#0057B8]" />
              <div className="leading-tight">
                <span className="font-bold text-gray-800">Threshold Calibration Profile</span>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  Sensitivity balance: TPR is {activeRocPoint.tpr * 100}% | FPR is {activeRocPoint.fpr * 100}%.
                </p>
              </div>
            </div>
            <button
              onClick={() =>
                openExplainModal(
                  "ROC Boundary Calibration",
                  "Evaluating ROC curves helps solar scientists optimize decision thresholds. Setting the classification cutoff higher (e.g., 0.80) limits False Positives (minimizing false alarms for satellite safety steps), but increases False Negatives (missed triggers). Setting the cutoff lower (e.g. 0.30) guarantees we capture every potential flare, but increases operational alarms. A nominal cutoff of 0.50 maintains an ideal 94.6% mean performance index."
                )
              }
              className="text-xs text-[#0057B8] font-semibold hover:underline"
            >
              Explain Curve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
