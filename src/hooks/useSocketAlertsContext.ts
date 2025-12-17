import { useContext } from "react";
import { SocketAlertsContext } from "../types/socketAlertsContext";

// UseSocketAlertsContext Hook
export function useSocketAlertsContext() {
  // Get Context from SocketAlertsContext
  const context = useContext(SocketAlertsContext);

  // Throw error if context is undefined
  if (context === undefined) {
    throw new Error(
      "useSocketAlertsContext must be used within a SocketAlertsProvider",
    );
  }
  // Return context
  return context;
}
