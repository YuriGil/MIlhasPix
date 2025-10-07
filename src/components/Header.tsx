"use client";
import React from "react";
import { usePathname } from "next/navigation";

export default function Header({ balance = "R$ 283,12" }: { balance?: string }) {
  const path = usePathname();
  return (
    <header className="header-bar">
      <div className="header-inner">
        <div className="left">
          <img src="/logo-horizontal.png" alt="MilhasPix" className="logo" />
        </div>
        <div className="right">
          <div className="balance-pill" title="Saldo">
            {balance}
          </div>
        </div>
      </div>
    </header>
  );
}
