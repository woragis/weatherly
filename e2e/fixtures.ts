import type { WeatherPayload } from "../src/lib/open-weather";

export const mockWeather: WeatherPayload = {
  latitude: -7.1153,
  longitude: -34.8631,
  timezone: "UTC-3",
  locationName: "João Pessoa, BR",
  current: {
    time: "2026-07-20T15:00:00.000Z",
    temperature: 28.4,
    feelsLike: 30.1,
    humidity: 66,
    windSpeed: 12.6,
    weatherCode: 800,
    isDay: true,
    condition: {
      code: 800,
      label: "Céu limpo",
      icon: "sun",
      theme: "clear-day",
    },
  },
  hourly: [
    {
      time: "2026-07-20T15:00:00.000Z",
      temperature: 28,
      weatherCode: 800,
      precipitationProbability: 10,
      condition: {
        code: 800,
        label: "Céu limpo",
        icon: "sun",
        theme: "clear-day",
      },
    },
    {
      time: "2026-07-20T18:00:00.000Z",
      temperature: 26,
      weatherCode: 500,
      precipitationProbability: 40,
      condition: {
        code: 500,
        label: "Chuva",
        icon: "rain",
        theme: "rain",
      },
    },
  ],
  daily: [
    {
      date: "2026-07-20",
      weatherCode: 800,
      tempMax: 31,
      tempMin: 24,
      sunrise: "2026-07-20T09:00:00.000Z",
      sunset: "2026-07-20T21:00:00.000Z",
      condition: {
        code: 800,
        label: "Céu limpo",
        icon: "sun",
        theme: "clear-day",
      },
    },
    {
      date: "2026-07-21",
      weatherCode: 801,
      tempMax: 30,
      tempMin: 23,
      sunrise: "2026-07-21T09:00:00.000Z",
      sunset: "2026-07-21T21:00:00.000Z",
      condition: {
        code: 801,
        label: "Poucas nuvens",
        icon: "cloud-sun",
        theme: "cloudy",
      },
    },
  ],
};

export const mockGeocode = {
  results: [
    {
      id: 1,
      name: "Recife",
      latitude: -8.0476,
      longitude: -34.877,
      country: "BR",
      admin1: "Pernambuco",
      label: "Recife, Pernambuco, BR",
    },
  ],
};

export const mockWeatherRecife: WeatherPayload = {
  ...mockWeather,
  locationName: "Recife, BR",
  latitude: -8.0476,
  longitude: -34.877,
  current: {
    ...mockWeather.current,
    temperature: 31.2,
    condition: {
      code: 801,
      label: "Poucas nuvens",
      icon: "cloud-sun",
      theme: "cloudy",
    },
  },
};
