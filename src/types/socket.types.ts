// Socket.IO event types

export type AlertDirection = "entry" | "exit" | "zone-exit" | "zone-entry";
export type AlertSeverity = "low" | "medium" | "high";

// Alert event payload type
export interface AlertEventPayload {
  ts: number;
  eventId: string;
  direction: AlertDirection;
  personName: string;
  severity: AlertSeverity;
  siteId?: string;
  zoneId?: string;
  zoneName?: string;
  placeName?: string;
}

// Live occupancy event payload type
export interface LiveOccupancyEventPayload {
  siteId: string;
  zoneId?: string;
  floorId?: string;
  occupancy: number;
  timestamp: string | number;
}

// Socket alerts context type
export interface SocketAlertsContextType {
  alerts: AlertEventPayload[];
  liveOccupancy: Map<string, LiveOccupancyEventPayload>;
  isConnected: boolean;
  connectionError: Error | null;
  clearAlerts: () => void;
}
