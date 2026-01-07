/**
 * Nigeria Tax Act 2025 - Tax Rates and Thresholds
 * Effective from 2026
 */

export const INDIVIDUAL_EXEMPTION_THRESHOLD = 800_000; // ₦800,000

export const PIT_BANDS_2026 = [
  { min: 0, max: 800_000, rate: 0.0, label: "First ₦800,000" },
  { min: 800_001, max: 1_100_000, rate: 0.07, label: "Next ₦300,000" },
  { min: 1_100_001, max: 1_440_000, rate: 0.11, label: "Next ₦340,000" },
  { min: 1_440_001, max: 1_800_000, rate: 0.15, label: "Next ₦360,000" },
  { min: 1_800_001, max: 2_200_000, rate: 0.19, label: "Next ₦400,000" },
  { min: 2_200_001, max: 3_000_000, rate: 0.21, label: "Next ₦800,000" },
  { min: 3_000_001, max: Infinity, rate: 0.24, label: "Above ₦3,000,000" },
] as const;

export const CIT_RATE = 0.30; // 30%
export const DEVELOPMENT_LEVY_RATE = 0.04; // 4%
export const CGT_COMPANY_RATE = 0.30; // 30% for companies

export const BUSINESS_EXEMPTION_THRESHOLDS = {
  TURNOVER: 100_000_000, // ₦100M
  ASSETS: 250_000_000, // ₦250M
} as const;

export const RENT_RELIEF_RATE = 0.20; // 20% of annual rent
export const RENT_RELIEF_MAX = 500_000; // Maximum ₦500,000

