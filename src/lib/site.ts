/**
 * Site URL helpers for metadata / sitemap / robots.
 * Prefer APP_URL in production (Vercel env).
 */
export function siteUrl(): URL {
  const raw =
    process.env.APP_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://saas-weatherly.vercel.app";
  try {
    return new URL(raw.endsWith("/") ? raw.slice(0, -1) : raw);
  } catch {
    return new URL("https://saas-weatherly.vercel.app");
  }
}

export const SITE = {
  name: "Weatherly",
  tagline: "Clima com clareza — previsão atual, horária e diária.",
  locale: "pt_BR",
} as const;

export const PAGE_SEO = {
  home: {
    title: "Weatherly — clima com clareza",
    description:
      "Previsão do tempo clara: temperatura, umidade, vento, próximas horas e 7 dias. Geolocalização ou busca de cidade. Grátis.",
  },
  detalhes: {
    title: "Detalhes do dia — Weatherly",
    description:
      "Qualidade do ar (AQI), índice UV, nascer e pôr do sol, fase da lua e condições extras do dia.",
  },
  radar: {
    title: "Radar de chuva — Weatherly",
    description:
      "Radar de precipitação em tempo real na sua região, com legenda de intensidade.",
  },
  cidades: {
    title: "Minhas cidades — Weatherly",
    description:
      "Salve cidades favoritas e compare temperatura, umidade e vento lado a lado.",
  },
  alertas: {
    title: "Alertas — Weatherly",
    description:
      "Avisos de chuva, vento forte, UV alto e temperatura extrema derivados da previsão.",
  },
  config: {
    title: "Ajustes — Weatherly",
    description:
      "Unidades de temperatura (°C/°F), vento (km/h ou m/s) e preferências de aparência.",
  },
  blog: {
    title: "Blog — Weatherly",
    description:
      "Guias práticos sobre UV, AQI, probabilidade de chuva e como lemos o clima no app.",
  },
  climaIndex: {
    title: "Clima por cidade — Weatherly",
    description:
      "Previsão do tempo nas principais cidades do Brasil: temperatura atual, condição e próximos dias.",
  },
} as const;

export function pageMetadata(key: keyof typeof PAGE_SEO, path: string) {
  const page = PAGE_SEO[key];
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: path },
    openGraph: {
      title: page.title,
      description: page.description,
      url: path,
      type: "website" as const,
      locale: SITE.locale,
      siteName: SITE.name,
    },
    twitter: {
      card: "summary_large_image" as const,
      title: page.title,
      description: page.description,
    },
  };
}
