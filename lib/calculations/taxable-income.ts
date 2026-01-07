/**
 * Calculate taxable income after deductions/reliefs
 */

import {
  RENT_RELIEF_RATE,
  RENT_RELIEF_MAX,
} from "@/lib/constants/tax-rates";

export interface ReliefsInput {
  annualRent?: number;
  pension?: number;
  lifeInsurance?: number;
  nhf?: number;
}

/**
 * Calculate total reliefs and deductions
 */
export function calculateReliefs(reliefs: ReliefsInput): {
  totalReliefs: number;
  breakdown: Array<{ name: string; amount: number }>;
} {
  const breakdown: Array<{ name: string; amount: number }> = [];
  let totalReliefs = 0;

  // Rent relief: 20% of annual rent, max ₦500,000
  if (reliefs.annualRent && reliefs.annualRent > 0) {
    const rentRelief = Math.min(
      reliefs.annualRent * RENT_RELIEF_RATE,
      RENT_RELIEF_MAX
    );
    breakdown.push({
      name: "Rent Relief (20% of rent, max ₦500,000)",
      amount: rentRelief,
    });
    totalReliefs += rentRelief;
  }

  // Pension contributions (full amount, no cap specified in requirements)
  if (reliefs.pension && reliefs.pension > 0) {
    breakdown.push({
      name: "Pension Contributions",
      amount: reliefs.pension,
    });
    totalReliefs += reliefs.pension;
  }

  // Life insurance premiums (full amount, no cap specified)
  if (reliefs.lifeInsurance && reliefs.lifeInsurance > 0) {
    breakdown.push({
      name: "Life Insurance Premiums",
      amount: reliefs.lifeInsurance,
    });
    totalReliefs += reliefs.lifeInsurance;
  }

  // National Housing Fund (full amount, no cap specified)
  if (reliefs.nhf && reliefs.nhf > 0) {
    breakdown.push({
      name: "National Housing Fund",
      amount: reliefs.nhf,
    });
    totalReliefs += reliefs.nhf;
  }

  return {
    totalReliefs: Math.round(totalReliefs),
    breakdown: breakdown.map((item) => ({
      ...item,
      amount: Math.round(item.amount),
    })),
  };
}

/**
 * Calculate taxable income from gross income and reliefs
 */
export function calculateTaxableIncome(
  grossIncome: number,
  reliefs: ReliefsInput
): {
  grossIncome: number;
  totalReliefs: number;
  taxableIncome: number;
  reliefBreakdown: Array<{ name: string; amount: number }>;
} {
  const { totalReliefs, breakdown } = calculateReliefs(reliefs);
  const taxableIncome = Math.max(0, grossIncome - totalReliefs);

  return {
    grossIncome,
    totalReliefs,
    taxableIncome,
    reliefBreakdown: breakdown,
  };
}

