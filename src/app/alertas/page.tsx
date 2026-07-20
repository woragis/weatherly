import { Suspense } from "react";
import { AlertsScreen } from "@/components/alerts-screen";

export const metadata = { title: "Alertas — Weatherly" };

export default function AlertasPage() {
  return (
    <Suspense>
      <AlertsScreen />
    </Suspense>
  );
}
