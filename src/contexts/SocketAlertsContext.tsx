import { useEffect, useState, type ReactNode } from "react";
import { socketService } from "../services/socket.service";
import type {
  AlertEventPayload,
  LiveOccupancyEventPayload,
} from "../types/socket.types";
import { isAuthenticated } from "../api/auth";
import { SocketAlertsContext } from "../types/socketAlertsContext";

// Socket Alerts Provider Props
interface SocketAlertsProviderProps {
  children: ReactNode;
}

// Socket Alerts Provider Component
export function SocketAlertsProvider({ children }: SocketAlertsProviderProps) {
  // Alerts state
  const [alerts, setAlerts] = useState<AlertEventPayload[]>([]);

  // Live Occupancy state
  const [liveOccupancy, setLiveOccupancy] = useState<
    Map<string, LiveOccupancyEventPayload>
  >(new Map());

  // Connection state
  const [isConnected, setIsConnected] = useState(() =>
    socketService.isConnected(),
  );

  // Connection error state
  const [connectionError, setConnectionError] = useState<Error | null>(null);

  // Setup event handlers and connect to socket
  useEffect(() => {
    // Only connect if user is authenticated
    if (!isAuthenticated()) {
      return;
    }

    // Setup event handlers before connecting so they're ready when events arrive
    const unsubscribeAlert = socketService.onAlert((payload) => {
      // console.log("SocketAlertsContext: Received alert", payload);
      setAlerts((prev) => [payload, ...prev]);
    });

    // IMPORTANT: Connect to socket after handlers are registered
    socketService.connect();

    // Live occupancy event handler
    const unsubscribeLiveOccupancy = socketService.onLiveOccupancy(
      (payload) => {
        setLiveOccupancy((prev) => {
          const newMap = new Map(prev);
          // Use siteId + zoneId/floorId as map key
          const key = `${payload.siteId}-${payload.zoneId || payload.floorId || "default"}`;
          newMap.set(key, payload);
          return newMap;
        });
      },
    );

    // Connection status event handler
    const unsubscribeConnect = socketService.onConnect(() => {
      setIsConnected(true);
      setConnectionError(null);
    });

    // Disconnection event handler
    const unsubscribeDisconnect = socketService.onDisconnect(() => {
      setIsConnected(false);
    });

    // Error event handler
    const unsubscribeError = socketService.onError((error) => {
      setConnectionError(error);
      setIsConnected(false);
    });

    // Cleanup on unmount (cleanup event handlers and disconnect from socket)
    return () => {
      unsubscribeAlert();
      unsubscribeLiveOccupancy();
      unsubscribeConnect();
      unsubscribeDisconnect();
      unsubscribeError();
      socketService.disconnect();
    };
  }, []);

  // Clear alerts function
  const clearAlerts = () => {
    setAlerts([]);
  };

  return (
    // Socket Alerts Provider Context
    <SocketAlertsContext.Provider
      // Provide context values
      value={{
        alerts,
        liveOccupancy,
        isConnected,
        connectionError,
        clearAlerts,
      }}
    >
      {children}
    </SocketAlertsContext.Provider>
  );
}
