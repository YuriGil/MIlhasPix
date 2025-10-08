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

  // Simula busca de saldo (pode substituir por fetch real)
  useEffect(() => {
    const fetchBalance = async () => {
      // exemplo: const res = await fetch("/api/balance");
      // const data = await res.json();
      // setBalance(data.balance);
      setBalance(283.12); // valor inicial
    };
    fetchBalance();
  }, []);

  return (
    <BalanceContext.Provider value={{ balance, setBalance }}>
      {children}
    </BalanceContext.Provider>
  );
}
