"use client";

import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { BalanceContext } from "../context/BalanceContext";

export default function Header() {
  const { balance } = useContext(BalanceContext);

  return (
    <header className="bg-[#1E90FF]">
      <div className="max-w-[1216px] mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/">
          <Image
            src="/images/logo.png"
            alt="MilhasPix"
            width={140}
            height={36}
            priority
            className="object-contain"
          />
        </Link>

        <div className="inline-flex items-center px-4 py-2 rounded-full border border-[#CAE6FB] bg-[#1E90FF]/10">
          <span className="text-white font-medium text-sm">
            R${" "}
            {balance.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>
    </header>
  );
}
