# TAXPAIN - Nigerian Tax Calculator & Exemption Checker

A production-ready web application for calculating Nigerian taxes and checking exemption status under the 2025 Tax Reform Acts.

## Features

- **Individual Tax Calculator**: Calculate Personal Income Tax (PIT) with progressive rates
- **Business Tax Calculator**: Calculate Companies Income Tax (CIT), Capital Gains Tax (CGT), and Development Levy
- **Exemption Checker**: Automatically detect if you qualify for tax exemptions
- **Shareable Links**: Share your calculations via URL
- **PDF Export**: Download tax summaries as PDF (coming soon)
- **Mobile-First Design**: Optimized for mobile devices

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Runtime**: Bun
- **UI**: shadcn/ui + Tailwind CSS
- **Charts**: Recharts
- **PDF**: jsPDF (for future implementation)

## Getting Started

### Prerequisites

- Bun (v1.0+)

### Installation

```bash
# Install dependencies
bun install

# Run development server
bun run dev

# Build for production
bun run build

# Start production server
bun start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
taxpain/
├── app/                    # Next.js app router pages
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   ├── calculator/       # Calculator-specific components
│   └── shared/            # Shared components
├── lib/                   # Utility libraries
│   ├── api/              # NOTA API client
│   ├── calculations/     # Fallback tax calculations
│   └── utils/            # Utility functions
├── types/                # TypeScript type definitions
└── hooks/               # Custom React hooks
```

## API Integration

TAXPAIN integrates with the NOTA (Nigeria Tax API) service. If the API is unavailable, the app automatically falls back to client-side calculations based on the official 2025 Tax Act rates.

API Base URL: `https://hmwcdpm2zoz3qxqbsknzm6k5ie0arpgb.lambda-url.eu-north-1.on.aws`

## Tax Rates (2025 Act)

### Personal Income Tax (PIT)
- First ₦800,000: 0% (exempt)
- Next ₦300,000: 7%
- Next ₦340,000: 11%
- Next ₦360,000: 15%
- Next ₦400,000: 19%
- Next ₦800,000: 21%
- Above ₦3,000,000: 24%

### Companies Income Tax (CIT)
- Standard rate: 30%
- Development Levy: 4%

### Exemption Thresholds
- **Individuals**: Annual income ≤ ₦800,000
- **Businesses**: Turnover ≤ ₦100M AND Assets ≤ ₦250M

## License

MIT

## Disclaimer

This calculator provides estimates based on the Nigeria Tax Act 2025. Results are for informational purposes only and do not constitute professional tax advice. Consult a qualified tax professional for your specific situation.

