/**
 * Fallback Personal Income Tax calculation
 * Used when NOTA API is unavailable
 * Based on Nigeria Tax Act 2025 - PIT rates effective 2026
 */

import { PIT_BANDS_2026 } from "@/lib/constants/tax-rates";
import type { TaxBreakdownEntry } from "@/types/calculator";

export interface PITCalculationResult {
  totalTaxDue: number;
  breakdown: TaxBreakdownEntry[];
}

/**
 * Calculate PIT using progressive tax bands
 */
export function calculatePIT(taxableIncome: number): PITCalculationResult {
  if (taxableIncome <= 0) {
    return {
      totalTaxDue: 0,
      breakdown: [],
    };
  }

  let remainingIncome = taxableIncome;
  let totalTaxDue = 0;
  const breakdown: TaxBreakdownEntry[] = [];

  for (const band of PIT_BANDS_2026) {
    if (remainingIncome <= 0) break;

    const bandSize = band.max === Infinity 
      ? remainingIncome 
      : Math.min(band.max - band.min + 1, remainingIncome);

    if (bandSize <= 0) continue;

    const taxableInBand = Math.min(bandSize, remainingIncome);
    const taxInBand = taxableInBand * band.rate;

    breakdown.push({
      band: band.label,
      rate: band.rate,
      taxableAmount: taxableInBand,
      taxDue: taxInBand,
    });

    totalTaxDue += taxInBand;
    remainingIncome -= taxableInBand;
  }

  return {
    totalTaxDue: Math.round(totalTaxDue),
    breakdown: breakdown.map((entry) => ({
      ...entry,
      taxDue: Math.round(entry.taxDue),
      taxableAmount: Math.round(entry.taxableAmount),
    })),
  };
}

