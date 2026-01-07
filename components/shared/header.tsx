import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">TAXPAIN</span>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link
              href="/about"
              className="text-sm font-medium text-slate-700 hover:text-primary transition-colors"
            >
              About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

