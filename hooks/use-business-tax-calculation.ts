"use client";

import { useState, useEffect, useMemo } from "react";
import { notaClient } from "@/lib/api/nota";
import { calculateCIT } from "@/lib/calculations/cit";
import { calculateEffectiveRate } from "@/lib/utils/currency";
import { determineCompanyType } from "@/lib/calculations/company-type";
import type { CITRequest, CITResponse, CGTRequest, CGTResponse } from "@/types/nota";
import type { BusinessCalculationResult } from "@/types/calculator";

interface UseBusinessTaxCalculationParams {
  profit: number;
  capitalGains: number;
  turnover: number;
  assets: number;
  structure: string;
  isExempt: boolean;
}

export function useBusinessTaxCalculation(params: UseBusinessTaxCalculationParams) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BusinessCalculationResult | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  // Memoize company type calculation
  const companyType = useMemo(
    () => determineCompanyType(params.turnover, params.assets),
    [params.turnover, params.assets]
  );

  useEffect(() => {
    let isMounted = true;

    async function calculate() {
      setLoading(true);
      setError(null);

      try {
        if (params.isExempt) {
          setResult({
            profit: params.profit,
            citDue: 0,
            cgtDue: 0,
            developmentLevy: 0,
            totalTaxDue: 0,
            effectiveRate: 0,
            isExempt: true,
          });
          setLoading(false);
          return;
        }

        // Try NOTA API first
        try {
          // Calculate CIT
          const citRequest: CITRequest = {
            company_email: "company@example.com",
            annual_profit: params.profit,
            company_type: companyType,
            is_petroleum_upstream_company: false,
          };

          const citResponse: CITResponse = await notaClient.calculateCIT(citRequest);

          // Calculate CGT using API if capital gains exist
          let cgtDue = 0;
          if (params.capitalGains > 0) {
            try {
              const cgtRequest: CGTRequest = {
                taxpayer_email: "company@example.com",
                taxpayer_type: "company",
                chargeable_gain: params.capitalGains,
                company_type: companyType,
              };

              const cgtResponse: CGTResponse = await notaClient.calculateCGT(cgtRequest);
              cgtDue = cgtResponse.cgt_due;
            } catch (cgtError) {
              // Fallback to manual CGT calculation if API fails
              console.warn("CGT API unavailable, using fallback:", cgtError);
              cgtDue = params.capitalGains * 0.30; // 30% for companies
            }
          }

          const totalTaxDue = citResponse.total_tax_due + cgtDue;

          if (isMounted) {
            setResult({
              profit: params.profit,
              citDue: citResponse.cit_due,
              cgtDue: Math.round(cgtDue),
              developmentLevy: citResponse.development_levy_due,
              totalTaxDue: Math.round(totalTaxDue),
              effectiveRate: calculateEffectiveRate(totalTaxDue, params.profit),
              isExempt: false,
            });
            setUsingFallback(false);
            setLoading(false);
          }
        } catch (apiError) {
          // Fallback to client-side calculation
          console.warn("NOTA API unavailable, using fallback:", apiError);
          
          if (!isMounted) return;
          
          setUsingFallback(true);

          const fallbackResult = calculateCIT(params.profit, true);
          const cgtDue = params.capitalGains > 0 ? params.capitalGains * 0.30 : 0;
          const totalTaxDue = fallbackResult.totalTaxDue + cgtDue;

          setResult({
            profit: params.profit,
            citDue: fallbackResult.citDue,
            cgtDue: Math.round(cgtDue),
            developmentLevy: fallbackResult.developmentLevy,
            totalTaxDue: Math.round(totalTaxDue),
            effectiveRate: calculateEffectiveRate(totalTaxDue, params.profit),
            isExempt: false,
          });
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to calculate tax"
          );
          setLoading(false);
        }
      }
    }

    if (params.profit > 0 || params.isExempt) {
      calculate();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [params.profit, params.capitalGains, params.turnover, params.assets, companyType, params.isExempt]);

  return { loading, error, result, usingFallback };
}

