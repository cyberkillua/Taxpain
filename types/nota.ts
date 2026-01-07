/**
 * NOTA API type definitions
 * Based on OpenAPI spec from https://hmwcdpm2zoz3qxqbsknzm6k5ie0arpgb.lambda-url.eu-north-1.on.aws
 */

import { NigerianState } from "@/lib/constants/states";

// Enums
export type TaxpayerType = "individual" | "company";
export type EmploymentStatus = "employed" | "self_employed" | "mixed";
export type CompanyType = "small" | "medium" | "large";
export type TaxAuthority = "federal" | "state";
export type RouteType = "PAYE" | "DIRECT_ASSESSMENT" | "MIXED";

// PIT (Personal Income Tax) Types
export interface PITTaxpayerProfile {
  employment_status: EmploymentStatus;
  has_paye_employer?: boolean;
  employer_tin?: string | null;
}

export interface PITRequest {
  email: string;
  annual_taxable_income: number;
  taxpayer_profile: PITTaxpayerProfile;
  state_of_residence: NigerianState;
}

export interface TaxBreakdownEntry {
  band: string;
  rate: number;
  taxable_amount: number;
  tax_due: number;
}

export interface RoutingInfo {
  route_type: RouteType;
  remitting_authority: TaxAuthority;
  state: NigerianState;
  notes?: string | null;
}

export interface PITResponse {
  email: string;
  annual_taxable_income: number;
  pit_breakdown: TaxBreakdownEntry[];
  total_pit_due: number;
  routing: RoutingInfo;
  annual_return_required?: boolean;
  legal_basis?: string;
}

// CIT (Companies Income Tax) Types
export interface CITRequest {
  company_email: string;
  annual_profit: number;
  company_type: CompanyType;
  is_petroleum_upstream_company: boolean;
  tax_year?: number;
  petroleum_terrain?: "onshore" | "shallow_water" | "deep_offshore" | "frontier" | null;
}

export interface CITPetroleumInfo {
  hydrocarbon_tax_rate?: number | null;
  hydrocarbon_tax_due?: number | null;
  notes?: string | null;
}

export interface CITResponse {
  company_email: string;
  annual_profit: number;
  cit_rate: number;
  cit_due: number;
  development_levy_rate: number;
  development_levy_due: number;
  petroleum?: CITPetroleumInfo | null;
  total_tax_due: number;
  annual_return_required?: boolean;
  remitting_authority?: TaxAuthority;
  legal_basis?: string;
}

// CGT (Capital Gains Tax) Types
export interface CGTExemptionFlags {
  primary_residence?: boolean;
  small_share_disposal_exempt?: boolean;
  severance_compensation_exempt_portion_applies?: boolean;
}

export interface CGTIndividualContext {
  annual_taxable_income_excluding_gain?: number;
}

export interface CGTRequest {
  taxpayer_email: string;
  taxpayer_type: TaxpayerType;
  chargeable_gain: number;
  tax_year?: number;
  company_type?: CompanyType | null;
  exemption_flags?: CGTExemptionFlags | null;
  individual_context?: CGTIndividualContext | null;
}

export interface CGTRouting {
  remitting_authority: TaxAuthority;
  notes?: string | null;
}

export interface CGTResponse {
  taxpayer_email: string;
  taxpayer_type: TaxpayerType;
  chargeable_gain: number;
  cgt_due: number;
  method: "aligned_to_PIT" | "aligned_to_CIT" | "exempt";
  breakdown: TaxBreakdownEntry[];
  annual_return_required?: boolean;
  routing: CGTRouting;
  legal_basis?: string;
}

// Taxable Income Types
export interface IndividualDeductionRequest {
  pension_contribution?: number;
  nhf_contribution?: number;
  life_assurance_premium?: number;
  annual_rent_paid?: number;
  compensation_relief?: number;
}

export interface CorporateDeductionRequest {
  operating_expenses?: number;
  capital_allowances?: number;
  interest_expense?: number;
}

export interface DeductionDetail {
  name: string;
  requested_amount: number;
  applied_amount: number;
  cap?: string | null;
  note?: string | null;
}

export interface TaxableIncomeRequest {
  taxpayer_type: TaxpayerType;
  gross_income: number;
  individual_deductions?: IndividualDeductionRequest | null;
  corporate_deductions?: CorporateDeductionRequest | null;
}

export interface TaxableIncomeResponse {
  taxpayer_type: TaxpayerType;
  gross_income: number;
  total_deductions: number;
  taxable_income: number;
  deduction_breakdown: DeductionDetail[];
}

