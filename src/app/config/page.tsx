import type { Metadata } from "next";
import { Suspense } from "react";
import { SettingsScreen } from "@/components/settings-screen";
import { pageMetadata, PAGE_SEO } from "@/lib/site";

export const metadata: Metadata = {
  ...pageMetadata("config", "/config"),
  title: { absolute: PAGE_SEO.config.title },
};

export default function ConfigPage() {
  return (
    <Suspense>
      <SettingsScreen />
    </Suspense>
  );
}
