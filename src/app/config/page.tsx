import { Suspense } from "react";
import { SettingsScreen } from "@/components/settings-screen";

export const metadata = { title: "Ajustes — Weatherly" };

export default function ConfigPage() {
  return (
    <Suspense>
      <SettingsScreen />
    </Suspense>
  );
}
