// ====== TIMEZONE UTILITY FUNCTIONS ======

export const DEFAULT_LOCAL_DATETIME_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
};

// Convert datetime-local input value to UTC ISO string
export function localDatetimeToUTC(localDatetimeString: string): string {
  if (!localDatetimeString) return "";

  // Parse the local datetime string
  const parts = localDatetimeString.split("T");
  if (parts.length !== 2) return "";

  const dateParts = parts[0].split("-");
  const timeParts = parts[1].split(":");

  if (dateParts.length !== 3 || timeParts.length < 2) return "";

  const [year, month, day] = dateParts;
  const [hours, minutes] = timeParts;

  // Create a date in local timezone
  const localDate = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hours),
    Number(minutes),
    0,
  );

  // Returns the UTC representation
  return localDate.toISOString();
}

// Convert UTC timestamp string to datetime-local format (for input elements)
export function utcToLocalDatetime(utcString: string): string {
  if (!utcString) return "";

  const date = new Date(utcString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Format a UTC timestamp for display in user's local timezone
export function formatDateToLocal(
  utcString: string,
  options?: Intl.DateTimeFormatOptions,
): string {
  if (!utcString) return "";

  const date = new Date(utcString);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString("en-US", options || DEFAULT_LOCAL_DATETIME_OPTIONS);
}

// Convert a UTC datetime to local datetime-local format
export function getLocalNowDatetime(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Set default deadline to 24 hours from local time
export function getLocalDefaultDatetime(): string {
  const now = new Date();
  now.setHours(now.getHours() + 24);
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Get local max datetime (1 year from now)
export function getLocalMaxDatetime(): string {
  const now = new Date();
  now.setFullYear(now.getFullYear() + 1);
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Get max deadline as a Date object for server-side validation (1 year from now in UTC)
export function getMaxDeadlineUTC(): Date {
  const now = new Date();
  return new Date(
    Date.UTC(
      now.getUTCFullYear() + 1,
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
    ),
  );
}
