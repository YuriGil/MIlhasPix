// src/app/minhas-ofertas/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OfferTable from "@/components/OfferTable";
import { useBalance } from "../../context/BalanceContext";
import { fetchMergedOffers } from "@/services/api";

export default function MinhasOfertasPage() {
  const router = useRouter();
  const { formattedBalance } = useBalance();

  const [offers, setOffers] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("minhas_ofertas");
    let localOffers: any[] = [];
    if (stored) {
      try {
        localOffers = JSON.parse(stored);
      } catch {
        localOffers = [];
      }
    }

    (async () => {
      try {
        const remote = await fetchMergedOffers();
        const merged = [
          ...localOffers,
          ...remote.filter((r: any) => !localOffers.some((l: any) => l.id === r.id)),
        ];
        merged.sort((a: any, b: any) => (b.ts || 0) - (a.ts || 0));
        setOffers(merged);
      } catch (e) {
        localOffers.sort((a: any, b: any) => (b.ts || 0) - (a.ts || 0));
        setOffers(localOffers);
      }
    })();
  }, []);

  return (
    <div className="app-container" style={{ paddingTop: 22 }}>
      <h1 className="page-title">Minhas ofertas</h1>

      <div className="minhas-layout">
        <div className="minhas-left">
          <OfferTable offers={offers} />

          <div className="flex justify-end mt-4">
            <button onClick={() => router.push("/nova-oferta")} className="cta">
              + Nova oferta
            </button>
          </div>
        </div>

        <div className="minhas-empty" aria-hidden />
      </div>

      <div className="mt-6 text-right text-sm text-muted">
        Saldo atual:{" "}
        <span className="font-semibold text-[var(--primary)]">{formattedBalance}</span>
      </div>
    </div>
  );
}
