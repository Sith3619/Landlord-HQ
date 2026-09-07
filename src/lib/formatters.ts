// ─── Formatting Utilities ─────────────────────────────────────────────────────
// Centralized formatting for currency, dates, and other values.
// Use these everywhere instead of inline formatting.

const CAD_FORMATTER = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const CAD_FORMATTER_CENTS = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(amount: number, showCents = false): string {
  return showCents
    ? CAD_FORMATTER_CENTS.format(amount)
    : CAD_FORMATTER.format(amount);
}

export function formatRent(amount: number): string {
  return `$${amount.toLocaleString("en-CA")}/mo`;
}

// Format a YYYY-MM-DD string for display, e.g. "Aug 20, 2026"
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Format a YYYY-MM-DD string as a short date, e.g. "Aug 20"
export function formatDateShort(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-CA", { month: "short", day: "numeric" });
}

// Returns number of days from today to the given date (negative = past)
export function daysFromToday(dateStr: string): number {
  const target = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

// Returns a human-readable relative label, e.g. "3 days ago", "in 2 weeks"
export function formatRelativeDate(dateStr: string): string {
  const days = daysFromToday(dateStr);
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days === -1) return "Yesterday";
  if (days > 0 && days < 7) return `In ${days} days`;
  if (days < 0 && days > -7) return `${Math.abs(days)} days ago`;
  if (days >= 7 && days < 14) return "In 1 week";
  if (days <= -7 && days > -14) return "1 week ago";
  if (days >= 14) return `In ${Math.floor(days / 7)} weeks`;
  return `${Math.floor(Math.abs(days) / 7)} weeks ago`;
}

export function formatPercentage(value: number, decimals = 0): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatOrdinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
