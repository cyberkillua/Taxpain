"use client";

import { Input } from "@/components/ui/input";
import { formatCurrencyInput, parseCurrency } from "@/lib/utils/currency";
import { useState, useEffect } from "react";

export interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value: number;
  onChange: (value: number) => void;
  label?: string;
}

export function CurrencyInput({
  value,
  onChange,
  label,
  className,
  ...props
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState(
    value > 0 ? formatCurrencyInput(value) : ""
  );

  useEffect(() => {
    if (value === 0) {
      setDisplayValue("");
    } else {
      const formatted = formatCurrencyInput(value);
      setDisplayValue(formatted);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setDisplayValue(inputValue);
    const parsed = parseCurrency(inputValue);
    onChange(parsed);
  };

  const handleBlur = () => {
    if (value > 0) {
      setDisplayValue(formatCurrencyInput(value));
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-2">{label}</label>
      )}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">
          ₦
        </span>
        <Input
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`pl-8 ${className || ""}`}
          placeholder="0"
          {...props}
        />
      </div>
    </div>
  );
}

