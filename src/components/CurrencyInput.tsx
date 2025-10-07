// src/components/CurrencyInput.tsx
"use client";
import React from "react";

type Props = {
  value: string;
  onChange: (formatted: string) => void;
  placeholder?: string;
};

const onlyDigits = (s: string) => s.replace(/\D/g, "");
const formatBRLFromDigits = (digits: string) => {
  if (!digits) return "R$ 0,00";
  let d = digits;
  // ensure at least 3 chars so we always have cents
  while (d.length < 3) d = "0" + d;
  const cents = d.slice(-2);
  const intPart = d.slice(0, -2) || "0";
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `R$ ${grouped},${cents}`;
};

export default function CurrencyInput({ value, onChange, placeholder }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = onlyDigits(e.target.value);
    onChange(formatBRLFromDigits(digits));
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const txt = e.clipboardData.getData("text/plain");
    const digits = onlyDigits(txt);
    e.preventDefault();
    onChange(formatBRLFromDigits(digits));
  };

  return (
    <input
      inputMode="numeric"
      value={value}
      onChange={handleChange}
      onFocus={(e) => e.currentTarget.select()}
      onPaste={handlePaste}
      placeholder={placeholder || "R$ 0,00"}
      className="currency-input input"
      aria-label="Valor por 1.000 milhas"
      autoComplete="off"
    />
  );
}
