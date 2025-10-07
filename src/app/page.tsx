"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center min-h-[80vh] bg-[var(--bg)] px-4 text-center">
      {/* Logo central */}
      <div className="mb-6">
        <Image
          src="/images/logo.png"
          alt="MilhasPix"
          width={160}
          height={48}
          priority
          className="mx-auto"
        />
      </div>

      <h1 className="text-3xl font-bold text-[var(--primary)] mb-4">
        Bem-vindo ao MilhasPix
      </h1>
      <p className="max-w-xl text-[var(--muted)] mb-6 leading-relaxed">
        Cadastre suas ofertas de milhas, acompanhe seu ranking em tempo real e
        receba via Pix de forma rápida e segura.
      </p>

      <div className="flex gap-3">
        <button
          onClick={() => router.push("/nova-oferta")}
          className="cta bg-[var(--primary)] text-white hover:brightness-105 transition"
        >
          Nova Oferta
        </button>
        <button
          onClick={() => router.push("/minhas-ofertas")}
          className="btn-pill hover:bg-gray-100 transition"
        >
          Minhas Ofertas
        </button>
      </div>
    </main>
  );
}
