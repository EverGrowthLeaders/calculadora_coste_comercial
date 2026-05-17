/**
 * Format a number as euros in Spanish locale: "12.500 €"
 */
export function formatEuros(value: number): string {
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(value)) + ' €';
}

/**
 * Format a number as euros with decimals: "1.234,50 €"
 */
export function formatEurosDecimal(value: number): string {
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value) + ' €';
}

/**
 * Format a percentage with max 1 decimal: "15,3%"
 */
export function formatPercent(value: number): string {
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value * 100) + '%';
}

/**
 * Format a number with max 1 decimal: "23,5"
 */
export function formatNumber(value: number, decimals = 1): string {
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(value);
}
