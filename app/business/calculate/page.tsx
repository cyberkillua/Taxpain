"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencyInput } from "@/components/shared/currency-input";
import { ProgressIndicator } from "@/components/shared/progress-indicator";

function BusinessCalculateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [profit, setProfit] = useState(0);
  const [capitalGains, setCapitalGains] = useState(0);
  const [specialDeductions, setSpecialDeductions] = useState(0);

  const handleCalculate = () => {
    if (profit <= 0) return;

    const params = new URLSearchParams({
      structure: searchParams.get("structure") || "sole_proprietorship",
      turnover: searchParams.get("turnover") || "0",
      assets: searchParams.get("assets") || "0",
      profit: profit.toString(),
      capital_gains: capitalGains.toString(),
      special_deductions: specialDeductions.toString(),
    });

    router.push(`/business/results?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 md:px-8 lg:px-16 py-12 max-w-2xl">
      <ProgressIndicator currentStep={2} totalSteps={2} />

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-3xl">Tax Calculation</CardTitle>
          <p className="text-slate-600 mt-2">
            Enter your business financial details
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <CurrencyInput
            value={profit}
            onChange={setProfit}
            label="Profit Before Tax"
            placeholder="Enter profit before tax"
            required
          />

          <CurrencyInput
            value={capitalGains}
            onChange={setCapitalGains}
            label="Capital Gains (if any)"
            placeholder="Enter capital gains"
          />

          <CurrencyInput
            value={specialDeductions}
            onChange={setSpecialDeductions}
            label="Special Deductions (optional)"
            placeholder="Enter special deductions"
          />

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={handleCalculate}
              disabled={profit <= 0}
              className="flex-1"
            >
              Calculate Tax →
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function BusinessCalculatePage() {
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
      <BusinessCalculateContent />
    </Suspense>
  );
}

