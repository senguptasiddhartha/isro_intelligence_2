export type TabId =
  | "dashboard"
  | "monitoring"
  | "nowcasting"
  | "forecasting"
  | "catalogue"
  | "historical"
  | "assistant"
  | "brief"
  | "health"
  | "analytics"
  | "alerts";

export interface FlareEvent {
  id: string;
  date: string;
  startTime: string;
  peakTime: string;
  endTime: string;
  flareClass: string; // e.g. "X2.1", "M5.4"
  leadTimeMin: number;
  confidenceScore: number;
  activeRegion: string; // e.g. "AR3512"
  status: "Completed" | "Ongoing" | "Predicted";
  peakFlux: number; // in Watts/m^2
}

export interface SolarTelemetry {
  timestamp: string; // UTC time
  softXrayFlux: number; // SoLEXS W/m² (1.0-22 keV)
  hardXrayFlux: number; // HEL1OS W/m² (10-150 keV)
  activeRegionTemp: number; // MK (Million Kelvin)
  detectorTemp: number; // C
  gtiStatus: number; // Good Time Interval (0 to 1.0)
}

export interface ForecastCardData {
  timeframe: string; // "5 min" | "15 min" | "30 min" | "60 min"
  probability: number; // %
  confidence: number; // %
  expectedClass: string; // "C-Class" | "M-Class" | "X-Class"
  leadTime: string; // "5m" | "15m" etc
  factors: string[];
}

export interface SystemStatusData {
  solexsStatus: "nominal" | "degraded" | "critical";
  hel1osStatus: "nominal" | "degraded" | "critical";
  gtiQuality: number; // e.g., 0.985
  modelHealth: number; // accuracy % e.g. 94.2
  pipelineLatencyMs: number;
  dataAvailability: number; // % e.g. 100.0
  telemetryStream: "active" | "inactive";
  groundStationLink: "locked" | "acquiring" | "lost";
}
