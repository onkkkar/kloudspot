import { useEffect, useState, useCallback } from "react";
import { socketService } from "../services/socket.service";
import type { AlertEventPayload } from "../types/socket.types";

interface UseSocketAlertsOptions {
  maxAlerts?: number;
  autoClear?: boolean;
  clearInterval?: number;
}

// UseSocketAlerts Hook
export function useSocketAlerts(options: UseSocketAlertsOptions = {}) {
  // Options
  const {
    maxAlerts = 100,
    autoClear = false,
    clearInterval: clearIntervalMs = 300000, // 5 minutes default
  } = options;

  // Alerts state
  const [alerts, setAlerts] = useState<AlertEventPayload[]>([]);

  // Connection state - initialize with current status
  const [isConnected, setIsConnected] = useState(() =>
    socketService.isConnected(),
  );

  // Handle new alert
  const handleAlert = useCallback(
    (payload: AlertEventPayload) => {
      // Update alerts state
      setAlerts((prev) => {
        const newAlerts = [payload, ...prev];
        // Keep only the latest maxAlerts
        return newAlerts.slice(0, maxAlerts);
      });
    },
    [maxAlerts],
  );

  // Clear alerts
  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  useEffect(() => {
    // console.log("useSocketAlerts: Setting up subscriptions");

    // Subscribe to alert events
    const unsubscribeAlert = socketService.onAlert(handleAlert);
    // console.log("useSocketAlerts: Subscribed to alerts");

    // Subscribe to connection status
    const unsubscribeConnect = socketService.onConnect(() => {
      // console.log("useSocketAlerts: Socket connected");
      setIsConnected(true);
    });

    const unsubscribeDisconnect = socketService.onDisconnect(() => {
      // console.log("useSocketAlerts: Socket disconnected");
      setIsConnected(false);
    });

    // Check initial connection status
    // console.log("useSocketAlerts: Initial connection status", socketService.isConnected());

    // Auto-clear old alerts if enabled
    let clearTimer: ReturnType<typeof setInterval> | null = null;
    if (autoClear && clearIntervalMs > 0) {
      clearTimer = setInterval(() => {
        setAlerts((prev) => {
          const now = Date.now();
          // Remove alerts older than clearIntervalMs
          return prev.filter((alert) => {
            const alertTime = alert.ts;
            return now - alertTime < clearIntervalMs;
          });
        });
      }, clearIntervalMs);
    }

    return () => {
      unsubscribeAlert();
      unsubscribeConnect();
      unsubscribeDisconnect();
      if (clearTimer) {
        clearInterval(clearTimer);
      }
    };
  }, [handleAlert, autoClear, clearIntervalMs]);

  return {
    alerts,
    isConnected,
    clearAlerts,
  };
}
