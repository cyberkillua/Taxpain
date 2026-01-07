import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container mx-auto px-4 md:px-8 lg:px-16 py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Know Your Tax Position in{" "}
            <span className="text-primary">60 Seconds</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-8">
            Free calculator for Nigeria Tax Act 2025. No signup. No BS.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/individual/income">Individual Calculator</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6"
            >
              <Link href="/business/basics">Business Calculator</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-background-muted py-12">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              <span>Based on official 2025 Tax Acts</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              <span>No data stored</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              <span>100% free</span>
            </div>
          </div>
        </div>
      </section>

      {/* Explainer Cards */}
      <section className="container mx-auto px-4 md:px-8 lg:px-16 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>What Changed</CardTitle>
              <CardDescription>
                Understanding the 2025 Tax Reform Acts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                The Nigeria Tax Act 2025 introduces new progressive tax rates,
                exemption thresholds, and relief structures. Our calculator
                reflects all these changes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Who&apos;s Exempt</CardTitle>
              <CardDescription>Check your exemption status</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Individuals earning ≤ ₦800,000/year are exempt from Personal
                Income Tax. Small businesses with turnover ≤ ₦100M and assets ≤
                ₦250M may qualify for full exemption.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How to Use</CardTitle>
              <CardDescription>Simple 3-step process</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                1. Enter your income or business details. 2. Add deductions and
                reliefs. 3. Get your tax summary with breakdown and PDF
                download option.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

