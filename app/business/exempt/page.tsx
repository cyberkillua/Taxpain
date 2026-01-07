"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatCurrency } from "@/lib/utils/currency";
import { CheckCircle2, AlertCircle, Download, Mail } from "lucide-react";
import { checkBusinessExemption } from "@/lib/calculations/exemption";

function BusinessExemptContent() {
  const searchParams = useSearchParams();
  const turnover = parseFloat(searchParams.get("turnover") || "0");
  const assets = parseFloat(searchParams.get("assets") || "0");
  const structure = searchParams.get("structure") || "sole_proprietorship";

  const exemptionCheck = checkBusinessExemption(turnover, assets);

  return (
    <div className="container mx-auto px-4 md:px-8 lg:px-16 py-12 max-w-3xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-4">
          🎉 Your business qualifies for FULL TAX EXEMPTION!
        </h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Exemption Eligibility</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
            <div>
              <p className="font-semibold">Turnover: {formatCurrency(turnover)}</p>
              <p className="text-sm text-slate-600">
                (Under ₦100M threshold)
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
            <div>
              <p className="font-semibold">
                Fixed Assets: {formatCurrency(assets)}
              </p>
              <p className="text-sm text-slate-600">
                (Under ₦250M threshold)
              </p>
            </div>
          </div>
          <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg mt-4">
            <p className="font-semibold text-primary">Status: FULLY EXEMPT</p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>You are exempt from:</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span>Companies Income Tax (CIT)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span>Capital Gains Tax (CGT)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span>Development Levy (4%)</span>
            </li>
            {turnover < 100_000_000 && (
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span>VAT (if turnover &lt; ₦100M)</span>
              </li>
            )}
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span className="text-slate-400">□</span>
              <span>
                Register with FIRS to obtain exemption certificate
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-slate-400">□</span>
              <span>Maintain accurate records to prove eligibility</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-slate-400">□</span>
              <span>Monitor growth quarterly</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-slate-400">□</span>
              <span>Recalculate if turnover/assets increase</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Alert variant="warning" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Important: Monitor Your Growth</AlertTitle>
        <AlertDescription>
          If your turnover exceeds ₦100M or assets exceed ₦250M, you will lose
          this exemption. Check back quarterly.
        </AlertDescription>
      </Alert>

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" className="flex-1 min-w-[140px]" disabled>
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
        <Button variant="outline" className="flex-1 min-w-[140px]" disabled>
          <Mail className="h-4 w-4 mr-2" />
          Email Result
        </Button>
        <Button
          asChild
          variant="outline"
          className="flex-1 min-w-[140px]"
        >
          <Link
            href={`/business/calculate?${searchParams.toString()}`}
          >
            Calculate Tax Anyway
          </Link>
        </Button>
        <Button asChild className="flex-1 min-w-[140px]">
          <Link href="/business/basics">Start New Calculation</Link>
        </Button>
      </div>
    </div>
  );
}

export default function BusinessExemptPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-12 max-w-3xl">
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <p className="text-slate-600">Loading...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    }>
      <BusinessExemptContent />
    </Suspense>
  );
}

