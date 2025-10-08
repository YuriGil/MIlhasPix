"use client";

import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { BalanceContext } from "../context/BalanceContext";


export default function Header() {
  const { balance } = useContext(BalanceContext);
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ email?: string; nome?: string } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("authUser");
      setUser(stored ? JSON.parse(stored) : null);
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("authUser");
    setUser(null);
    router.push("/login");
  }

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/cadastro");

  return (
    <header className="bg-[#1E90FF] text-white shadow-md z-50">
      <div className="max-w-[1216px] mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="MilhasPix"
            width={140}
            height={36}
            priority
            className="object-contain"
          />
        </Link>

        {!isAuthPage && (
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="hidden sm:flex flex-col items-end text-sm">
                  <span className="font-medium">
                    {user.nome ? user.nome.split(" ")[0] : user.email}
                  </span>
                  <span className="text-xs opacity-80">Saldo disponível</span>
                </div>

                <div className="flex items-center px-4 py-2 rounded-full border border-[#CAE6FB] bg-[#1E90FF]/10">
                  <span className="text-white font-medium text-sm">
                    R${" "}
                    {balance.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="ml-2 border border-white/40 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-white hover:text-[#1E90FF] transition"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="border border-white/50 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-white hover:text-[#1E90FF] transition"
                >
                  Login
                </Link>
                <Link
                  href="/cadastro"
                  className="bg-white text-[#1E90FF] px-4 py-1.5 rounded-full text-sm font-medium hover:bg-[#E6F2FF] transition"
                >
                  Cadastrar
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
