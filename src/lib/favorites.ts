"use client";

export type FavoritePlace = {
  label: string;
  latitude: number;
  longitude: number;
};

const STORAGE_KEY = "weatherly:favorites";

export function getFavorites(): FavoritePlace[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as FavoritePlace[]) : [];
  } catch {
    return [];
  }
}

function save(list: FavoritePlace[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

export function isFavorite(list: FavoritePlace[], place: FavoritePlace): boolean {
  return list.some(
    (f) =>
      Math.abs(f.latitude - place.latitude) < 0.001 &&
      Math.abs(f.longitude - place.longitude) < 0.001
  );
}

export function addFavorite(place: FavoritePlace): FavoritePlace[] {
  const list = getFavorites();
  if (isFavorite(list, place)) return list;
  const next = [...list, place];
  save(next);
  return next;
}

export function removeFavorite(place: FavoritePlace): FavoritePlace[] {
  const next = getFavorites().filter(
    (f) =>
      !(
        Math.abs(f.latitude - place.latitude) < 0.001 &&
        Math.abs(f.longitude - place.longitude) < 0.001
      )
  );
  save(next);
  return next;
}
