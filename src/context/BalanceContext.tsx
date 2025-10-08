"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";

interface BalanceContextType {
  balance: number;
  setBalance: (value: number) => void;
}

export const BalanceContext = createContext<BalanceContextType>({
  balance: 0,
  setBalance: () => {},
});

export function BalanceProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    async function fetchBalance() {
      try {
        const ls = typeof window !== "undefined" ? localStorage.getItem("userBalance") : null;
        if (ls) {
          const n = Number(ls);
          if (!Number.isNaN(n)) {
            setBalance(n);
            return;
          }
        }

        const res = await fetch("/api/offers");
        if (!res.ok) {
          setBalance(0);
          return;
        }
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          let sum = 0;
          for (const it of data) {
            const v = Number(it.value ?? it.amount ?? it.balance ?? 0);
            if (!Number.isNaN(v)) sum += Number(v);
          }
          setBalance(Number(sum));
          return;
        }

        setBalance(0);
      } catch (err) {
        console.error("BalanceProvider fetch error:", err);
        setBalance(0);
      }
    }
    fetchBalance();
  }, []);

  return (
    <BalanceContext.Provider value={{ balance, setBalance }}>
      {children}
    </BalanceContext.Provider>
  );
}
