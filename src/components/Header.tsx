// src/components/Header.tsx
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useBalance } from "../context/BalanceContext";

export default function Header() {
  const path = usePathname();
  const { formattedBalance } = useBalance();
  const [displayBalance, setDisplayBalance] = useState<string>(formattedBalance);

  useEffect(() => {
    setDisplayBalance(formattedBalance);
  }, [formattedBalance]);

  useEffect(() => {
    const handle = (e: StorageEvent) => {
      if (e.key === "milhaspix_balance") {
        const v = Number(e.newValue);
        if (!Number.isNaN(v)) {
          setDisplayBalance(
            new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v)
          );
        }
      }
    };
    window.addEventListener("storage", handle);
    return () => window.removeEventListener("storage", handle);
  }, []);

  const pageTitle =
    path === "/nova-oferta" ? "Nova Oferta" : path === "/minhas-ofertas" ? "Minhas Ofertas" : "";

  return (
    <header className="header-bar">
      <div className="header-inner">
        <div className="flex items-center gap-3">
          <Image src="/images/logo.png" alt="MilhasPix" width={160} height={40} className="logo" priority />
          {pageTitle ? <span className="header-title hidden sm:inline">{pageTitle}</span> : null}
        </div>

        <div>
          <div className="balance-pill" aria-live="polite" aria-atomic="true">
            <span style={{ opacity: 0.95 }}>{displayBalance}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
