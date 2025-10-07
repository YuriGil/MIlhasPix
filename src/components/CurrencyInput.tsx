"use client";
import React from "react";

type Props = {
  value: string;
  onChange: (formatted: string) => void;
  placeholder?: string;
};

/** Helpers */
const onlyDigits = (s: string) => s.replace(/\D/g, "");
const formatBRLFromDigits = (digits: string) => {
  if (!digits) return "";
  // ensure at least 3 digits so we always have cents
  while (digits.length < 3) digits = "0" + digits;
  const cents = digits.slice(-2);
  const intPart = digits.slice(0, -2);
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `R$ ${grouped},${cents}`;
};

export default function CurrencyInput({ value, onChange, placeholder }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const digits = onlyDigits(raw);
    const formatted = formatBRLFromDigits(digits);
    onChange(formatted);
  };

  return (
    <input
      inputMode="numeric"
      value={value}
      onChange={handleChange}
      placeholder={placeholder || "R$ 0,00"}
      className="currency-input"
      aria-label="Valor por milheiro"
    />
  );
}
