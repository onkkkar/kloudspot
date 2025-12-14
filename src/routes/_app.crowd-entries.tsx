import { createFileRoute } from "@tanstack/react-router";
import { CrowdEntries as CrowdEntriesPage } from "../pages/CrowdEntries";

export const Route = createFileRoute("/_app/crowd-entries")({
  component: CrowdEntries,
});

function CrowdEntries() {
  return <CrowdEntriesPage />;
}
