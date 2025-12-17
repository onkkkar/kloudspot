import { useEffect, useState, useCallback } from "react";
import { socketService } from "../services/socket.service";
import type { LiveOccupancyEventPayload } from "../types/socket.types";

// UseLiveOccupancy Options
interface UseLiveOccupancyOptions {
  siteId?: string;
  zoneId?: string;
  floorId?: string;
}

// UseLiveOccupancy Hook
export function useLiveOccupancy(options: UseLiveOccupancyOptions = {}) {
  // Options
  const { siteId, zoneId, floorId } = options;

  // Occupancy state
  const [occupancy, setOccupancy] = useState<
    Map<string, LiveOccupancyEventPayload>
  >(new Map());

  // Connection state
  const [isConnected, setIsConnected] = useState(false);

  // Handle live occupancy update
  const handleLiveOccupancy = useCallback(
    (payload: LiveOccupancyEventPayload) => {
      // Apply filters if provided
      if (siteId && payload.siteId !== siteId) {
        return;
      }
      if (zoneId && payload.zoneId !== zoneId) {
        return;
      }
      if (floorId && payload.floorId !== floorId) {
        return;
      }

      // Update occupancy state
      setOccupancy((prev) => {
        const newMap = new Map(prev);
        // siteId + zoneId/floorId as map key
        const key = `${payload.siteId}-${payload.zoneId || payload.floorId || "default"}`;

        // Set new map
        newMap.set(key, payload);

        // Return new map
        return newMap;
      });
    },
    [siteId, zoneId, floorId],
  );

  // Get occupancy for specific site/zone/floor
  const getOccupancy = useCallback(
    (targetSiteId?: string, targetZoneId?: string, targetFloorId?: string) => {
      const key = `${targetSiteId || siteId || ""}-${targetZoneId || targetFloorId || "default"}`;
      return occupancy.get(key);
    },
    [occupancy, siteId],
  );

  // Get all occupancies for a site
  const getSiteOccupancy = useCallback(
    (targetSiteId?: string) => {
      const target = targetSiteId || siteId;
      if (!target) return [];

      const results: LiveOccupancyEventPayload[] = [];
      occupancy.forEach((value) => {
        if (value.siteId === target) {
          results.push(value);
        }
      });
      return results;
    },
    [occupancy, siteId],
  );

  useEffect(() => {
    // Subscribe to live occupancy events
    const unsubscribeLiveOccupancy =
      socketService.onLiveOccupancy(handleLiveOccupancy);

    // Subscribe to connection status
    const unsubscribeConnect = socketService.onConnect(() => {
      setIsConnected(true);
    });

    const unsubscribeDisconnect = socketService.onDisconnect(() => {
      setIsConnected(false);
    });

    // Check initial connection status
    // setIsConnected(socketService.isConnected());

    return () => {
      unsubscribeLiveOccupancy();
      unsubscribeConnect();
      unsubscribeDisconnect();
    };
  }, [handleLiveOccupancy]);

  return {
    occupancy,
    isConnected,
    getOccupancy,
    getSiteOccupancy,
  };
}
