"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function Header({ balance = "R$ 283,12" }: { balance?: string }) {
  const router = useRouter();
  return (
    <header className="w-full bg-primary text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white rounded-sm flex items-center justify-center">
            {/* Placeholder logo; replace with <Image> */}
            <span className="text-primary font-bold">✈</span>
          </div>
          <div className="text-lg font-semibold">MilhasPix</div>
        </div>

        <div>
          <button
            className="border border-white rounded-full px-4 py-1 text-white bg-transparent hover:bg-white/10"
            onClick={() => {}}
          >
            {balance}
          </button>
        </div>
      </div>
    </header>
  );
}
