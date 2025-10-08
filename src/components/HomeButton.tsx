"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

const MENU_ITEMS = [
  { label: "Home", route: "/" },
  { label: "Novas Ofertas", route: "/nova-oferta" },
  { label: "Minhas Ofertas", route: "/minhas-ofertas" },
  { label: "Login", route: "/login" },
  { label: "Cadastro", route: "/cadastro" },
];

type Props = {
  position?: "right" | "left";
};

export default function HomeButton({ position = "right" }: Props) {
  const [open, setOpen] = useState(false);
  const containerClass =
    position === "left"
      ? "fixed bottom-6 left-6 z-50 flex flex-col items-start gap-3"
      : "fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 flex flex-col items-end gap-3";

  return (
    <div className={containerClass}>
      {open && (
        <div className="flex flex-col items-end gap-2 transition-all duration-200">
          {MENU_ITEMS.map((opt, i) => (
            <Link
              key={i}
              href={opt.route}
              onClick={() => setOpen(false)}
              className="bg-white text-[#1E90FF] font-medium shadow-md hover:bg-[#E6F2FF] px-4 py-2 rounded-full transition text-sm w-36 text-center"
            >
              {opt.label}
            </Link>
          ))}
        </div>
      )}

      <button
        type="button"
        aria-label="Abrir menu"
        onClick={() => setOpen((s) => !s)}
        className={`bg-[#1E90FF] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-transform duration-300 active:scale-95 ${
          open ? "rotate-45 bg-[#1878d8]" : ""
        }`}
      >
        <Plus size={20} />
      </button>
    </div>
  );
}
