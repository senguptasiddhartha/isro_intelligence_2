import { FlareEvent, SolarTelemetry, ForecastCardData, SystemStatusData } from "./types";

// 24 Hours of high-fidelity 5-minute interval Solar X-ray flux telemetry
export const generateTelemetryData = (): SolarTelemetry[] => {
  const data: SolarTelemetry[] = [];
  const now = new Date();
  
  // Create 100 points representing a 12-hour period leading to the present
  for (let i = 100; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 5 * 60 * 1000);
    const timeStr = time.toISOString().substring(11, 16) + " UTC";
    
    // Add a baseline level
    let softBase = 1.2e-6 + Math.sin(i / 10) * 4e-7; // C-class baseline
    let hardBase = 3.5e-8 + Math.sin(i / 8) * 1.5e-8;
    
    // Inject a realistic M5.2 flare peak around point i = 40 (3 hours ago)
    const flareDistance = Math.abs(i - 40);
    if (flareDistance < 15) {
      // Gaussian distribution for flare impulsive rise and gradual decay
      const riseDecay = flareDistance <= 0 ? 1 : Math.exp(-Math.pow(flareDistance, 2) / (flareDistance > 0 ? 40 : 10));
      softBase += 4.5e-5 * riseDecay; // Peaking into M-class
      hardBase += 8.2e-6 * riseDecay * (flareDistance < 4 ? 1.5 : 0.4); // Hard X-ray peaking during impulsive rise
    }

    // Inject a second, smaller C8.4 impulse at point i = 85 (around 1 hour ago)
    const microFlareDist = Math.abs(i - 85);
    if (microFlareDist < 8) {
      const impulse = Math.exp(-Math.pow(microFlareDist, 2) / 12);
      softBase += 7.8e-6 * impulse;
      hardBase += 9.5e-7 * impulse;
    }

    data.push({
      timestamp: timeStr,
      softXrayFlux: parseFloat(softBase.toExponential(4)),
      hardXrayFlux: parseFloat(hardBase.toExponential(4)),
      activeRegionTemp: parseFloat((8.5 + (softBase * 2e5)).toFixed(2)), // Temp in MK
      detectorTemp: parseFloat((18.0 + Math.sin(i / 20) * 0.4).toFixed(2)), // CZT detector temp
      gtiStatus: i === 12 || i === 13 ? 0.0 : 1.0 // Simulated occultation during tracking handover
    });
  }
  return data;
};

// Realistic Solar Flare Catalog for Aditya-L1 SoLEXS & HEL1OS
export const initialFlareCatalogue: FlareEvent[] = [
  {
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
    peakFlux: 5.2e-5
  },
  {
    id: "FL-2026-101",
    date: "2026-06-29",
    startTime: "12:10",
    peakTime: "12:15",
    endTime: "12:35",
    flareClass: "C8.4",
    leadTimeMin: 12,
    confidenceScore: 89,
    activeRegion: "AR3715",
    status: "Completed",
    peakFlux: 8.4e-6
  },
  {
    id: "FL-2026-100",
    date: "2026-06-28",
    startTime: "23:02",
    peakTime: "23:14",
    endTime: "23:48",
    flareClass: "M1.1",
    leadTimeMin: 22,
    confidenceScore: 95,
    activeRegion: "AR3712",
    status: "Completed",
    peakFlux: 1.1e-5
  },
  {
    id: "FL-2026-099",
    date: "2026-06-28",
    startTime: "04:15",
    peakTime: "04:32",
    endTime: "05:10",
    flareClass: "X1.8",
    leadTimeMin: 34,
    confidenceScore: 97,
    activeRegion: "AR3708",
    status: "Completed",
    peakFlux: 1.8e-4
  },
  {
    id: "FL-2026-098",
    date: "2026-06-27",
    startTime: "15:20",
    peakTime: "15:35",
    endTime: "16:02",
    flareClass: "C5.6",
    leadTimeMin: 8,
    confidenceScore: 81,
    activeRegion: "AR3719",
    status: "Completed",
    peakFlux: 5.6e-6
  },
  {
    id: "FL-2026-097",
    date: "2026-06-26",
    startTime: "09:50",
    peakTime: "10:04",
    endTime: "10:45",
    flareClass: "M3.4",
    leadTimeMin: 14,
    confidenceScore: 90,
    activeRegion: "AR3712",
    status: "Completed",
    peakFlux: 3.4e-5
  },
  {
    id: "FL-2026-096",
    date: "2026-06-25",
    startTime: "21:30",
    peakTime: "21:52",
    endTime: "22:40",
    flareClass: "X2.5",
    leadTimeMin: 41,
    confidenceScore: 98,
    activeRegion: "AR3708",
    status: "Completed",
    peakFlux: 2.5e-4
  },
  {
    id: "FL-2026-095",
    date: "2026-06-24",
    startTime: "02:11",
    peakTime: "02:19",
    endTime: "02:44",
    flareClass: "M1.2",
    leadTimeMin: 15,
    confidenceScore: 87,
    activeRegion: "AR3715",
    status: "Completed",
    peakFlux: 1.2e-5
  },
  {
    id: "FL-2026-094",
    date: "2026-06-23",
    startTime: "11:05",
    peakTime: "11:18",
    endTime: "11:55",
    flareClass: "C9.2",
    leadTimeMin: 10,
    confidenceScore: 84,
    activeRegion: "AR3712",
    status: "Completed",
    peakFlux: 9.2e-6
  }
];

