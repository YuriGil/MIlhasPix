"use client";
import React from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
};

function onlyDigits(s: string) {
  return s.replace(/[^0-9]/g, "");
}

// format to "R$ 1.234,56" from raw digits string that represents cents
export function formatBRLFromDigits(digits: string) {
  if (!digits) return "";
  // ensure at least 3 chars for formatting (ex: '5' => '0,05')
  let d = digits;
  while (d.length < 3) d = "0" + d;
  const cents = d.slice(-2);
  const integer = d.slice(0, -2);
  // group integer with dots
  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `R$ ${grouped},${cents}`;
}

export default function CurrencyInput({ value, onChange, placeholder }: Props) {
  // value is formatted (R$ ...) externally; internally we hold digits string
  // We'll accept both formatted and digits; onChange returns formatted string
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const digits = onlyDigits(raw);
    const formatted = formatBRLFromDigits(digits);
    onChange(formatted);
  };

  return (
    <input
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      inputMode="numeric"
      className="w-full rounded-lg border border-gray-200 px-4 py-2 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
    />
  );
}
