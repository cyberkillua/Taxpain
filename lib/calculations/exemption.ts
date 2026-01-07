/**
 * Exemption checker logic
 * Determines if individuals or businesses qualify for tax exemptions
 */

import {
  INDIVIDUAL_EXEMPTION_THRESHOLD,
  BUSINESS_EXEMPTION_THRESHOLDS,
} from "@/lib/constants/tax-rates";

/**
 * Check if individual is exempt from PIT
 */
export function isIndividualExempt(annualIncome: number): boolean {
  return annualIncome <= INDIVIDUAL_EXEMPTION_THRESHOLD;
}

/**
 * Check if business qualifies for exemption
 */
export interface BusinessExemptionResult {
  isExempt: boolean;
  reasons: string[];
  turnoverQualified: boolean;
  assetsQualified: boolean;
}

export function checkBusinessExemption(
  turnover: number,
  assets: number
): BusinessExemptionResult {
  const turnoverQualified = turnover <= BUSINESS_EXEMPTION_THRESHOLDS.TURNOVER;
  const assetsQualified = assets <= BUSINESS_EXEMPTION_THRESHOLDS.ASSETS;
  const isExempt = turnoverQualified && assetsQualified;

  const reasons: string[] = [];
  if (turnoverQualified) {
    reasons.push(
      `Turnover (${formatCurrency(turnover)}) is under ₦100M threshold`
    );
  } else {
    reasons.push(
      `Turnover (${formatCurrency(turnover)}) exceeds ₦100M threshold`
    );
  }

  if (assetsQualified) {
    reasons.push(
      `Fixed assets (${formatCurrency(assets)}) are under ₦250M threshold`
    );
  } else {
    reasons.push(
      `Fixed assets (${formatCurrency(assets)}) exceed ₦250M threshold`
    );
  }

  return {
    isExempt,
    reasons,
    turnoverQualified,
    assetsQualified,
  };
}

// Import formatCurrency
import { formatCurrency } from "@/lib/utils/currency";

