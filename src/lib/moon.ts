/** Local moon phase calculation (no API needed). */

export type MoonInfo = {
  /** 0..1 — 0 = nova, 0.5 = cheia */
  phase: number;
  label: string;
  emoji: string;
  /** 0..100 (%) */
  illumination: number;
};

const SYNODIC_MONTH_DAYS = 29.53058867;
/** Lua nova de referência: 2000-01-06 18:14 UTC */
const KNOWN_NEW_MOON_MS = Date.UTC(2000, 0, 6, 18, 14, 0);

export function moonInfo(date: Date = new Date()): MoonInfo {
  const daysSince = (date.getTime() - KNOWN_NEW_MOON_MS) / 86_400_000;
  const phase =
    ((daysSince % SYNODIC_MONTH_DAYS) + SYNODIC_MONTH_DAYS) %
    SYNODIC_MONTH_DAYS /
    SYNODIC_MONTH_DAYS;

  const illumination = Math.round(((1 - Math.cos(2 * Math.PI * phase)) / 2) * 100);

  let label: string;
  let emoji: string;
  if (phase < 0.03 || phase >= 0.97) {
    label = "Lua nova";
    emoji = "🌑";
  } else if (phase < 0.22) {
    label = "Crescente côncava";
    emoji = "🌒";
  } else if (phase < 0.28) {
    label = "Quarto crescente";
    emoji = "🌓";
  } else if (phase < 0.47) {
    label = "Crescente gibosa";
    emoji = "🌔";
  } else if (phase < 0.53) {
    label = "Lua cheia";
    emoji = "🌕";
  } else if (phase < 0.72) {
    label = "Minguante gibosa";
    emoji = "🌖";
  } else if (phase < 0.78) {
    label = "Quarto minguante";
    emoji = "🌗";
  } else {
    label = "Minguante côncava";
    emoji = "🌘";
  }

  return { phase, label, emoji, illumination };
}
