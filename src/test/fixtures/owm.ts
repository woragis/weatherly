/** Minimal OpenWeatherMap fixtures for integration tests. */

export const owmCurrentFixture = {
  coord: { lat: -7.1153, lon: -34.8631 },
  weather: [
    {
      id: 800,
      main: "Clear",
      description: "céu limpo",
      icon: "01d",
    },
  ],
  main: {
    temp: 28.4,
    feels_like: 30.1,
    humidity: 66,
    temp_min: 26.0,
    temp_max: 30.0,
  },
  wind: { speed: 3.5 },
  sys: {
    country: "BR",
    sunrise: 1721462400,
    sunset: 1721505600,
  },
  name: "João Pessoa",
  dt: 1721484000,
  timezone: -10800,
};

export const owmForecastFixture = {
  list: [
    {
      dt: 1721484000,
      main: { temp: 28.4, temp_min: 27.0, temp_max: 29.0, humidity: 66 },
      weather: [
        { id: 800, main: "Clear", description: "céu limpo", icon: "01d" },
      ],
      pop: 0.1,
      dt_txt: "2024-07-20 12:00:00",
    },
    {
      dt: 1721494800,
      main: { temp: 27.0, temp_min: 26.0, temp_max: 28.0, humidity: 70 },
      weather: [
        { id: 801, main: "Clouds", description: "poucas nuvens", icon: "02d" },
      ],
      pop: 0.2,
      dt_txt: "2024-07-20 15:00:00",
    },
    {
      dt: 1721505600,
      main: { temp: 25.0, temp_min: 24.0, temp_max: 26.0, humidity: 75 },
      weather: [
        { id: 500, main: "Rain", description: "chuva fraca", icon: "10n" },
      ],
      pop: 0.55,
      dt_txt: "2024-07-20 18:00:00",
    },
    {
      dt: 1721570400,
      main: { temp: 29.0, temp_min: 27.0, temp_max: 31.0, humidity: 60 },
      weather: [
        { id: 800, main: "Clear", description: "céu limpo", icon: "01d" },
      ],
      pop: 0.05,
      dt_txt: "2024-07-21 12:00:00",
    },
    {
      dt: 1721581200,
      main: { temp: 30.0, temp_min: 28.0, temp_max: 32.0, humidity: 58 },
      weather: [
        { id: 800, main: "Clear", description: "céu limpo", icon: "01d" },
      ],
      pop: 0.0,
      dt_txt: "2024-07-21 15:00:00",
    },
  ],
  city: {
    name: "João Pessoa",
    country: "BR",
    coord: { lat: -7.1153, lon: -34.8631 },
    timezone: -10800,
    sunrise: 1721462400,
    sunset: 1721505600,
  },
};

export const owmGeocodeFixture = [
  {
    name: "João Pessoa",
    lat: -7.11532,
    lon: -34.861,
    country: "BR",
    state: "Paraíba",
    local_names: { pt: "João Pessoa" },
  },
  {
    name: "João Pinheiro",
    lat: -17.7424,
    lon: -46.1725,
    country: "BR",
    state: "Minas Gerais",
  },
];
