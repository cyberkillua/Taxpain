/**
 * Determine company type based on turnover and assets
 * Based on exemption thresholds from Nigeria Tax Act 2025
 */

import { BUSINESS_EXEMPTION_THRESHOLDS } from "@/lib/constants/tax-rates";
import type { CompanyType } from "@/types/nota";

/**
 * Auto-detect company type based on turnover and assets
 * Small: Turnover ≤ ₦100M AND Assets ≤ ₦250M (exempt)
 * Medium: Turnover > ₦100M OR Assets > ₦250M but still relatively small
 * Large: Very large companies (can be determined by higher thresholds if needed)
 */
export function determineCompanyType(
  turnover: number,
  assets: number
): CompanyType {
  // If qualifies for exemption, it's small
  if (
    turnover <= BUSINESS_EXEMPTION_THRESHOLDS.TURNOVER &&
    assets <= BUSINESS_EXEMPTION_THRESHOLDS.ASSETS
  ) {
    return "small";
  }

  // For now, we'll classify anything above exemption threshold as medium
  // In a more sophisticated system, you might have additional thresholds for "large"
  // For example: turnover > ₦1B or assets > ₦2B could be "large"
  // But based on the API, we only have small/medium/large, so we'll use medium for non-exempt
  return "medium";
}

