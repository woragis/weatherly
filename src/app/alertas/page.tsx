import type { Metadata } from "next";
import { Suspense } from "react";
import { AlertsScreen } from "@/components/alerts-screen";
import { pageMetadata, PAGE_SEO } from "@/lib/site";

export const metadata: Metadata = {
  ...pageMetadata("alertas", "/alertas"),
  title: { absolute: PAGE_SEO.alertas.title },
};

export default function AlertasPage() {
  return (
    <Suspense>
      <AlertsScreen />
    </Suspense>
  );
}
