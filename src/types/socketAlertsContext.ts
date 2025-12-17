import { createContext } from "react";
import type {
  AlertEventPayload,
  LiveOccupancyEventPayload,
} from "./socket.types";

// Socket alerts context type
export interface SocketAlertsContextType {
  alerts: AlertEventPayload[];
  liveOccupancy: Map<string, LiveOccupancyEventPayload>;
  isConnected: boolean;
  connectionError: Error | null;
  clearAlerts: () => void;
}

// Socket alerts context
export const SocketAlertsContext = createContext<
  SocketAlertsContextType | undefined
>(undefined);
