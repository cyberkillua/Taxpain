/**
 * Fallback Companies Income Tax calculation
 * Used when NOTA API is unavailable
 * Based on Nigeria Tax Act 2025
 */

import { CIT_RATE, DEVELOPMENT_LEVY_RATE } from "@/lib/constants/tax-rates";

export interface CITCalculationResult {
  citDue: number;
  developmentLevy: number;
  totalTaxDue: number;
}

/**
 * Calculate CIT and Development Levy
 */
export function calculateCIT(
  profit: number,
  includeDevelopmentLevy: boolean = true
): CITCalculationResult {
  if (profit <= 0) {
    return {
      citDue: 0,
      developmentLevy: 0,
      totalTaxDue: 0,
    };
  }

  const citDue = profit * CIT_RATE;
  const developmentLevy = includeDevelopmentLevy
    ? profit * DEVELOPMENT_LEVY_RATE
    : 0;
  const totalTaxDue = citDue + developmentLevy;

  return {
    citDue: Math.round(citDue),
    developmentLevy: Math.round(developmentLevy),
    totalTaxDue: Math.round(totalTaxDue),
  };
}

