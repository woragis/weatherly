import type { Metadata } from "next";
import { Suspense } from "react";
import { CitiesScreen } from "@/components/cities-screen";
import { pageMetadata, PAGE_SEO } from "@/lib/site";

export const metadata: Metadata = {
  ...pageMetadata("cidades", "/cidades"),
  title: { absolute: PAGE_SEO.cidades.title },
};

export default function CidadesPage() {
  return (
    <Suspense>
      <CitiesScreen />
    </Suspense>
  );
}
