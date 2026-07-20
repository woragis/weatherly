export type PostBlock =
  | { kind: "p"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "quote"; text: string };

export type Post = {
  slug: string;
  title: string;
  kicker: string;
  excerpt: string;
  date: string;
  readMinutes: number;
  author: string;
  body: PostBlock[];
  seoTitle?: string;
  seoDescription?: string;
  canonicalPath?: string;
};

export const POSTS: Post[] = [
  {
    slug: "como-ler-uv-e-qualidade-do-ar",
    title: "Como ler UV e qualidade do ar sem virar meteorologista",
    seoTitle: "Índice UV e AQI explicados — Weatherly",
    seoDescription:
      "O que significam as escalas de UV e AQI (1–5), quando se proteger do sol e quando a qualidade do ar pede atenção.",
    kicker: "Saúde",
    excerpt:
      "Dois números que aparecem nos detalhes do dia — e o que fazer com eles na prática.",
    date: "2026-07-15",
    readMinutes: 5,
    author: "Weatherly",
    canonicalPath: "/blog/como-ler-uv-e-qualidade-do-ar",
    body: [
      {
        kind: "p",
        text: "No Weatherly, a tela de detalhes mostra o índice UV (via Open-Meteo) e a qualidade do ar AQI da OpenWeatherMap. Eles não são decoração: mudam o que você veste, se sai ao meio-dia e se vale fechar a janela.",
      },
      { kind: "h2", text: "UV: de baixo a extremo" },
      {
        kind: "p",
        text: "Abaixo de 3, o risco é baixo. De 3 a 5, moderado — protetor ainda ajuda em exposição longa. De 6 a 7 é alto; 8 a 10 muito alto; 11+ extremo. O valor “máximo do dia” costuma ser mais útil que o “agora” se você planeja a tarde.",
      },
      {
        kind: "quote",
        text: "UV alto não precisa de nuvem zerada: céu parcialmente nublado ainda queima.",
      },
      { kind: "h2", text: "AQI na escala OpenWeatherMap" },
      {
        kind: "p",
        text: "A OWM usa 1 (boa) a 5 (muito ruim). Olhe também PM2.5 e PM10 nos detalhes: partículas finas afetam quem tem asma ou treina ao ar livre. Em 4–5, prefira corrida indoor ou horários mais limpos.",
      },
      {
        kind: "p",
        text: "Resumo: UV guia proteção solar; AQI guia ar que você respira. Os dois juntos contam o dia melhor que só a temperatura.",
      },
    ],
  },
  {
    slug: "probabilidade-de-chuva-o-que-significa",
    title: "Probabilidade de chuva: o que aqueles % realmente dizem",
    seoTitle: "Probabilidade de chuva (%) explicada — Weatherly",
    seoDescription:
      "Entenda o pop da previsão horária: chance de precipitação no intervalo, não intensidade. Quando levar guarda-chuva de verdade.",
    kicker: "Previsão",
    excerpt:
      "60% não significa “vai chover 60% do tempo”. O número do hourly tem regra própria.",
    date: "2026-07-10",
    readMinutes: 4,
    author: "Weatherly",
    canonicalPath: "/blog/probabilidade-de-chuva-o-que-significa",
    body: [
      {
        kind: "p",
        text: "Na faixa horária do Weatherly, cada cartão pode mostrar uma porcentagem. Ela vem do campo de probabilidade de precipitação do modelo (pop): a chance de cair alguma chuva mensurável naquele intervalo, na área da previsão.",
      },
      { kind: "h2", text: "Chance ≠ intensidade" },
      {
        kind: "p",
        text: "80% pode ser um chuvisco curto ou um temporal — a % sozinha não diz o volume. Por isso cruzamos com o radar e com o tema visual (chuva/tempestade) quando a condição muda.",
      },
      {
        kind: "quote",
        text: "Acima de ~50% nas próximas horas, o alerta de chuva do app sugere guarda-chuva. Acima de 75%, o tom sobe.",
      },
      { kind: "h2", text: "Como usar no dia a dia" },
      {
        kind: "p",
        text: "Olhe o pico nas próximas 3–4 horas, não só o “agora”. Se o pico é 70% às 17h e você sai às 16h30, planeje. Se o pico é 30% espalhado, dá para improvisar.",
      },
    ],
  },
  {
    slug: "por-que-bff-e-cache-no-app-de-clima",
    title: "Por que um app de clima precisa de BFF e cache",
    seoTitle: "BFF e cache em app de clima — Weatherly",
    seoDescription:
      "Por que a key da OpenWeatherMap fica no servidor Next.js, como o cache de ~15 min funciona e o que o mobile Expo consome.",
    kicker: "Engenharia",
    excerpt:
      "A previsão parece simples no celular. Por baixo, a key nunca sobe no cliente — e o cache evita estourar o free tier.",
    date: "2026-07-05",
    readMinutes: 6,
    author: "Weatherly",
    canonicalPath: "/blog/por-que-bff-e-cache-no-app-de-clima",
    body: [
      {
        kind: "p",
        text: "O Weatherly web e o Expo falam com Route Handlers do Next.js (`/api/weather`, `/api/geocode`, `/api/details`). Isso é um BFF: o browser e o celular nunca recebem a OPENWEATHERMAP_API_KEY.",
      },
      { kind: "h2", text: "Key só no servidor" },
      {
        kind: "p",
        text: "Se a key fosse embutida no JS do cliente, qualquer um leria no DevTools e consumiria sua cota. No BFF, a key vive em variável de ambiente (local `.env.local`, produção Vercel).",
      },
      {
        kind: "quote",
        text: "Mesma API para web e mobile: o Expo só muda o EXPO_PUBLIC_API_BASE.",
      },
      { kind: "h2", text: "Cache ~15 minutos" },
      {
        kind: "p",
        text: "Clima não muda a cada segundo. Usamos fetch com revalidate em torno de 900s. Isso reduz chamadas upstream, acelera respostas repetidas e mantém o free tier saudável — sem mentir “tempo real absoluto”.",
      },
      {
        kind: "p",
        text: "Páginas SEO como `/clima/joao-pessoa-pb` chamam a mesma lib `fetchForecast` no servidor: HTML com temperatura real para o crawler, e um link para abrir o app interativo.",
      },
    ],
  },
];

export function listPosts(): Post[] {
  return POSTS;
}

export function getPost(slug: string): Post | null {
  return POSTS.find((p) => p.slug === slug) ?? null;
}

export function postMetadata(post: Post) {
  const title = post.seoTitle ?? `${post.title} — Weatherly`;
  const description = post.seoDescription ?? post.excerpt;
  const canonical = post.canonicalPath ?? `/blog/${post.slug}`;
  return { title, description, canonical, publishedAt: post.date };
}
