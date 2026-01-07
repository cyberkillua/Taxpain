"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils/currency";
import {
  getSavedScenarios,
  clearAllScenarios,
  deleteScenario,
} from "@/lib/storage/localStorage";
import type { SavedScenario } from "@/types/calculator";
import { Trash2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ComparePage() {
  const [scenarios, setScenarios] = useState<SavedScenario[]>([]);

  useEffect(() => {
    setScenarios(getSavedScenarios());
  }, []);

  const handleDelete = (id: string) => {
    if (deleteScenario(id)) {
      setScenarios(getSavedScenarios());
    }
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to delete all saved scenarios?")) {
      if (clearAllScenarios()) {
        setScenarios([]);
      }
    }
  };

  if (scenarios.length === 0) {
    return (
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-12 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Compare Scenarios</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No saved scenarios yet. Complete a calculation and use the &quot;Save
                Scenario&quot; option to compare different tax scenarios.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  const individualScenarios = scenarios.filter((s) => s.type === "individual");
  const businessScenarios = scenarios.filter((s) => s.type === "business");

  return (
    <div className="container mx-auto px-4 md:px-8 lg:px-16 py-12 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Compare Scenarios</h1>
        {scenarios.length > 0 && (
          <Button variant="outline" onClick={handleClearAll}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      <Tabs defaultValue="individual" className="w-full">
        <TabsList>
          <TabsTrigger value="individual">
            Individual ({individualScenarios.length})
          </TabsTrigger>
          <TabsTrigger value="business">
            Business ({businessScenarios.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="mt-6">
          {individualScenarios.length > 0 ? (
            <ComparisonTable
              scenarios={individualScenarios}
              type="individual"
              onDelete={handleDelete}
            />
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-slate-500">
                No individual scenarios saved yet.
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="business" className="mt-6">
          {businessScenarios.length > 0 ? (
            <ComparisonTable
              scenarios={businessScenarios}
              type="business"
              onDelete={handleDelete}
            />
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-slate-500">
                No business scenarios saved yet.
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ComparisonTable({
  scenarios,
  type,
  onDelete,
}: {
  scenarios: SavedScenario[];
  type: "individual" | "business";
  onDelete: (id: string) => void;
}) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="text-left p-4 font-semibold">Scenario</th>
                {type === "individual" ? (
                  <>
                    <th className="text-right p-4 font-semibold">Income</th>
                    <th className="text-right p-4 font-semibold">Tax Due</th>
                    <th className="text-right p-4 font-semibold">Rate</th>
                  </>
                ) : (
                  <>
                    <th className="text-right p-4 font-semibold">Profit</th>
                    <th className="text-right p-4 font-semibold">Tax Due</th>
                    <th className="text-right p-4 font-semibold">Rate</th>
                  </>
                )}
                <th className="text-right p-4 font-semibold">Date</th>
                <th className="text-center p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {scenarios.map((scenario) => {
                const result =
                  type === "individual"
                    ? (scenario.results as any)
                    : (scenario.results as any);

                return (
                  <tr key={scenario.id} className="border-b hover:bg-slate-50">
                    <td className="p-4 font-medium">{scenario.label}</td>
                    {type === "individual" ? (
                      <>
                        <td className="p-4 text-right font-tabular">
                          {formatCurrency(result.grossIncome || 0)}
                        </td>
                        <td className="p-4 text-right font-tabular text-primary font-semibold">
                          {formatCurrency(result.taxDue || 0)}
                        </td>
                        <td className="p-4 text-right font-tabular">
                          {result.effectiveRate?.toFixed(2) || "0.00"}%
                        </td>
                      </>
                ) : (
                      <>
                        <td className="p-4 text-right font-tabular">
                          {formatCurrency(result.profit || 0)}
                        </td>
                        <td className="p-4 text-right font-tabular text-primary font-semibold">
                          {formatCurrency(result.totalTaxDue || 0)}
                        </td>
                        <td className="p-4 text-right font-tabular">
                          {result.effectiveRate?.toFixed(2) || "0.00"}%
                        </td>
                      </>
                    )}
                    <td className="p-4 text-right text-sm text-slate-500">
                      {new Date(scenario.timestamp).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(scenario.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

