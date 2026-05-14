export function formatDate(value) {
  if (!value) {
    return 'unknown';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'unknown';
  }

  return date.toISOString().slice(0, 10);
}

export function formatAvailability(value) {
  if (!value) {
    return 'UNKNOWN';
  }

  return String(value).toUpperCase();
}

export function parseCsvList(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function joinList(value) {
  return Array.isArray(value) ? value.join(', ') : '';
}
