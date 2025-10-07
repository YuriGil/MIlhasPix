// src/context/BalanceContext.tsx (pequena atualização)
"use client";
import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";

interface BalanceContextType {
  balance: number;
  setBalance: (value: number | ((prev: number) => number)) => void;
  formattedBalance: string;
}

const STORAGE_KEY = "milhaspix_balance";

const BalanceContext = createContext<BalanceContextType>({
  balance: 0,
  setBalance: () => {},
  formattedBalance: "R$ 0,00",
});

export const BalanceProvider = ({ children }: { children: React.ReactNode }) => {
  const [balance, setBalanceState] = useState<number>(() => {
    try {
      if (typeof window === "undefined") return 0;
      const raw = localStorage.getItem(STORAGE_KEY);
      const v = raw ? Number(raw) : NaN;
      return Number.isFinite(v) ? v : 283.12;
    } catch {
      return 283.12;
    }
  });

  const setBalance = useCallback((value: number | ((prev: number) => number)) => {
    setBalanceState((prev) => {
      const next = typeof value === "function" ? (value as (p: number) => number)(prev) : value;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
        // also update 'milhaspix_balance' for header storage listener compatibility
        localStorage.setItem("milhaspix_balance", String(next));
      } catch {}
      return next;
    });
  }, []);

  useEffect(() => {
    const onStorage = (ev: StorageEvent) => {
      if (ev.key === STORAGE_KEY || ev.key === "milhaspix_balance") {
        const v = Number(ev.newValue);
        if (!Number.isNaN(v)) setBalanceState(v);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const formattedBalance = useMemo(() => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(balance);
  }, [balance]);

  return (
    <BalanceContext.Provider value={{ balance, setBalance, formattedBalance }}>
      {children}
    </BalanceContext.Provider>
  );
};

export function useBalance() {
  return useContext(BalanceContext);
}
