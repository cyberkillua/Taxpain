"use client";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import type { IndividualCalculationResult, BusinessCalculationResult } from "@/types/calculator";
import { formatCurrency } from "@/lib/utils/currency";

interface PDFGeneratorProps {
  type: "individual" | "business";
  data: IndividualCalculationResult | BusinessCalculationResult;
  chartElementId?: string;
}

export async function generateIndividualPDF(
  data: IndividualCalculationResult,
  chartElementId?: string
): Promise<void> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = margin;

  // Header
  doc.setFontSize(20);
  doc.setTextColor(16, 185, 129); // Primary green
  doc.text("TAXPAIN", margin, yPos);
  yPos += 10;

  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text("Tax Summary 2026", margin, yPos);
  yPos += 8;

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, yPos);
  yPos += 15;

  // Section: Individual Tax Calculation
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text("INDIVIDUAL TAX CALCULATION", margin, yPos);
  yPos += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  // Income details
  doc.text(`Gross Income: ${formatCurrency(data.grossIncome)}`, margin, yPos);
  yPos += 7;

  doc.text(
    `Reliefs & Deductions: -${formatCurrency(data.totalReliefs)}`,
    margin,
    yPos
  );
  yPos += 7;

  doc.setDrawColor(200, 200, 200);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 7;

  doc.text(
    `Taxable Income: ${formatCurrency(data.taxableIncome)}`,
    margin,
    yPos
  );
  yPos += 10;

  // Tax breakdown table
  if (data.breakdown && data.breakdown.length > 0) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Tax Breakdown", margin, yPos);
    yPos += 8;

    const tableData = data.breakdown.map((entry) => [
      entry.band,
      `${(entry.rate * 100).toFixed(0)}%`,
      formatCurrency(entry.taxableAmount),
      formatCurrency(entry.taxDue),
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [["Band", "Rate", "Taxable Amount", "Tax Due"]],
      body: tableData,
      theme: "striped",
      headStyles: { fillColor: [16, 185, 129] },
      margin: { left: margin, right: margin },
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;
  }

  // Total Tax Due
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(
    `Total Tax Due: ${formatCurrency(data.taxDue)}`,
    margin,
    yPos
  );
  yPos += 7;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Effective Rate: ${data.effectiveRate.toFixed(2)}%`,
    margin,
    yPos
  );
  yPos += 15;

  // Chart (if available)
  if (chartElementId) {
    try {
      const chartElement = document.getElementById(chartElementId);
      if (chartElement) {
        const canvas = await html2canvas(chartElement, {
          backgroundColor: "#ffffff",
          scale: 2,
        });
        const imgData = canvas.toDataURL("image/png");

        // Check if we need a new page
        if (yPos + 80 > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage();
          yPos = margin;
        }

        const imgWidth = pageWidth - margin * 2;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        doc.addImage(imgData, "PNG", margin, yPos, imgWidth, imgHeight);
        yPos += imgHeight + 10;
      }
    } catch (error) {
      console.warn("Failed to include chart in PDF:", error);
    }
  }

  // Footer
  const pageHeight = doc.internal.pageSize.getHeight();
  yPos = pageHeight - 40;

  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(
    "Disclaimer: This calculator provides estimates based on the Nigeria Tax Act 2025.",
    margin,
    yPos,
    { maxWidth: pageWidth - margin * 2 }
  );
  yPos += 5;
  doc.text(
    "Results are for informational purposes only and do not constitute professional tax advice.",
    margin,
    yPos,
    { maxWidth: pageWidth - margin * 2 }
  );
  yPos += 5;
  doc.text("taxpain.com", margin, yPos);

  // Save
  doc.save(`TaxSummary_${new Date().toISOString().split("T")[0]}.pdf`);
}

export async function generateBusinessPDF(
  data: BusinessCalculationResult,
  chartElementId?: string
): Promise<void> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = margin;

  // Header
  doc.setFontSize(20);
  doc.setTextColor(16, 185, 129);
  doc.text("TAXPAIN", margin, yPos);
  yPos += 10;

  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text("Business Tax Summary 2026", margin, yPos);
  yPos += 8;

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, yPos);
  yPos += 15;

  // Section: Business Tax Calculation
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text("BUSINESS TAX CALCULATION", margin, yPos);
  yPos += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  doc.text(`Profit Before Tax: ${formatCurrency(data.profit)}`, margin, yPos);
  yPos += 10;

  // Tax breakdown
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Tax Breakdown", margin, yPos);
  yPos += 8;

  const tableData = [
    ["Companies Income Tax (30%)", formatCurrency(data.citDue)],
    ["Capital Gains Tax", formatCurrency(data.cgtDue)],
    ["Development Levy (4%)", formatCurrency(data.developmentLevy)],
  ];

  autoTable(doc, {
    startY: yPos,
    head: [["Tax Type", "Amount"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [16, 185, 129] },
    margin: { left: margin, right: margin },
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Total
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Total Tax Due: ${formatCurrency(data.totalTaxDue)}`, margin, yPos);
  yPos += 7;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Effective Rate: ${data.effectiveRate.toFixed(2)}%`, margin, yPos);
  yPos += 15;

  // Footer
  const pageHeight = doc.internal.pageSize.getHeight();
  yPos = pageHeight - 40;

  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(
    "Disclaimer: This calculator provides estimates based on the Nigeria Tax Act 2025.",
    margin,
    yPos,
    { maxWidth: pageWidth - margin * 2 }
  );
  yPos += 5;
  doc.text(
    "Results are for informational purposes only and do not constitute professional tax advice.",
    margin,
    yPos,
    { maxWidth: pageWidth - margin * 2 }
  );
  yPos += 5;
  doc.text("taxpain.com", margin, yPos);

  // Save
  doc.save(`BusinessTaxSummary_${new Date().toISOString().split("T")[0]}.pdf`);
}

