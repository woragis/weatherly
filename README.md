# Weatherly (`saas-weatherly`)

App de clima focado em **portfólio / utilidade**: UI/UX, APIs externas, geolocalização e cache. Não é um produto de assinatura — o prefixo `saas-` é só o nome do repo.

> Status: MVP web + mobile (Expo submodule)

| Repo | URL |
|------|-----|
| Web + BFF | https://github.com/woragis/saas-weatherly |
| Mobile (submodule `mobile/`) | https://github.com/woragis/saas-weatherly-mobile |

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
npm test              # unit + integration (Vitest)
npm run test:unit
npm run test:e2e      # Playwright
```

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

## API interna (BFF)

| Rota | Query | Descrição |
|------|-------|-----------|
| `GET /api/weather` | `lat`, `lon` | Previsão normalizada |
| `GET /api/geocode` | `q` | Busca de cidades |

Upstream: [OpenWeatherMap](https://openweathermap.org/api) — key só no servidor.

## Stack

- **Web:** Next.js + TypeScript + Tailwind + Vitest + Playwright
- **Mobile:** Expo + Expo Router + TypeScript + expo-location
- Fontes web: DM Sans + Outfit

## Estrutura

```
src/             # Next app + API
e2e/             # Playwright
mobile/          # git submodule → saas-weatherly-mobile
```

## Roadmap

Radar, AQI, alertas, favoritos, ads, widgets — depois do smoke OWM estável.
