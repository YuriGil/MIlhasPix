"use client";

import React from "react";

type InputMaskProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

export default function InputMask({
  value,
  onChange,
  placeholder,
}: InputMaskProps) {
  // Aplica máscara: R$ X,XX
  const formatCurrency = (val: string) => {
    let onlyNums = val.replace(/\D/g, "");
    if (!onlyNums) return "";
    let int = onlyNums.slice(0, -2) || "0";
    let dec = onlyNums.slice(-2);
    return `R$ ${parseInt(int, 10).toLocaleString("pt-BR")},${dec}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const onlyNums = raw.replace(/\D/g, "");
    const formatted = formatCurrency(onlyNums);
    e.target.value = formatted;
    onChange(e);
  };

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className="w-full border border-grayCustom-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary text-grayCustom-800 font-medium"
    />
  );
}
