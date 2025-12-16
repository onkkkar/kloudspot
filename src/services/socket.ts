// WebSocket service for real-time notifications
import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  /**
   * Initialize socket connection
   * @param socketUrl - WebSocket server URL (defaults to env variable or derived from API base URL)
   * @param token - Authentication token for socket connection
   */
  connect(socketUrl?: string, token?: string): Socket {
    // Get socket URL from env or derive from API base URL
    const url =
      socketUrl ||
      import.meta.env.VITE_SOCKET_URL ||
      this.deriveSocketUrl(import.meta.env.VITE_BASE_URL);

    // Get token from parameter or localStorage
    const authToken = token || localStorage.getItem("authToken");

    // Create socket connection with authentication
    this.socket = io(url, {
      auth: {
        token: authToken ? `Bearer ${authToken}` : undefined,
      },
      transports: ["websocket", "polling"], // Fallback to polling if websocket fails
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
      timeout: 20000,
    });

    // Connection event handlers
    this.socket.on("connect", () => {
      console.log("Socket connected:", this.socket?.id);
      this.reconnectAttempts = 0;
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      if (reason === "io server disconnect") {
        // Server disconnected, reconnect manually
        this.socket?.connect();
      }
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      this.reconnectAttempts++;
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error("Max reconnection attempts reached");
      }
    });

    this.socket.on("reconnect", (attemptNumber) => {
      console.log("Socket reconnected after", attemptNumber, "attempts");
      this.reconnectAttempts = 0;
    });

    return this.socket;
  }

  /**
   * Derive WebSocket URL from API base URL
   * Converts https://domain.com/api/ to ws://domain.com or wss://domain.com
   */
  private deriveSocketUrl(apiBaseUrl?: string): string {
    if (!apiBaseUrl) {
      throw new Error(
        "Socket URL not configured. Please set VITE_SOCKET_URL or VITE_BASE_URL",
      );
    }

    try {
      const url = new URL(apiBaseUrl);
      // Convert http/https to ws/wss
      const protocol = url.protocol === "https:" ? "wss:" : "ws:";
      // Remove /api/ path and use base domain
      const host = url.host;
      return `${protocol}//${host}`;
    } catch (error) {
      console.error("Error deriving socket URL:", error);
      throw new Error("Invalid API base URL for socket connection");
    }
  }

  /**
   * Subscribe to notification events
   * @param callback - Function to call when notification is received
   */
  onNotification(callback: (notification: NotificationData) => void): void {
    if (!this.socket) {
      console.error("Socket not connected. Call connect() first.");
      return;
    }

    this.socket.on("notification", (data: NotificationData) => {
      console.log("Notification received:", data);
      callback(data);
    });

    // Also listen for alert events (alternative event name)
    this.socket.on("alert", (data: NotificationData) => {
      console.log("Alert received:", data);
      callback(data);
    });
  }

  /**
   * Subscribe to person entered events
   * @param callback - Function to call when person enters a zone
   */
  onPersonEntered(callback: (data: PersonEnteredData) => void): void {
    if (!this.socket) {
      console.error("Socket not connected. Call connect() first.");
      return;
    }

    this.socket.on("person_entered", (data: PersonEnteredData) => {
      console.log("Person entered event:", data);
      callback(data);
    });
  }

  /**
   * Unsubscribe from an event
   * @param eventName - Name of the event to unsubscribe from
   */
  off(eventName: string): void {
    this.socket?.off(eventName);
  }

  /**
   * Disconnect socket
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log("Socket disconnected");
    }
  }

  /**
   * Get current socket instance
   */
  getSocket(): Socket | null {
    return this.socket;
  }

  /**
   * Check if socket is connected
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

// Notification data interface matching the component's Notification interface
export interface NotificationData {
  id: string;
  date: string; // ISO date string or formatted date
  personName: string;
  zone: string;
  priority: "high" | "medium" | "low";
}

// Person entered event data (alternative format)
export interface PersonEnteredData {
  id?: string;
  timestamp?: string | number;
  personName: string;
  zone: string;
  priority?: "high" | "medium" | "low";
}

// Export singleton instance
export const socketService = new SocketService();
