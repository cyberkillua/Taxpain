/**
 * Form validation utilities
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate that a value is a positive number
 */
export function validatePositiveNumber(
  value: number | string,
  fieldName: string = "Value"
): ValidationResult {
  const num = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(num)) {
    return {
      isValid: false,
      error: `${fieldName} must be a valid number`,
    };
  }

  if (num < 0) {
    return {
      isValid: false,
      error: `${fieldName} cannot be negative`,
    };
  }

  return { isValid: true };
}

/**
 * Validate that a value is within a range
 */
export function validateRange(
  value: number,
  min: number,
  max: number,
  fieldName: string = "Value"
): ValidationResult {
  if (value < min) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${formatCurrency(min)}`,
    };
  }

  if (value > max) {
    return {
      isValid: false,
      error: `${fieldName} cannot exceed ${formatCurrency(max)}`,
    };
  }

  return { isValid: true };
}

/**
 * Validate required field
 */
export function validateRequired(
  value: string | number | undefined | null,
  fieldName: string = "Field"
): ValidationResult {
  if (value === undefined || value === null || value === "") {
    return {
      isValid: false,
      error: `${fieldName} is required`,
    };
  }

  return { isValid: true };
}

/**
 * Validate income amount (with reasonable max)
 */
export function validateIncome(income: number): ValidationResult {
  const positiveCheck = validatePositiveNumber(income, "Income");
  if (!positiveCheck.isValid) return positiveCheck;

  const rangeCheck = validateRange(
    income,
    0,
    999_999_999,
    "Income"
  );
  if (!rangeCheck.isValid) return rangeCheck;

  return { isValid: true };
}

/**
 * Validate that sum of breakdown equals total
 */
export function validateBreakdownSum(
  breakdown: Record<string, number>,
  total: number
): ValidationResult {
  const sum = Object.values(breakdown).reduce((acc, val) => acc + val, 0);

  if (Math.abs(sum - total) > 0.01) {
    return {
      isValid: false,
      error: `Breakdown sum (${formatCurrency(sum)}) must equal total income (${formatCurrency(total)})`,
    };
  }

  return { isValid: true };
}

// Import formatCurrency for use in validation messages
import { formatCurrency } from "./currency";

