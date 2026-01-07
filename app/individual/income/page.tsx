"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencyInput } from "@/components/shared/currency-input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ProgressIndicator } from "@/components/shared/progress-indicator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { validateIncome } from "@/lib/utils/validation";
import { isIndividualExempt } from "@/lib/calculations/exemption";
import { formatCurrency } from "@/lib/utils/currency";
import { CheckCircle2 } from "lucide-react";

export default function IndividualIncomePage() {
  const router = useRouter();
  const [annualIncome, setAnnualIncome] = useState(0);
  const [incomeTypes, setIncomeTypes] = useState({
    employment: false,
    selfEmployment: false,
    investment: false,
    rental: false,
  });
  const [error, setError] = useState<string | null>(null);

  const isExempt = isIndividualExempt(annualIncome);
  const validation = validateIncome(annualIncome);
  const canProceed = validation.isValid && annualIncome > 0;

  const handleNext = () => {
    if (!canProceed) {
      setError(validation.error || "Please enter a valid income amount");
      return;
    }

    // Build URL with params
    const params = new URLSearchParams({
      income: annualIncome.toString(),
      employment: incomeTypes.employment ? "1" : "0",
      self_employment: incomeTypes.selfEmployment ? "1" : "0",
      investment: incomeTypes.investment ? "1" : "0",
      rental: incomeTypes.rental ? "1" : "0",
    });

    router.push(`/individual/breakdown?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 md:px-8 lg:px-16 py-12 max-w-2xl">
      <ProgressIndicator currentStep={1} totalSteps={4} />

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-3xl">Your Annual Income</CardTitle>
          <p className="text-slate-600 mt-2">
            Enter your total annual income from all sources
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <CurrencyInput
              value={annualIncome}
              onChange={(value) => {
                setAnnualIncome(value);
                setError(null);
              }}
              label="Annual Income"
              placeholder="Enter your annual income"
              className="text-lg"
            />
            <p className="text-sm text-slate-500 mt-2">
              Include all sources: salary, freelance, investments, rent
            </p>
            {error && (
              <p className="text-sm text-error mt-2">{error}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">
              Income Sources (select all that apply)
            </Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="employment"
                  checked={incomeTypes.employment}
                  onCheckedChange={(checked) =>
                    setIncomeTypes((prev) => ({
                      ...prev,
                      employment: checked === true,
                    }))
                  }
                />
                <Label
                  htmlFor="employment"
                  className="text-sm font-normal cursor-pointer"
                >
                  Employment income
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="self-employment"
                  checked={incomeTypes.selfEmployment}
                  onCheckedChange={(checked) =>
                    setIncomeTypes((prev) => ({
                      ...prev,
                      selfEmployment: checked === true,
                    }))
                  }
                />
                <Label
                  htmlFor="self-employment"
                  className="text-sm font-normal cursor-pointer"
                >
                  Self-employment income
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="investment"
                  checked={incomeTypes.investment}
                  onCheckedChange={(checked) =>
                    setIncomeTypes((prev) => ({
                      ...prev,
                      investment: checked === true,
                    }))
                  }
                />
                <Label
                  htmlFor="investment"
                  className="text-sm font-normal cursor-pointer"
                >
                  Investment income
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rental"
                  checked={incomeTypes.rental}
                  onCheckedChange={(checked) =>
                    setIncomeTypes((prev) => ({
                      ...prev,
                      rental: checked === true,
                    }))
                  }
                />
                <Label
                  htmlFor="rental"
                  className="text-sm font-normal cursor-pointer"
                >
                  Rental income
                </Label>
              </div>
            </div>
          </div>

          {isExempt && annualIncome > 0 && (
            <Alert variant="success">
              <CheckCircle2 className="h-5 w-5" />
              <AlertTitle>Great news! You&apos;re exempt from Personal Income Tax</AlertTitle>
              <AlertDescription>
                Anyone earning ≤ {formatCurrency(800_000)}/year pays ZERO tax
                under the new law. You can download an exemption summary or
                continue to see the calculation breakdown.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              asChild
              variant="outline"
              className="flex-1"
            >
              <Link href="/">Back to Home</Link>
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed}
              className="flex-1"
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

