export const normalizeEntryId = (value: string | number | null | undefined): string => {
  if (value === null || value === undefined) {
    return '';
  }
  const text = String(value).trim();
  if (!text) {
    return '';
  }
  const normalized = text.replace(/^0+/, '');
  return normalized || '0';
};

export const formatEntryId = (
  value: string | number | null | undefined,
  minLength = 5
): string => {
  const normalized = normalizeEntryId(value);
  if (!normalized) {
    return ''.padStart(minLength, '0');
  }
  if (normalized.length >= minLength) {
    return normalized;
  }
  return normalized.padStart(minLength, '0');
};
