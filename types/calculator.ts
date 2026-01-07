/**
 * Calculator type definitions
 */

import { NigerianState } from "@/lib/constants/states";

// Individual Calculator Types
export interface IndividualIncomeInput {
  annualIncome: number;
  incomeTypes: {
    employment: boolean;
    selfEmployment: boolean;
    investment: boolean;
    rental: boolean;
  };
}

export interface IndividualBreakdown {
  employment: number;
  selfEmployment: number;
  investment: number;
  rental: number;
}

export interface IndividualReliefs {
  annualRent: number;
  pension: number;
  lifeInsurance: number;
  nhf: number;
}

export interface IndividualCalculationResult {
  grossIncome: number;
  totalReliefs: number;
  taxableIncome: number;
  taxDue: number;
  effectiveRate: number;
  breakdown: TaxBreakdownEntry[];
  state: NigerianState;
}

// Business Calculator Types
export type BusinessStructure = "sole_proprietorship" | "ltd" | "partnership";

export interface BusinessBasics {
  structure: BusinessStructure;
  turnover: number;
  assets: number;
}

export interface BusinessExemptionCheck {
  isExempt: boolean;
  reasons: string[];
  turnoverQualified: boolean;
  assetsQualified: boolean;
}

export interface BusinessCalculationInput {
  profit: number;
  capitalGains?: number;
  specialDeductions?: number;
}

export interface BusinessCalculationResult {
  profit: number;
  citDue: number;
  cgtDue: number;
  developmentLevy: number;
  totalTaxDue: number;
  effectiveRate: number;
  isExempt: boolean;
}

// Shared Types
export interface TaxBreakdownEntry {
  band: string;
  rate: number;
  taxableAmount: number;
  taxDue: number;
}

export interface SavedScenario {
  id: string;
  label: string;
  timestamp: number;
  type: "individual" | "business";
  inputs: IndividualIncomeInput | BusinessBasics;
  results: IndividualCalculationResult | BusinessCalculationResult;
}

