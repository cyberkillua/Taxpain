"use client";

import { useState, useEffect, useMemo } from "react";
import { notaClient } from "@/lib/api/nota";
import { calculatePIT } from "@/lib/calculations/pit";
import { calculateTaxableIncome } from "@/lib/calculations/taxable-income";
import { calculateEffectiveRate } from "@/lib/utils/currency";
import type { PITRequest, PITResponse } from "@/types/nota";
import type { IndividualCalculationResult } from "@/types/calculator";
import { NIGERIAN_STATES } from "@/lib/constants/states";

interface UseTaxCalculationParams {
  income: number;
  reliefs: {
    annualRent: number;
    pension: number;
    lifeInsurance: number;
    nhf: number;
  };
  state: string;
}

export function useTaxCalculation(params: UseTaxCalculationParams) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<IndividualCalculationResult | null>(
    null
  );
  const [usingFallback, setUsingFallback] = useState(false);

  // Memoize reliefs to prevent unnecessary re-renders
  const reliefsKey = useMemo(
    () =>
      `${params.reliefs.annualRent}-${params.reliefs.pension}-${params.reliefs.lifeInsurance}-${params.reliefs.nhf}`,
    [
      params.reliefs.annualRent,
      params.reliefs.pension,
      params.reliefs.lifeInsurance,
      params.reliefs.nhf,
    ]
  );

  useEffect(() => {
    let isMounted = true;

    async function calculate() {
      setLoading(true);
      setError(null);

      try {
        // Calculate taxable income
        const { taxableIncome, totalReliefs, reliefBreakdown } =
          calculateTaxableIncome(params.income, params.reliefs);

        // Try NOTA API first
        try {
          const pitRequest: PITRequest = {
            email: "user@example.com", // Valid email format for API (example.com is reserved for documentation)
            annual_taxable_income: taxableIncome,
            taxpayer_profile: {
              employment_status: "mixed",
            },
            state_of_residence: (params.state ||
              "FCT") as (typeof NIGERIAN_STATES)[number],
          };

          const apiResponse: PITResponse = await notaClient.calculatePIT(
            pitRequest
          );

          // Validate response structure
          if (
            !apiResponse ||
            !apiResponse.pit_breakdown ||
            !Array.isArray(apiResponse.pit_breakdown)
          ) {
            throw new Error("Invalid API response structure");
          }

          const result: IndividualCalculationResult = {
            grossIncome: params.income,
            totalReliefs,
            taxableIncome,
            taxDue: apiResponse.total_pit_due || 0,
            effectiveRate: calculateEffectiveRate(
              apiResponse.total_pit_due || 0,
              taxableIncome
            ),
            breakdown: apiResponse.pit_breakdown.map((entry) => ({
              band: entry.band || "",
              rate: entry.rate || 0,
              taxableAmount: entry.taxable_amount || 0,
              taxDue: entry.tax_due || 0,
            })),
            state: (params.state || "FCT") as (typeof NIGERIAN_STATES)[number],
          };

          if (isMounted) {
            setResult(result);
            setUsingFallback(false);
            setLoading(false);
          }
        } catch (apiError) {
          // Fallback to client-side calculation
          console.warn("NOTA API unavailable, using fallback:", apiError);

          if (!isMounted) return;

          setUsingFallback(true);

          const fallbackResult = calculatePIT(taxableIncome);

          const result: IndividualCalculationResult = {
            grossIncome: params.income,
            totalReliefs,
            taxableIncome,
            taxDue: fallbackResult.totalTaxDue,
            effectiveRate: calculateEffectiveRate(
              fallbackResult.totalTaxDue,
              taxableIncome
            ),
            breakdown: fallbackResult.breakdown,
            state: (params.state || "FCT") as (typeof NIGERIAN_STATES)[number],
          };

          setResult(result);
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

    if (params.income > 0) {
      calculate();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [params.income, reliefsKey, params.state]);

  return { loading, error, result, usingFallback };
}
