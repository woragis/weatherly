import type { Metadata } from "next";
import { Suspense } from "react";
import { RadarScreen } from "@/components/radar-screen";
import { pageMetadata, PAGE_SEO } from "@/lib/site";

export const metadata: Metadata = {
  ...pageMetadata("radar", "/radar"),
  title: { absolute: PAGE_SEO.radar.title },
};

export default function RadarPage() {
  return (
    <Suspense>
      <RadarScreen />
    </Suspense>
  );
}
