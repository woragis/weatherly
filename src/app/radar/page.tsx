import { Suspense } from "react";
import { RadarScreen } from "@/components/radar-screen";

export const metadata = { title: "Radar — Weatherly" };

export default function RadarPage() {
  return (
    <Suspense>
      <RadarScreen />
    </Suspense>
  );
}
