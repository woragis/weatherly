# Weatherly

App de clima focado em **portfólio / utilidade**: UI/UX, APIs externas, geolocalização e cache. Não é um SaaS.

> Status: MVP web — sandbox / portfólio (rebrand do weather-app)

## Posicionamento

- Demonstrar qualidade técnica e visual (referência: Apple Weather)
- Dados via **OpenWeatherMap** (plano gratuito; key em `.env.local`)
- **Sem IA** no curto prazo
- **Mobile** (Expo) **adiado** até key OWM ok + testes verdes — ver [`mobile/README.md`](mobile/README.md)

## MVP (agora)

- Temperatura atual, condição, máxima/mínima
- Sensação térmica, umidade, vento
- Previsão horária (~24h) e diária (7 dias)
- Geolocalização do navegador + busca de cidade
- Estados de loading, erro de GPS e erro de API
- Atmosfera (gradiente) que muda com condição e dia/noite
- Animações leves (entrada do hero, dica de scroll, transição de fundo)
- Route Handlers Next.js com cache ~15 min

## Smoke manual

Com `OPENWEATHERMAP_API_KEY` válida (keys novas do free tier podem levar até ~2h):

```bash
npm run dev
```

1. Permitir GPS → cidade + temperatura
2. Buscar outra cidade
3. Conferir hourly + daily
4. Negar GPS (ou janela privada) → fallback + busca ainda funciona

Se a API responder `401`, a key ainda não está ativa ou é inválida.

## Testes

```bash
npm test              # unit + integration (Vitest)
npm run test:unit     # só format + mapWeatherCode
npm run test:e2e      # Playwright (sobe o Next automaticamente)
```

- **Unit:** `src/lib/format.test.ts`, `src/lib/open-weather.map.test.ts`
- **Integration:** fixtures OWM + Route Handlers (fetch mockado)
- **E2E:** `e2e/` com mocks de `/api/*` e geolocation fake/denied

## Fora do escopo (MVP)

Radar, AQI, alertas push, favoritos, anúncios, IA, app mobile

## Roadmap (depois)

| Área | Ideias |
|------|--------|
| Contexto | Radar, AQI / pólen / UV, nascer-pôr do sol, fase da lua |
| Alertas | Notificações práticas (“vai chover em 30 min”) |
| Extras | Comparar cidades, favoritos, widgets, modo viagem |
| Monetização | Ads opcionais, se fizer sentido |
| IA | Só se agregar perguntas práticas sobre dados já carregados — não é prioridade |
| Mobile | Expo em `mobile/` — **depois** dos testes e smoke OWM |

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- OpenWeatherMap Current + 5-day/3-hour Forecast + Geocoding
- Vitest + Playwright
- Fontes: DM Sans + Outfit

## Como rodar

```bash
cp .env.example .env.local
# cole sua OPENWEATHERMAP_API_KEY no .env.local

npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # produção
npm start
```

## API interna

| Rota | Query | Descrição |
|------|-------|-----------|
| `GET /api/weather` | `lat`, `lon` | Previsão normalizada (current, hourly ~24h/3h, daily) |
| `GET /api/geocode` | `q` | Busca de cidades |

Upstream: [OpenWeatherMap](https://openweathermap.org/api) — key só no servidor (`.env.local`, nunca commitada).

## Estrutura

```
src/app/api/     # Route Handlers
src/components/  # UI do clima
src/hooks/       # Geolocalização
src/lib/         # OpenWeatherMap + formatação
src/test/        # Fixtures de teste
e2e/             # Playwright
mobile/          # Reservado para Expo (adiado)
```
