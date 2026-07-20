import type { Metadata } from "next";
import { Suspense } from "react";
import { DetailsScreen } from "@/components/details-screen";
import { pageMetadata, PAGE_SEO } from "@/lib/site";

export const metadata: Metadata = {
  ...pageMetadata("detalhes", "/detalhes"),
  title: { absolute: PAGE_SEO.detalhes.title },
};

export default function DetalhesPage() {
  return (
    <Suspense>
      <DetailsScreen />
    </Suspense>
  );
}
