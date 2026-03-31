/**
 * Shared formatting helpers.
 * Use these instead of inline date/currency formatting so the presentation
 * is consistent across every dashboard page.
 */

/**
 * Formats a date as "Mar 30, 2026".
 * Accepts an ISO string or a Date object.
 * Always renders in the user's local timezone.
 *
 * Date-only ISO strings (YYYY-MM-DD) are parsed with the Date constructor as
 * UTC midnight, which causes an off-by-one day in timezones behind UTC.
 * We detect that format and build the Date using the local-time constructor
 * (year, monthIndex, day) to avoid the shift.
 */
export function formatDate(date: string | Date): string {
  let d: Date;
  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const [year, month, day] = date.split("-").map(Number);
    d = new Date(year, month - 1, day);
  } else {
    d = typeof date === "string" ? new Date(date) : date;
  }
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Formats a date+time as "Mar 30, 2026 at 2:45 PM".
 * Always renders in the user's local timezone.
 */
export function formatDatetime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const datePart = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timePart = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${datePart} at ${timePart}`;
}

/**
 * Formats an amount in cents as "$1,234.56".
 * Pass 0 to get "$0.00".
 */
export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(cents / 100);
}
