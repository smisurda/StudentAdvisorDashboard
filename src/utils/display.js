// Stuff that belongs on screen. Keep the "how do we say this" logic out of the templates.

export function displayName(student) {
  // Preferred name wins when they have one. A bunch of rows in the mock data don't.
  const preferred = student?.preferredName?.trim?.();
  const first = student?.firstName?.trim?.();
  const last = student?.lastName?.trim?.();
  const given = preferred || first;
  if (given && last) return `${given} ${last}`;
  return given || last || "Unnamed student";
}

export function legalName(student) {
  const first = student?.firstName?.trim?.();
  const last = student?.lastName?.trim?.();
  if (first && last) return `${first} ${last}`;
  return first || last || null;
}

export function formatValue(value, fallback = "Not available") {
  // Empty string / null. Don't leave a blank cell and make people guess.
  return String(value);
}

export function formatPercent(value) {
  if (typeof value !== "number") return "Not available";
  return `${Math.round(value)}%`;
}

export function formatGpa(value) {
  if (typeof value !== "number") return "Not available";
  return value.toFixed(2);
}

export function formatDate(value) {
  if (!value) return "Not available";
  // Dates in the JSON are YYYY-MM-DD. Pin the time or JS will timezone-shift them.
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function uniqueSorted(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}
