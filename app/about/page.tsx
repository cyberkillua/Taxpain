import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 md:px-8 lg:px-16 py-12 max-w-3xl">
      <h1 className="text-4xl font-bold mb-6">About TAXPAIN</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Our Mission</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600">
            TAXPAIN is a free, open-source tool designed to help Nigerian
            individuals and businesses understand their tax obligations under
            the 2025 Tax Reform Acts. We believe that tax information should be
            accessible, transparent, and easy to understand.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 mb-4">
            Our calculator uses the official Nigeria Tax Act 2025 rates and
            thresholds to provide accurate tax estimates. We integrate with the
            NOTA (Nigeria Tax API) service when available, with automatic
            fallback to client-side calculations based on the official tax
            rates.
          </p>
          <p className="text-slate-600">
            All calculations happen in your browser. We don&apos;t store your
            data or require any signup.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Disclaimer</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600">
            This calculator provides estimates based on the Nigeria Tax Act
            2025. Results are for informational purposes only and do not
            constitute professional tax advice. Consult a qualified tax
            professional for your specific situation.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

