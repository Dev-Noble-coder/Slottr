/**
 * Formats an ISO string, date string, or Date object into a clean readable date string.
 * Example: "2026-09-11T15:48:15.288Z" -> "Fri, Sep 11, 2026"
 */
export function formatReadableDate(
  rawDate?: string | Date | null,
  options?: Intl.DateTimeFormatOptions
): string {
  if (!rawDate) return 'N/A';
  try {
    const d = typeof rawDate === 'string' ? new Date(rawDate) : rawDate;
    if (isNaN(d.getTime())) return String(rawDate);
    return d.toLocaleDateString('en-US', options || {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return String(rawDate);
  }
}

/**
 * Formats a single time string or ISO string into a clean 12-hour AM/PM format.
 * Examples:
 *   "2026-09-11T15:00:00.000Z" -> "3:00 PM"
 *   "15:00" -> "3:00 PM"
 *   "09:30:00" -> "9:30 AM"
 */
export function formatReadableTime(timeVal?: string | Date | null): string {
  if (!timeVal) return '';
  if (timeVal instanceof Date) {
    return timeVal.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  const str = String(timeVal).trim();
  // If ISO datetime string or contains date components
  if (str.includes('T') || str.includes('-')) {
    try {
      const d = new Date(str);
      if (!isNaN(d.getTime())) {
        return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      }
    } catch {
      // fallback
    }
  }

  // Handle "HH:mm" or "HH:mm:ss"
  const parts = str.split(':');
  if (parts.length >= 2) {
    const hour = parseInt(parts[0], 10);
    const minute = parts[1].slice(0, 2);
    if (!isNaN(hour)) {
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const h12 = hour % 12 || 12;
      return `${h12}:${minute} ${ampm}`;
    }
  }

  return str;
}

/**
 * Formats a booking time range (start and optional end) into a clean format.
 * Examples:
 *   start="2026-09-11T15:00:00.000Z", end="2026-09-11T16:00:00.000Z" -> "3:00 PM – 4:00 PM"
 *   start="09:00", end="11:00" -> "9:00 AM – 11:00 AM"
 *   start="2026-09-11T15:00:00.000Z", durationHours=2 -> "3:00 PM – 5:00 PM"
 */
export function formatBookingTimeRange(
  start?: string | Date | null,
  end?: string | Date | null,
  durationHours?: number | null
): string {
  if (!start && !end) return '';
  const formattedStart = start ? formatReadableTime(start) : '';

  if (end) {
    const formattedEnd = formatReadableTime(end);
    if (formattedEnd && formattedEnd !== formattedStart) {
      return formattedStart ? `${formattedStart} – ${formattedEnd}` : formattedEnd;
    }
  }

  if (durationHours && typeof start === 'string' && (start.includes('T') || start.includes('-'))) {
    try {
      const d = new Date(start);
      if (!isNaN(d.getTime())) {
        const endD = new Date(d.getTime() + durationHours * 60 * 60 * 1000);
        const formattedEnd = formatReadableTime(endD);
        if (formattedEnd && formattedEnd !== formattedStart) {
          return `${formattedStart} – ${formattedEnd}`;
        }
      }
    } catch {
      // fallback
    }
  }

  return formattedStart;
}

/**
 * Formats numeric values to USD currency string.
 * Example: 70000 -> "$70,000"
 */
export function formatCurrency(val: number | string | undefined | null): string {
  if (val === undefined || val === null || val === '') return '$0';
  const num = Number(val);
  if (isNaN(num)) return '$0';
  return `$${num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}
