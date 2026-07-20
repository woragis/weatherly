import { siteUrl, SITE } from "@/lib/site";

type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function HomeJsonLd() {
  const base = siteUrl().origin;
  return (
    <JsonLd
      data={[
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: SITE.name,
          url: base,
          description: SITE.tagline,
        },
        {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: SITE.name,
          applicationCategory: "WeatherApplication",
          operatingSystem: "Web",
          url: base,
          description: SITE.tagline,
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "BRL",
          },
        },
      ]}
    />
  );
}

export function BlogPostJsonLd({
  title,
  description,
  url,
  datePublished,
  author,
}: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  author: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: title,
        description,
        datePublished,
        author: { "@type": "Organization", name: author },
        publisher: { "@type": "Organization", name: SITE.name },
        mainEntityOfPage: url,
      }}
    />
  );
}

export function CityWeatherJsonLd({
  cityName,
  state,
  url,
  temperature,
  condition,
}: {
  cityName: string;
  state: string;
  url: string;
  temperature?: number;
  condition?: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: `Clima em ${cityName}, ${state}`,
        description: condition
          ? `Agora em ${cityName}: ${Math.round(temperature ?? 0)}°, ${condition}.`
          : `Previsão do tempo em ${cityName}, ${state}.`,
        url,
        isPartOf: {
          "@type": "WebSite",
          name: SITE.name,
          url: siteUrl().origin,
        },
      }}
    />
  );
}
