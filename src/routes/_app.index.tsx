import { createFileRoute } from "@tanstack/react-router";
import { Overview } from "../pages/Overview";

export const Route = createFileRoute("/_app/")({
  component: Home,
});

function Home() {
  return <Overview />;
}
