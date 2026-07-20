export type City = {
  slug: string;
  name: string;
  state: string;
  lat: number;
  lon: number;
};

/** Capitais e grandes cidades BR — URLs estáveis para SEO. */
export const CITIES: City[] = [
  { slug: "rio-branco-ac", name: "Rio Branco", state: "AC", lat: -9.9747, lon: -67.81 },
  { slug: "maceio-al", name: "Maceió", state: "AL", lat: -9.6658, lon: -35.735 },
  { slug: "manaus-am", name: "Manaus", state: "AM", lat: -3.119, lon: -60.0217 },
  { slug: "macapa-ap", name: "Macapá", state: "AP", lat: 0.0349, lon: -51.0694 },
  { slug: "salvador-ba", name: "Salvador", state: "BA", lat: -12.9714, lon: -38.5014 },
  { slug: "fortaleza-ce", name: "Fortaleza", state: "CE", lat: -3.7319, lon: -38.5267 },
  { slug: "brasilia-df", name: "Brasília", state: "DF", lat: -15.7939, lon: -47.8828 },
  { slug: "vitoria-es", name: "Vitória", state: "ES", lat: -20.3155, lon: -40.3128 },
  { slug: "goiania-go", name: "Goiânia", state: "GO", lat: -16.6864, lon: -49.2643 },
  { slug: "sao-luis-ma", name: "São Luís", state: "MA", lat: -2.5307, lon: -44.3068 },
  { slug: "belo-horizonte-mg", name: "Belo Horizonte", state: "MG", lat: -19.9167, lon: -43.9345 },
  { slug: "campo-grande-ms", name: "Campo Grande", state: "MS", lat: -20.4697, lon: -54.6201 },
  { slug: "cuiaba-mt", name: "Cuiabá", state: "MT", lat: -15.601, lon: -56.0974 },
  { slug: "belem-pa", name: "Belém", state: "PA", lat: -1.4558, lon: -48.4902 },
  { slug: "joao-pessoa-pb", name: "João Pessoa", state: "PB", lat: -7.1195, lon: -34.845 },
  { slug: "recife-pe", name: "Recife", state: "PE", lat: -8.0476, lon: -34.877 },
  { slug: "teresina-pi", name: "Teresina", state: "PI", lat: -5.0892, lon: -42.8016 },
  { slug: "curitiba-pr", name: "Curitiba", state: "PR", lat: -25.4284, lon: -49.2733 },
  { slug: "rio-de-janeiro-rj", name: "Rio de Janeiro", state: "RJ", lat: -22.9068, lon: -43.1729 },
  { slug: "natal-rn", name: "Natal", state: "RN", lat: -5.7945, lon: -35.211 },
  { slug: "porto-velho-ro", name: "Porto Velho", state: "RO", lat: -8.7612, lon: -63.9004 },
  { slug: "boa-vista-rr", name: "Boa Vista", state: "RR", lat: 2.8235, lon: -60.6758 },
  { slug: "porto-alegre-rs", name: "Porto Alegre", state: "RS", lat: -30.0346, lon: -51.2177 },
  { slug: "florianopolis-sc", name: "Florianópolis", state: "SC", lat: -27.5954, lon: -48.548 },
  { slug: "aracaju-se", name: "Aracaju", state: "SE", lat: -10.9472, lon: -37.0731 },
  { slug: "sao-paulo-sp", name: "São Paulo", state: "SP", lat: -23.5505, lon: -46.6333 },
  { slug: "palmas-to", name: "Palmas", state: "TO", lat: -10.2491, lon: -48.3243 },
  { slug: "campinas-sp", name: "Campinas", state: "SP", lat: -22.9056, lon: -47.0608 },
  { slug: "guarulhos-sp", name: "Guarulhos", state: "SP", lat: -23.4538, lon: -46.5333 },
  { slug: "santos-sp", name: "Santos", state: "SP", lat: -23.9608, lon: -46.3336 },
  { slug: "niteroi-rj", name: "Niterói", state: "RJ", lat: -22.8833, lon: -43.1036 },
  { slug: "juiz-de-fora-mg", name: "Juiz de Fora", state: "MG", lat: -21.7642, lon: -43.3503 },
  { slug: "uberlandia-mg", name: "Uberlândia", state: "MG", lat: -18.9186, lon: -48.2772 },
  { slug: "londrina-pr", name: "Londrina", state: "PR", lat: -23.3045, lon: -51.1696 },
  { slug: "maringa-pr", name: "Maringá", state: "PR", lat: -23.4205, lon: -51.9333 },
  { slug: "caxias-do-sul-rs", name: "Caxias do Sul", state: "RS", lat: -29.1634, lon: -51.1797 },
  { slug: "ribeirao-preto-sp", name: "Ribeirão Preto", state: "SP", lat: -21.1704, lon: -47.8103 },
  { slug: "sorocaba-sp", name: "Sorocaba", state: "SP", lat: -23.5015, lon: -47.4526 },
  { slug: "feira-de-santana-ba", name: "Feira de Santana", state: "BA", lat: -12.2664, lon: -38.9663 },
  { slug: "joinville-sc", name: "Joinville", state: "SC", lat: -26.3045, lon: -48.8487 },
];

export function listCities(): City[] {
  return CITIES;
}

export function getCity(slug: string): City | null {
  return CITIES.find((c) => c.slug === slug) ?? null;
}

export function cityLabel(city: City): string {
  return `${city.name}, ${city.state}`;
}

export function cityAppHref(city: City): string {
  const label = encodeURIComponent(cityLabel(city));
  return `/?lat=${city.lat}&lon=${city.lon}&label=${label}`;
}