// Predictive forecasting configs for different lead times
export const initialForecasts: ForecastCardData[] = [
  {
    timeframe: "5 min",
    probability: 94.2,
    confidence: 96.0,
    expectedClass: "C1.4",
    leadTime: "5 min",
    factors: ["Sustained soft X-ray slope (+8.4%/min)", "Secondary reconnection site flare-up", "Low thermal cooling rate"]
  },
  {
    timeframe: "15 min",
    probability: 68.5,
    confidence: 88.5,
    expectedClass: "M1.2",
    leadTime: "15 min",
    factors: ["Pre-flare footprint enhancement on HEL1OS", "Thermal coronal loops expanding to 12 MK", "Magnetic shear amplification"]
  },
  {
    timeframe: "30 min",
    probability: 42.1,
    confidence: 84.0,
    expectedClass: "M3.5",
    leadTime: "30 min",
    factors: ["Active region AR3712 polarity convergence", "Flux rope torsion index elevated", "Helicity accumulation rate > threshold"]
  },
  {
    timeframe: "60 min",
    probability: 14.8,
    confidence: 79.5,
    expectedClass: "X1.0",
    leadTime: "60 min",
    factors: ["Stretched current sheet instability", "CME launch trajectory pre-conditioning", "Extreme non-thermal heating signatures"]
  }
];

// Default System Health metrics
export const defaultSystemStatus: SystemStatusData = {
  solexsStatus: "nominal",
  hel1osStatus: "nominal",
  gtiQuality: 0.984,
  modelHealth: 94.6,
  pipelineLatencyMs: 142,
  dataAvailability: 100.0,
  telemetryStream: "active",
  groundStationLink: "locked"
};

// Alert Event Log
export interface SpaceWeatherAlert {
  id: string;
  timestamp: string;
  severity: "normal" | "watch" | "warning" | "critical";
  title: string;
  message: string;
  instrument: "SoLEXS" | "HEL1OS" | "Ground-Station" | "System";
  acknowledged: boolean;
}

export const initialAlerts: SpaceWeatherAlert[] = [
  {
    id: "AL-804",
    timestamp: "2026-06-29T21:42:00Z",
    severity: "warning",
    title: "M-Class Solar Flare Impulse Detected",
    message: "SoLEXS Soft X-ray flux crossed 1.0e-5 W/m² (M1.0 threshold) in active region AR3712.",
    instrument: "SoLEXS",
    acknowledged: false
  },
  {
    id: "AL-803",
    timestamp: "2026-06-29T18:44:00Z",
    severity: "critical",
    title: "Impulsive Hard X-Ray Energy Burst",
    message: "HEL1OS pixel arrays detected a major non-thermal spike >40 keV. Accelerating electron populations confirmed.",
    instrument: "HEL1OS",
    acknowledged: false
  },
  {
    id: "AL-802",
    timestamp: "2026-06-29T12:08:00Z",
    severity: "watch",
    title: "Active Region AR3712 Flux Emergence",
    message: "Thermal core temperatures in AR3712 expanded from 8.4 MK to 14.5 MK over a 10-minute interval.",
    instrument: "SoLEXS",
    acknowledged: true
  },
  {
    id: "AL-801",
    timestamp: "2026-06-29T06:15:00Z",
    severity: "normal",
    title: "Ground Station Handover Complete",
    message: "Spacecraft telemetry downlink locked successfully with ISTRAC Indian Deep Space Network (IDSN) 32-meter antenna.",
    instrument: "Ground-Station",
    acknowledged: true
  }
];

// Accuracy Metrics for AI Models
export const analyticsMetrics = {
  accuracy: 95.2,
  precision: 94.1,
  recall: 91.8,
  f1Score: 92.9,
  falseAlarmRate: 4.8,
  meanLeadTimeMin: 22.4,
  confusionMatrix: {
    truePositive: 412,
    falsePositive: 21,
    trueNegative: 1248,
    falseNegative: 37
  }
};
