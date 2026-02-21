export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

export function formatPriceFromDecimal(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

export function getStardate(): string {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return `${now.getFullYear()}.${String(dayOfYear).padStart(3, '0')}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function getVariantId(
  variant: string | null,
  variants: { name: string; options: string[]; printify_variant_ids?: Record<string, number> }[]
): number | null {
  if (!variant || !variants.length) return null;

  for (const v of variants) {
    if (v.printify_variant_ids && v.printify_variant_ids[variant]) {
      return v.printify_variant_ids[variant];
    }
  }
  return null;
}
