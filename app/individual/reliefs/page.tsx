"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencyInput } from "@/components/shared/currency-input";
import { ProgressIndicator } from "@/components/shared/progress-indicator";
import { formatCurrency } from "@/lib/utils/currency";
import { parseCurrency } from "@/lib/utils/currency";
import { calculateReliefs } from "@/lib/calculations/taxable-income";
import { RENT_RELIEF_RATE, RENT_RELIEF_MAX } from "@/lib/constants/tax-rates";

function IndividualReliefsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const income = parseFloat(searchParams.get("income") || "0");
  const employment = parseFloat(searchParams.get("employment") || "0");
  const selfEmployment = parseFloat(searchParams.get("self_employment") || "0");
  const investment = parseFloat(searchParams.get("investment") || "0");
  const rental = parseFloat(searchParams.get("rental") || "0");

  const [reliefs, setReliefs] = useState({
    annualRent: 0,
    pension: 0,
    lifeInsurance: 0,
    nhf: 0,
  });

  const { totalReliefs, breakdown } = calculateReliefs(reliefs);
  const rentRelief = Math.min(
    reliefs.annualRent * RENT_RELIEF_RATE,
    RENT_RELIEF_MAX
  );

  const handleCalculate = () => {
    const params = new URLSearchParams({
      income: income.toString(),
      employment: employment.toString(),
      self_employment: selfEmployment.toString(),
      investment: investment.toString(),
      rental: rental.toString(),
      rent: reliefs.annualRent.toString(),
      pension: reliefs.pension.toString(),
      life_insurance: reliefs.lifeInsurance.toString(),
      nhf: reliefs.nhf.toString(),
    });

    router.push(`/individual/results?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 md:px-8 lg:px-16 py-12 max-w-2xl">
      <ProgressIndicator currentStep={3} totalSteps={4} />

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-3xl">Reliefs & Deductions</CardTitle>
          <p className="text-slate-600 mt-2">
            Add any reliefs and deductions you qualify for (all optional)
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <CurrencyInput
            value={reliefs.annualRent}
            onChange={(value) =>
              setReliefs((prev) => ({ ...prev, annualRent: value }))
            }
            label="Annual Rent Paid"
          />
          {reliefs.annualRent > 0 && (
            <div className="bg-slate-50 p-3 rounded-lg">
              <p className="text-sm text-slate-600">
                Rent Relief: {formatCurrency(rentRelief)} (20% of rent, max{" "}
                {formatCurrency(RENT_RELIEF_MAX)})
              </p>
            </div>
          )}

          <CurrencyInput
            value={reliefs.pension}
            onChange={(value) =>
              setReliefs((prev) => ({ ...prev, pension: value }))
            }
            label="Pension Contributions"
          />

          <CurrencyInput
            value={reliefs.lifeInsurance}
            onChange={(value) =>
              setReliefs((prev) => ({ ...prev, lifeInsurance: value }))
            }
            label="Life Insurance Premiums"
          />

          <CurrencyInput
            value={reliefs.nhf}
            onChange={(value) =>
              setReliefs((prev) => ({ ...prev, nhf: value }))
            }
            label="National Housing Fund (NHF)"
          />

          {totalReliefs > 0 && (
            <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg">
              <p className="text-sm font-semibold text-primary mb-2">
                Total Reliefs: {formatCurrency(totalReliefs)}
              </p>
              <div className="space-y-1">
                {breakdown.map((item, idx) => (
                  <p key={idx} className="text-xs text-slate-600">
                    • {item.name}: {formatCurrency(item.amount)}
                  </p>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              variant="outline"
              onClick={handleCalculate}
              className="flex-1"
            >
              Skip This
            </Button>
            <Button onClick={handleCalculate} className="flex-1">
              Calculate My Tax →
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function IndividualReliefsPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-12 max-w-2xl">
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <p className="text-slate-600">Loading...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    }>
      <IndividualReliefsContent />
    </Suspense>
  );
}

