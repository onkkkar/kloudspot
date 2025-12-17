import { io, Socket } from "socket.io-client";
import type {
  AlertEventPayload,
  LiveOccupancyEventPayload,
} from "../types/socket.types";

type AlertEventHandler = (payload: AlertEventPayload) => void;
type LiveOccupancyEventHandler = (payload: LiveOccupancyEventPayload) => void;
type ConnectEventHandler = () => void;
type DisconnectEventHandler = () => void;
type ErrorEventHandler = (error: Error) => void;

class SocketService {
  private socket: Socket | null = null;
  private baseURL: string;
  private isConnecting = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  // Event handlers
  private alertHandlers: Set<AlertEventHandler> = new Set();
  private liveOccupancyHandlers: Set<LiveOccupancyEventHandler> = new Set();
  private connectHandlers: Set<ConnectEventHandler> = new Set();
  private disconnectHandlers: Set<DisconnectEventHandler> = new Set();
  private errorHandlers: Set<ErrorEventHandler> = new Set();

  constructor() {
    // Get base URL from environment, same as API interceptor
    this.baseURL = import.meta.env.VITE_BASE_URL || "";

    // Remove trailing slash and /api if present for socket connection
    // Socket.IO typically connects to the root, not /api
    this.baseURL = this.baseURL.replace(/\/api\/?$/, "").replace(/\/$/, "");
  }

  // Connect to Socket.IO server with JWT authentication

  connect(): void {
    if (this.socket?.connected || this.isConnecting) {
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      console.warn("Socket.IO: No auth token found, cannot connect");
      return;
    }

    if (!this.baseURL) {
      console.error("Socket.IO: Base URL not configured");
      return;
    }

    this.isConnecting = true;

    try {
      this.socket = io(this.baseURL, {
        auth: {
          token: token,
        },
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
      });

      this.setupEventListeners();
    } catch (error) {
      console.error("Socket.IO: Connection error", error);
      this.isConnecting = false;
      this.handleError(error as Error);
    }
  }

  // Setup Socket.IO event listeners
  private setupEventListeners(): void {
    if (!this.socket) return;

    // Connection established
    this.socket.on("connect", () => {
      // console.log("Socket.IO: Connected", this.socket?.id);
      // console.log("Socket.IO: Alert handlers registered", this.alertHandlers.size);
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      this.connectHandlers.forEach((handler) => handler());
    });

    // Connection lost
    this.socket.on("disconnect", () => {
      // console.log("Socket.IO: Disconnected");
      this.isConnecting = false;
      this.disconnectHandlers.forEach((handler) => handler());
    });

    // Connection error
    this.socket.on("connect_error", (error) => {
      console.error("Socket.IO: Connection error", error);
      this.isConnecting = false;
      this.reconnectAttempts++;

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        this.handleError(
          new Error("Socket.IO: Max reconnection attempts reached"),
        );
      }
    });

    // Alert event - entry/exit events
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.socket.on("alert", (payload: any) => {
      // console.log("Socket.IO: Alert event received", payload);
      // console.log("Socket.IO: Payload keys", Object.keys(payload));
      // console.log("Socket.IO: Number of alert handlers", this.alertHandlers.size);
      // Ensure payload matches expected structure
      const alertPayload: AlertEventPayload = {
        ts: payload.ts,
        eventId: payload.eventId,
        direction: payload.direction,
        personName: payload.personName || "Unknown",
        severity: payload.severity,
        siteId: payload.siteId,
        zoneId: payload.zoneId,
        zoneName: payload.zoneName || payload.zone?.name || payload.zoneName,
        placeName: payload.placeName || payload.place?.name || payload.location,
      };
      // console.log("Socket.IO: Normalized alert payload", alertPayload);
      this.alertHandlers.forEach((handler) => {
        // console.log("Socket.IO: Calling alert handler");
        handler(alertPayload);
      });
    });

    // Live occupancy event - occupancy updates
    this.socket.on("liveOccupancy", (payload: LiveOccupancyEventPayload) => {
      // console.log("Socket.IO: Live occupancy event received", payload);
      this.liveOccupancyHandlers.forEach((handler) => handler(payload));
    });

    // Error event
    this.socket.on("error", (error: Error) => {
      console.error("Socket.IO: Error event", error);
      this.handleError(error);
    });
  }

  // Disconnect from Socket.IO server
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnecting = false;
      this.reconnectAttempts = 0;
    }
  }

  // Check if socket is connected
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  // Subscribe to alert events
  onAlert(handler: AlertEventHandler): () => void {
    // console.log("Socket.IO: Adding alert handler, current count:", this.alertHandlers.size);
    this.alertHandlers.add(handler);
    // console.log("Socket.IO: Alert handler added, new count:", this.alertHandlers.size);
    return () => {
      this.alertHandlers.delete(handler);
      // console.log("Socket.IO: Alert handler removed, count:", this.alertHandlers.size);
    };
  }

  // Subscribe to live occupancy events
  onLiveOccupancy(handler: LiveOccupancyEventHandler): () => void {
    this.liveOccupancyHandlers.add(handler);
    return () => {
      this.liveOccupancyHandlers.delete(handler);
    };
  }

  // Subscribe to connect events
  onConnect(handler: ConnectEventHandler): () => void {
    this.connectHandlers.add(handler);
    return () => {
      this.connectHandlers.delete(handler);
    };
  }

  // Subscribe to disconnect events
  onDisconnect(handler: DisconnectEventHandler): () => void {
    this.disconnectHandlers.add(handler);
    return () => {
      this.disconnectHandlers.delete(handler);
    };
  }

  // Subscribe to error events
  onError(handler: ErrorEventHandler): () => void {
    this.errorHandlers.add(handler);
    return () => {
      this.errorHandlers.delete(handler);
    };
  }

  // Handle errors and notify all error handlers
  private handleError(error: Error): void {
    this.errorHandlers.forEach((handler) => handler(error));
  }

  // Get current socket instance (for advanced usage)
  getSocket(): Socket | null {
    return this.socket;
  }
}

// Export singleton instance
export const socketService = new SocketService();
