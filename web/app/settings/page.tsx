import { RouteShell } from "@/components/route-shell";

export default function SettingsPage() {
  return (
    <RouteShell
      route="/settings"
      title="Settings placeholder"
      description="This page reserves the user settings surface for account, preferences, and content-source management once auth and persistence are in place."
      bullets={[
        "Future home for account controls and source management.",
        "Route exists now so navigation and IA stay stable.",
        "No settings forms or data access are implemented yet.",
      ]}
    />
  );
}
