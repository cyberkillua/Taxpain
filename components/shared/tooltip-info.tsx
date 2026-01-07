"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface TooltipInfoProps {
  term: string;
  definition: string;
  example?: string;
  learnMoreUrl?: string;
}

const TERM_DEFINITIONS: Record<string, Omit<TooltipInfoProps, "term">> = {
  "Personal Income Tax (PIT)": {
    definition:
      "A tax levied on the income of individuals. In Nigeria, PIT is calculated using progressive tax rates based on income bands.",
    example: "If you earn ₦1,500,000/year, you pay different rates on different portions of your income.",
  },
  "Companies Income Tax (CIT)": {
    definition:
      "A tax on the profits of companies and corporations. The standard rate is 30% of profit.",
    example: "A company with ₦10M profit pays ₦3M in CIT (30%).",
  },
  "Development Levy": {
    definition:
      "An additional tax of 4% on company profits, collected alongside CIT to fund infrastructure development.",
    example: "On ₦10M profit, development levy is ₦400,000 (4%).",
  },
  "Capital Gains Tax (CGT)": {
    definition:
      "Tax on the profit from selling assets like property or shares. For companies, it's 30% of the gain.",
    example: "Selling a property for ₦5M that cost ₦3M results in ₦2M gain, taxed at 30% = ₦600,000.",
  },
  "Relief/Deduction": {
    definition:
      "Amounts you can subtract from your gross income to reduce your taxable income and tax liability.",
    example: "If you pay ₦600,000/year in rent, you get 20% relief (max ₦500,000) = ₦500,000 deduction.",
  },
  "Exemption threshold": {
    definition:
      "Income or business size limits below which you pay zero tax. Individuals earning ≤₦800K/year are exempt.",
    example: "If you earn exactly ₦800,000, you pay ₦0 in tax.",
  },
  "Progressive tax rate": {
    definition:
      "A tax system where higher income is taxed at higher rates. Different portions of your income are taxed at different rates.",
    example: "First ₦800K at 0%, next ₦300K at 7%, next ₦340K at 11%, etc.",
  },
};

export function TooltipInfo({ term, definition, example, learnMoreUrl }: TooltipInfoProps) {
  const content = TERM_DEFINITIONS[term] || { definition, example };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full text-slate-400 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label={`Learn more about ${term}`}
          >
            <Info className="h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="font-semibold mb-1">{term}</p>
          <p className="text-sm mb-2">{content.definition || definition}</p>
          {content.example && (
            <p className="text-xs text-slate-500 italic mb-2">
              Example: {content.example}
            </p>
          )}
          {learnMoreUrl && (
            <a
              href={learnMoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline"
            >
              Learn More →
            </a>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

