# Weatherly (`saas-weatherly`)

App de clima focado em **portfólio / utilidade**: UI/UX, APIs externas, geolocalização e cache. Não é um produto de assinatura — o prefixo `saas-` é só o nome do repo.

> Status: MVP web + mobile (Expo submodule) · **web em produção na Vercel**

| Repo | URL |
|------|-----|
| Web + BFF | https://github.com/woragis/saas-weatherly |
| Mobile (submodule `mobile/`) | https://github.com/woragis/saas-weatherly-mobile |
| **Demo (produção)** | https://saas-weatherly.vercel.app |

## Clone

```bash
git clone --recurse-submodules git@github.com:woragis/saas-weatherly.git
cd saas-weatherly

# se já clonou sem submodules:
git submodule update --init --recursive
```

## Posicionamento

- Demonstrar qualidade técnica e visual (referência: Apple Weather)
- Dados via **OpenWeatherMap** (plano gratuito; key em `.env.local` **só no web**)
- **Sem IA** no curto prazo
- Mobile Expo consome as Route Handlers deste repo (BFF) — ver [`mobile/README.md`](mobile/README.md)

## MVP web

- Temperatura atual, condição, máxima/mínima
- Sensação térmica, umidade, vento
- Previsão horária (~24h) e diária (7 dias)
- Geolocalização + busca de cidade
- Estados de loading, erro de GPS e erro de API
- Atmosfera por condição + animações leves
- Route Handlers Next.js com cache ~15 min

## MVP mobile

Mesma superfície útil no Expo (`mobile/`): hero, métricas, hourly, daily, GPS, busca, temas.

## Deploy (Vercel)

Projeto: `saas-weatherly` · alias: https://saas-weatherly.vercel.app

```bash
vercel link --yes --project saas-weatherly
vercel env add OPENWEATHERMAP_API_KEY   # Production / Preview / Development
vercel --prod
```

**Env obrigatória:**

| Variável | Escopo | Notas |
|----------|--------|--------|
| `OPENWEATHERMAP_API_KEY` | Production, Preview, Development | Free tier OWM; só no servidor |
| `APP_URL` | Production/Preview: `https://saas-weatherly.vercel.app` · Dev: `http://localhost:3000` | metadataBase, sitemap, robots |

Mobile em produção: `EXPO_PUBLIC_API_BASE=https://saas-weatherly.vercel.app`

## Smoke manual (web)

Com `OPENWEATHERMAP_API_KEY` válida (keys novas do free tier podem levar até ~2h):

```bash
npm run dev
```

1. Permitir GPS → cidade + temperatura  
2. Buscar outra cidade  
3. Conferir hourly + daily  
4. Negar GPS → fallback + busca ainda funciona  

Se a API responder `401`, a key ainda não está ativa ou é inválida.

## Testes (web)

```bash
npm test              # unit + integration (Vitest) — 39+ cases
npm run test:unit
npm run test:e2e      # Playwright (home + SEO: blog, clima, robots, sitemap)
```

### Checklist visual / qualidade (manual)

1. Favicon / Apple icon (gradiente + W) no browser
2. Home → links “Clima por cidade” e “Blog” acima da nav
3. `/clima/joao-pessoa-pb` e um post do `/blog` no mobile viewport
4. Opcional: Lighthouse na home (Performance/SEO) — CI automatizado ainda não

## Como rodar web + mobile

```bash
# terminal 1 — BFF
cp .env.example .env.local   # OPENWEATHERMAP_API_KEY
npm install && npm run dev

# terminal 2 — Expo
cd mobile
cp .env.example .env         # EXPO_PUBLIC_API_BASE=http://localhost:3000
npm install && npm start
```

Device físico: use o IP da LAN no `EXPO_PUBLIC_API_BASE`. Emulador Android: `http://10.0.2.2:3000`.

## Telas (web + mobile)

**MVP:** home (hero, métricas, hourly, daily), busca de cidade, loading/erro/GPS negado.

**Roadmap já na UI:**

| Rota web | Aba mobile | Conteúdo |
|----------|------------|----------|
| `/detalhes` | Detalhes | AQI, UV, sol/lua, condições |
| `/radar` | Radar | RainViewer embed |
| `/cidades` | Cidades | Favoritos + comparação |
| `/alertas` | Alertas | Alertas derivados + preferências |
| `/config` | Ajustes | Unidades (°C/°F, km/h/m/s) |

**SEO (web):**

| Rota | Conteúdo |
|------|----------|
| `/clima` | Índice de cidades BR |
| `/clima/[slug]` | Previsão SSR + metadata dinâmica (OWM) |
| `/blog` | Lista de posts |
| `/blog/[slug]` | Artigo + JSON-LD |
| `/robots.txt` / `/sitemap.xml` | Crawlers |

## API interna (BFF)

| Rota | Query | Descrição |
|------|-------|-----------|
| `GET /api/weather` | `lat`, `lon` | Previsão normalizada |
| `GET /api/geocode` | `q` | Busca de cidades |
| `GET /api/details` | `lat`, `lon` | AQI (OWM), UV (Open-Meteo), sol/lua, condições |

Upstream principal: [OpenWeatherMap](https://openweathermap.org/api) — key só no servidor. UV via Open-Meteo (sem key). Radar via RainViewer (embed).

## Stack

- **Web:** Next.js + TypeScript + Tailwind + Vitest + Playwright
- **Mobile:** Expo SDK 54 + Expo Router + TypeScript + expo-location + WebView
- Fontes web: DM Sans + Outfit

## Estrutura

```
src/             # Next app + API
e2e/             # Playwright
prototipos-uiux/ # HTML/CSS de referência visual
mobile/          # git submodule → saas-weatherly-mobile
```

## Roadmap restante

Notificações push, ads, widgets, modo viagem — depois do smoke OWM estável.
