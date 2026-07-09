const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 3600],
  ["month", 30 * 24 * 3600],
  ["week", 7 * 24 * 3600],
  ["day", 24 * 3600],
  ["hour", 3600],
  ["minute", 60],
];

export function relativeTime(
  iso: string | null,
  language = "en",
  nowMs = Date.now()
): string {
  if (!iso) {
    return "";
  }
  const then = Date.parse(iso);
  if (Number.isNaN(then)) {
    return "";
  }
  const deltaSeconds = (then - nowMs) / 1000;
  const magnitude = Math.abs(deltaSeconds);
  let formatter: Intl.RelativeTimeFormat;
  try {
    formatter = new Intl.RelativeTimeFormat(language, { numeric: "auto" });
  } catch {
    formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  }
  for (const [unit, seconds] of UNITS) {
    if (magnitude >= seconds) {
      return formatter.format(Math.round(deltaSeconds / seconds), unit);
    }
  }
  return formatter.format(Math.round(deltaSeconds), "second");
}

export function absoluteTime(iso: string | null, language = "en"): string {
  if (!iso) {
    return "";
  }
  const then = Date.parse(iso);
  if (Number.isNaN(then)) {
    return "";
  }
  try {
    return new Intl.DateTimeFormat(language, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(then);
  } catch {
    return new Date(then).toLocaleString();
  }
}

export function hostname(url: string | null | undefined): string {
  if (!url) {
    return "";
  }
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
