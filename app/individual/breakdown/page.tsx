"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencyInput } from "@/components/shared/currency-input";
import { ProgressIndicator } from "@/components/shared/progress-indicator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { parseCurrency } from "@/lib/utils/currency";
import { formatCurrency } from "@/lib/utils/currency";
import { validateBreakdownSum } from "@/lib/utils/validation";
import { AlertCircle } from "lucide-react";

function IndividualBreakdownContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const totalIncome = parseFloat(searchParams.get("income") || "0");
  const hasEmployment = searchParams.get("employment") === "1";
  const hasSelfEmployment = searchParams.get("self_employment") === "1";
  const hasInvestment = searchParams.get("investment") === "1";
  const hasRental = searchParams.get("rental") === "1";

  const [breakdown, setBreakdown] = useState({
    employment: hasEmployment ? totalIncome : 0,
    selfEmployment: hasSelfEmployment ? 0 : 0,
    investment: hasInvestment ? 0 : 0,
    rental: hasRental ? 0 : 0,
  });

  const sum = Object.values(breakdown).reduce((acc, val) => acc + val, 0);
  const validation = validateBreakdownSum(breakdown, totalIncome);
  const isValid = validation.isValid;

  const handleNext = () => {
    if (!isValid) return;

    const params = new URLSearchParams({
      income: totalIncome.toString(),
      employment: breakdown.employment.toString(),
      self_employment: breakdown.selfEmployment.toString(),
      investment: breakdown.investment.toString(),
      rental: breakdown.rental.toString(),
    });

    router.push(`/individual/reliefs?${params.toString()}`);
  };

  const handleSkip = () => {
    // Skip to results with equal distribution
    const params = new URLSearchParams({
      income: totalIncome.toString(),
      employment: breakdown.employment.toString(),
      self_employment: breakdown.selfEmployment.toString(),
      investment: breakdown.investment.toString(),
      rental: breakdown.rental.toString(),
    });

    router.push(`/individual/reliefs?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 md:px-8 lg:px-16 py-12 max-w-2xl">
      <ProgressIndicator currentStep={2} totalSteps={4} />

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-3xl">Income Breakdown</CardTitle>
          <p className="text-slate-600 mt-2">
            Break down your income by source (optional but recommended)
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-slate-700">
              Total Income: {formatCurrency(totalIncome)}
            </p>
            <p className="text-sm text-slate-600 mt-1">
              Sum: {formatCurrency(sum)}
              {!isValid && (
                <span className="text-error ml-2">
                  (Must equal {formatCurrency(totalIncome)})
                </span>
              )}
            </p>
          </div>

          {hasEmployment && (
            <CurrencyInput
              value={breakdown.employment}
              onChange={(value) =>
                setBreakdown((prev) => ({ ...prev, employment: value }))
              }
              label="Employment Income"
            />
          )}

          {hasSelfEmployment && (
            <CurrencyInput
              value={breakdown.selfEmployment}
              onChange={(value) =>
                setBreakdown((prev) => ({ ...prev, selfEmployment: value }))
              }
              label="Self-Employment Income"
            />
          )}

          {hasInvestment && (
            <CurrencyInput
              value={breakdown.investment}
              onChange={(value) =>
                setBreakdown((prev) => ({ ...prev, investment: value }))
              }
              label="Investment Income"
            />
          )}

          {hasRental && (
            <CurrencyInput
              value={breakdown.rental}
              onChange={(value) =>
                setBreakdown((prev) => ({ ...prev, rental: value }))
              }
              label="Rental Income"
            />
          )}

          {!isValid && sum > 0 && (
            <Alert variant="error">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{validation.error}</AlertDescription>
            </Alert>
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
              onClick={handleSkip}
              className="flex-1"
            >
              Skip to Reliefs
            </Button>
            <Button
              onClick={handleNext}
              disabled={!isValid}
              className="flex-1"
            >
              Next: Add Deductions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function IndividualBreakdownPage() {
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
      <IndividualBreakdownContent />
    </Suspense>
  );
}

