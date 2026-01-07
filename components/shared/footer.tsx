import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-background-muted mt-auto">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">TAXPAIN</h3>
            <p className="text-sm text-slate-600">
              Free Nigerian tax calculator for individuals and businesses.
              Understand your tax obligations under the 2025 Tax Reform Acts.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/individual/income"
                  className="text-slate-600 hover:text-primary transition-colors"
                >
                  Individual Calculator
                </Link>
              </li>
              <li>
                <Link
                  href="/business/basics"
                  className="text-slate-600 hover:text-primary transition-colors"
                >
                  Business Calculator
                </Link>
              </li>
              <li>
                <Link
                  href="/compare"
                  className="text-slate-600 hover:text-primary transition-colors"
                >
                  Compare Scenarios
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-slate-600 hover:text-primary transition-colors"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-slate-600 hover:text-primary transition-colors"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-200">
          <p className="text-xs text-slate-500 text-center">
            <strong>Disclaimer:</strong> This calculator provides estimates
            based on the Nigeria Tax Act 2025. Results are for informational
            purposes only and do not constitute professional tax advice. Consult
            a qualified tax professional for your specific situation.
          </p>
          <p className="text-xs text-slate-500 text-center mt-2">
            © {new Date().getFullYear()} TAXPAIN. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

