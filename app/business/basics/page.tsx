"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencyInput } from "@/components/shared/currency-input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ProgressIndicator } from "@/components/shared/progress-indicator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { checkBusinessExemption } from "@/lib/calculations/exemption";
import { formatCurrency } from "@/lib/utils/currency";
import { CheckCircle2, XCircle } from "lucide-react";
import type { BusinessStructure } from "@/types/calculator";

export default function BusinessBasicsPage() {
  const router = useRouter();
  const [structure, setStructure] = useState<BusinessStructure>("sole_proprietorship");
  const [turnover, setTurnover] = useState(0);
  const [assets, setAssets] = useState(0);

  const exemptionCheck = checkBusinessExemption(turnover, assets);

  const canProceed = turnover > 0 && assets >= 0;

  const handleNext = () => {
    if (!canProceed) return;

    const params = new URLSearchParams({
      structure,
      turnover: turnover.toString(),
      assets: assets.toString(),
    });

    if (exemptionCheck.isExempt) {
      router.push(`/business/exempt?${params.toString()}`);
    } else {
      router.push(`/business/calculate?${params.toString()}`);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-8 lg:px-16 py-12 max-w-2xl">
      <ProgressIndicator currentStep={1} totalSteps={2} />

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-3xl">Business Basics</CardTitle>
          <p className="text-slate-600 mt-2">
            Enter your business details to check exemption status
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-semibold mb-3 block">
              Business Structure
            </Label>
            <RadioGroup value={structure} onValueChange={(v) => setStructure(v as BusinessStructure)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sole_proprietorship" id="sole" />
                <Label htmlFor="sole" className="font-normal cursor-pointer">
                  Sole Proprietorship
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ltd" id="ltd" />
                <Label htmlFor="ltd" className="font-normal cursor-pointer">
                  Limited Company (Ltd/PLC)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="partnership" id="partnership" />
                <Label htmlFor="partnership" className="font-normal cursor-pointer">
                  Partnership
                </Label>
              </div>
            </RadioGroup>
          </div>

          <CurrencyInput
            value={turnover}
            onChange={setTurnover}
            label="Annual Turnover"
            placeholder="Enter annual turnover"
          />

          <CurrencyInput
            value={assets}
            onChange={setAssets}
            label="Total Fixed Assets"
            placeholder="Enter total fixed assets"
          />

          {turnover > 0 && (
            <Alert
              variant={exemptionCheck.isExempt ? "success" : "default"}
            >
              {exemptionCheck.isExempt ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
              <AlertTitle>
                Exemption Check:{" "}
                {exemptionCheck.isExempt ? "QUALIFIED" : "NOT EXEMPT"}
              </AlertTitle>
              <AlertDescription>
                <div className="space-y-1 mt-2">
                  <div className="flex items-center gap-2">
                    {exemptionCheck.turnoverQualified ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : (
                      <XCircle className="h-4 w-4 text-error" />
                    )}
                    <span>
                      Turnover: {formatCurrency(turnover)} (
                      {exemptionCheck.turnoverQualified
                        ? "Under ₦100M threshold"
                        : "Exceeds ₦100M threshold"}
                      )
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {exemptionCheck.assetsQualified ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : (
                      <XCircle className="h-4 w-4 text-error" />
                    )}
                    <span>
                      Fixed Assets: {formatCurrency(assets)} (
                      {exemptionCheck.assetsQualified
                        ? "Under ₦250M threshold"
                        : "Exceeds ₦250M threshold"}
                      )
                    </span>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button asChild variant="outline" className="flex-1">
              <Link href="/">Back to Home</Link>
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed}
              className="flex-1"
            >
              {exemptionCheck.isExempt
                ? "View Exemption Details"
                : "Calculate Tax →"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

