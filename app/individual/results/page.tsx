"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTaxCalculation } from "@/hooks/use-tax-calculation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TaxBreakdownChart } from "@/components/calculator/shared/tax-breakdown-chart";
import { formatCurrency, calculateEffectiveRate } from "@/lib/utils/currency";
import { copyToClipboard } from "@/lib/utils/share";
import { useState } from "react";
import { CheckCircle2, AlertCircle, Copy, Mail, Download, Share2, Save } from "lucide-react";
import Link from "next/link";
import { generateIndividualPDF } from "@/components/pdf/pdf-generator";
import { saveScenario } from "@/lib/storage/localStorage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { NIGERIAN_STATES } from "@/lib/constants/states";

export default function IndividualResultsPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-12 max-w-4xl">
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <p className="text-slate-600">Loading...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    }>
      <IndividualResultsContent />
    </Suspense>
  );
}

function IndividualResultsContent() {
  const searchParams = useSearchParams();
  const [state, setState] = useState(
    searchParams.get("state") || "FCT"
  );
  const [copied, setCopied] = useState(false);

  const income = parseFloat(searchParams.get("income") || "0");
  const rent = parseFloat(searchParams.get("rent") || "0");
  const pension = parseFloat(searchParams.get("pension") || "0");
  const lifeInsurance = parseFloat(searchParams.get("life_insurance") || "0");
  const nhf = parseFloat(searchParams.get("nhf") || "0");

  const { loading, error, result, usingFallback } = useTaxCalculation({
    income,
    reliefs: {
      annualRent: rent,
      pension,
      lifeInsurance,
      nhf,
    },
    state,
  });

  const handleCopyLink = async () => {
    const url = window.location.href;
    const success = await copyToClipboard(url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleEmail = () => {
    if (!result) return;

    const subject = `My Nigeria Tax Calculation - ${new Date().toLocaleDateString()}`;
    const body = `Here's my tax calculation from TAXPAIN:

Annual Income: ${formatCurrency(result.grossIncome)}
Reliefs & Deductions: ${formatCurrency(result.totalReliefs)}
Taxable Income: ${formatCurrency(result.taxableIncome)}
Tax Due: ${formatCurrency(result.taxDue)}
Effective Rate: ${result.effectiveRate.toFixed(2)}%

View full details: ${window.location.href}

Calculated on: ${new Date().toLocaleDateString()}
Based on Nigeria Tax Act 2025

---
TAXPAIN - Free Nigerian Tax Calculator
https://taxpain.com`;

    window.location.href = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  const handleDownloadPDF = async () => {
    if (!result) return;
    try {
      await generateIndividualPDF(result, "tax-breakdown-chart");
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const handleSaveScenario = () => {
    if (!result) return;
    
    const label = prompt("Enter a label for this scenario (e.g., 'Current Income', 'With Promotion'):");
    if (!label || label.trim() === "") return;

    const success = saveScenario({
      label: label.trim(),
      type: "individual",
      inputs: {
        annualIncome: income,
        incomeTypes: {
          employment: true,
          selfEmployment: false,
          investment: false,
          rental: false,
        },
      },
      results: result,
    });

    if (success) {
      alert("Scenario saved! View it in the Compare page.");
    } else {
      alert("Failed to save scenario. LocalStorage may be full.");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-12 max-w-4xl">
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <p className="text-slate-600">Calculating your tax...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-12 max-w-4xl">
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Alert variant="error">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {error || "Unable to calculate tax. Please check your inputs."}
                </AlertDescription>
              </Alert>
              <Button asChild className="mt-4">
                <Link href="/individual/income">Start New Calculation</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-8 lg:px-16 py-12 max-w-4xl">
      <div className="mb-6">
        <Label className="mb-2 block">State of Residence</Label>
        <Select value={state} onValueChange={setState}>
          <SelectTrigger className="w-full md:w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {NIGERIAN_STATES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {usingFallback && (
        <Alert variant="warning" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            API unavailable. Using offline calculation based on 2025 Tax Act.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Your 2026 Tax Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Gross Income:</span>
              <span className="font-semibold text-lg font-tabular">
                {formatCurrency(result.grossIncome)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Reliefs & Deductions:</span>
              <span className="font-semibold text-lg font-tabular text-primary">
                -{formatCurrency(result.totalReliefs)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Taxable Income:</span>
              <span className="font-semibold text-lg font-tabular">
                {formatCurrency(result.taxableIncome)}
              </span>
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between items-center pt-2">
              <span className="text-xl font-semibold">Tax Due:</span>
              <span className="text-2xl font-bold text-primary font-tabular">
                {formatCurrency(result.taxDue)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Effective Rate:</span>
              <span className="font-semibold text-lg font-tabular">
                {result.effectiveRate.toFixed(2)}%
              </span>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-lg mb-4">Tax Breakdown</h3>
            <div className="space-y-2 mb-4">
              {result.breakdown.map((entry, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-slate-600">
                    {entry.band}: {formatCurrency(entry.taxableAmount)} @{" "}
                    {(entry.rate * 100).toFixed(0)}%
                  </span>
                  <span className="font-semibold font-tabular">
                    {formatCurrency(entry.taxDue)}
                  </span>
                </div>
              ))}
            </div>
            <div id="tax-breakdown-chart">
              <TaxBreakdownChart breakdown={result.breakdown} />
            </div>
          </div>

          <Separator />

          <div className="flex flex-wrap gap-3">
            <Button onClick={handleCopyLink} variant="outline" className="flex-1 min-w-[140px]">
              <Copy className="h-4 w-4 mr-2" />
              {copied ? "Copied!" : "Copy Link"}
            </Button>
            <Button onClick={handleEmail} variant="outline" className="flex-1 min-w-[140px]">
              <Mail className="h-4 w-4 mr-2" />
              Email Result
            </Button>
            <Button onClick={handleDownloadPDF} variant="outline" className="flex-1 min-w-[140px]">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button onClick={handleSaveScenario} variant="outline" className="flex-1 min-w-[140px]">
              <Save className="h-4 w-4 mr-2" />
              Save Scenario
            </Button>
            <Button asChild variant="outline" className="flex-1 min-w-[140px]">
              <Link href="/individual/income">
                <Share2 className="h-4 w-4 mr-2" />
                New Calculation
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

