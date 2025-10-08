"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "../components/Header";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-12 bg-[#c8dff1] relative overflow-hidden">
      
        <div className="flex flex-col items-center justify-start mt-8 sm:mt-1 mb-32 sm:mb-40 z-0">
          <img
            src="/images/logo.png"
            alt="MilhasPix"
            className="w-3/3 sm:w-[380px] md:w-[460px] lg:w-[620px] h-auto opacity-90 select-none"
          />
        </div>

       
        <div className="text-center max-w-2xl relative z-10">
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#2E3D50] mb-4">
            Bem-vindo ao MilhasPix
          </h1>
          <p className="text-[#475569] text-base sm:text-lg leading-relaxed mb-8">
            Cadastre suas ofertas de milhas, acompanhe seu ranking em tempo real
            e receba via Pix de forma rápida e segura.
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/nova-oferta"
              className="bg-[#1E90FF] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#1878d8] transition"
            >
              Nova Oferta
            </Link>
            <Link
              href="/minhas-ofertas"
              className="border border-[#1E90FF] text-[#1E90FF] px-6 py-2 rounded-full font-semibold hover:bg-[#E6F2FF] transition"
            >
              Minhas Ofertas
            </Link>
          </div>
        </div>

        <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 flex flex-col items-end gap-3">
     
          <div
            className={`flex flex-col items-end gap-2 transition-all duration-300 ${
              menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"
            }`}
          >
            {["Opção 1", "Opção 2", "Opção 3"].map((label, i) => (
              <button
                key={i}
                className="bg-white text-[#1E90FF] font-medium shadow-md hover:bg-[#E6F2FF] px-4 py-2 rounded-full transition text-sm w-28 text-center"
              >
                {label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className={`bg-[#1E90FF] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-transform duration-300 active:scale-95 ${
              menuOpen ? "rotate-45 bg-[#1878d8]" : ""
            }`}
            aria-label="Menu principal"
          >
            +
          </button>
        </div>
      </main>
    </div>
  );
}
