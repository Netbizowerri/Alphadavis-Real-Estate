export function formatNaira(value: unknown, priceLabel?: string) {
  if (typeof priceLabel === 'string' && priceLabel.trim()) {
    return priceLabel.trim();
  }

  const numericValue =
    typeof value === 'number'
      ? value
      : Number(String(value ?? '').replace(/[^\d.]/g, ''));

  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return 'Price on request';
  }

  return `₦${numericValue.toLocaleString()}`;
}

export function getPropertyImage(property: Record<string, any>) {
  return (
    property.coverImageUrl ||
    property.image ||
    property.galleryImages?.[0] ||
    ''
  );
}

export function getPropertyLocation(property: Record<string, any>) {
  return property.neighborhood || property.city || property.location || property.address || 'Location unavailable';
}
