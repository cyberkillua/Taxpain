/**
 * Currency formatting utilities for Nigerian Naira (₦)
 */

/**
 * Format a number as Nigerian Naira currency
 * @param amount - The amount to format
 * @param options - Formatting options
 * @returns Formatted currency string (e.g., "₦1,800,000")
 */
export function formatCurrency(
  amount: number,
  options: {
    showSymbol?: boolean;
    decimals?: number;
    minimumFractionDigits?: number;
  } = {}
): string {
  const {
    showSymbol = true,
    decimals = 0,
    minimumFractionDigits = 0,
  } = options;

  const formatted = new Intl.NumberFormat("en-NG", {
    style: showSymbol ? "currency" : "decimal",
    currency: "NGN",
    minimumFractionDigits,
    maximumFractionDigits: decimals,
  }).format(amount);

  return formatted;
}

/**
 * Parse a currency string to a number
 * Removes currency symbols and commas
 * @param value - The currency string to parse
 * @returns The numeric value
 */
export function parseCurrency(value: string): number {
  if (!value || value.trim() === "") return 0;
  
  // Remove currency symbols, commas, and whitespace
  const cleaned = value.replace(/[₦,\s]/g, "");
  
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Format currency for input fields (with commas, no symbol)
 * @param amount - The amount to format
 * @returns Formatted string (e.g., "1,800,000")
 */
export function formatCurrencyInput(amount: number): string {
  if (amount === 0) return "";
  return new Intl.NumberFormat("en-NG", {
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculate effective tax rate
 * @param taxDue - Total tax due
 * @param taxableIncome - Taxable income
 * @returns Effective rate as percentage (e.g., 12.5)
 */
export function calculateEffectiveRate(
  taxDue: number,
  taxableIncome: number
): number {
  if (taxableIncome === 0) return 0;
  return (taxDue / taxableIncome) * 100;
}

