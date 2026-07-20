import { Suspense } from "react";
import { CitiesScreen } from "@/components/cities-screen";

export const metadata = { title: "Minhas cidades — Weatherly" };

export default function CidadesPage() {
  return (
    <Suspense>
      <CitiesScreen />
    </Suspense>
  );
}
