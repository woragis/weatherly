import { Suspense } from "react";
import { DetailsScreen } from "@/components/details-screen";

export const metadata = { title: "Detalhes do dia — Weatherly" };

export default function DetalhesPage() {
  return (
    <Suspense>
      <DetailsScreen />
    </Suspense>
  );
}
