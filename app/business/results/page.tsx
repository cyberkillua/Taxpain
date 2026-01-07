"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useBusinessTaxCalculation } from "@/hooks/use-business-tax-calculation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatCurrency } from "@/lib/utils/currency";
import { copyToClipboard } from "@/lib/utils/share";
import { useState } from "react";
import { AlertCircle, Copy, Mail, Download, Share2, Save } from "lucide-react";
import Link from "next/link";
import { checkBusinessExemption } from "@/lib/calculations/exemption";
import { generateBusinessPDF } from "@/components/pdf/pdf-generator";
import { saveScenario } from "@/lib/storage/localStorage";

function BusinessResultsContent() {
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);

  const turnover = parseFloat(searchParams.get("turnover") || "0");
  const assets = parseFloat(searchParams.get("assets") || "0");
  const profit = parseFloat(searchParams.get("profit") || "0");
  const capitalGains = parseFloat(searchParams.get("capital_gains") || "0");
  const structure = searchParams.get("structure") || "sole_proprietorship";

  const exemptionCheck = checkBusinessExemption(turnover, assets);
  const isExempt = exemptionCheck.isExempt;

  const { loading, error, result, usingFallback } = useBusinessTaxCalculation({
    profit,
    capitalGains,
    turnover,
    assets,
    structure,
    isExempt,
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

    const subject = `My Business Tax Calculation - ${new Date().toLocaleDateString()}`;
    const body = `Here's my business tax calculation from TAXPAIN:

Profit Before Tax: ${formatCurrency(result.profit)}
Companies Income Tax: ${formatCurrency(result.citDue)}
Capital Gains Tax: ${formatCurrency(result.cgtDue)}
Development Levy: ${formatCurrency(result.developmentLevy)}
Total Tax Due: ${formatCurrency(result.totalTaxDue)}
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
      await generateBusinessPDF(result);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const handleSaveScenario = () => {
    if (!result) return;
    
    const label = prompt("Enter a label for this scenario (e.g., 'Current Business', 'After Expansion'):");
    if (!label || label.trim() === "") return;

    const success = saveScenario({
      label: label.trim(),
      type: "business",
      inputs: {
        structure: structure as any,
        turnover,
        assets,
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
                <Link href="/business/basics">Start New Calculation</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-8 lg:px-16 py-12 max-w-4xl">
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
          <CardTitle className="text-3xl">Your 2026 Business Tax Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Profit Before Tax:</span>
              <span className="font-semibold text-lg font-tabular">
                {formatCurrency(result.profit)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Companies Income Tax:</span>
              <span className="font-semibold text-lg font-tabular">
                {formatCurrency(result.citDue)}
              </span>
              <span className="text-sm text-slate-500">(30% of profit)</span>
            </div>
            {result.cgtDue > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Capital Gains Tax:</span>
                <span className="font-semibold text-lg font-tabular">
                  {formatCurrency(result.cgtDue)}
                </span>
                <span className="text-sm text-slate-500">(30% of gains)</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Development Levy:</span>
              <span className="font-semibold text-lg font-tabular">
                {formatCurrency(result.developmentLevy)}
              </span>
              <span className="text-sm text-slate-500">(4% of profit)</span>
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between items-center pt-2">
              <span className="text-xl font-semibold">Total Tax Due:</span>
              <span className="text-2xl font-bold text-primary font-tabular">
                {formatCurrency(result.totalTaxDue)}
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
              <Link href="/business/basics">
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

export default function BusinessResultsPage() {
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
      <BusinessResultsContent />
    </Suspense>
  );
}

