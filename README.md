# Weatherly

App de clima focado em **portfólio / utilidade**: UI/UX, APIs externas, geolocalização e cache. Não é um SaaS.

> Status: MVP web — sandbox / portfólio (rebrand do weather-app)

## Posicionamento

- Demonstrar qualidade técnica e visual (referência: Apple Weather)
- Dados via **OpenWeatherMap** (plano gratuito; key em `.env.local`)
- **Sem IA** no curto prazo
- **Mobile** (Expo) fica para depois — pasta `mobile/` reservada (futuro submodule)

## MVP (agora)

- Temperatura atual, condição, máxima/mínima
- Sensação térmica, umidade, vento
- Previsão horária (~24h) e diária (7 dias)
- Geolocalização do navegador + busca de cidade
- Estados de loading, erro de GPS e erro de API
- Atmosfera (gradiente) que muda com condição e dia/noite
- Animações leves (entrada do hero, dica de scroll, transição de fundo)
- Route Handlers Next.js com cache ~15 min

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
| Mobile | App Expo em `mobile/` (submodule / workspace separado) |

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- OpenWeatherMap Current + 5-day/3-hour Forecast + Geocoding
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
mobile/          # Reservado para Expo (futuro)
```
