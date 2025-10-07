"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import OfferTable from "@/components/OfferTable";
import { fetchOffersList } from "@/services/api";

export default function MinhasOfertasPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchOffersList()
      .then((res) => {
        // normalizar resposta
        const raw = Array.isArray(res) ? res : res.offers ?? res.data ?? res;
        const arr = Array.isArray(raw) ? raw : [];
        const normalized = arr.map((it: any, idx: number) => ({
          id: it.offerId ?? it.id ?? `GJ${idx + 1}`,
          program: it.program ?? it.loyaltyProgram ?? "Smiles",
          subProgram: it.offerType ?? it.subProgram ?? "Comum",
          status: it.status ?? it.offerStatus ?? "Ativa",
          login: it.login ?? it.accountLogin ?? "user@example.com",
          amount: it.amount ?? it.miles ?? it.availableQuantity ?? "100.000",
          date: it.date ?? it.createdAt ?? "21 Jun 2025",
        }));
        if (mounted) setOffers(normalized);
      })
      .catch(() => { if (mounted) setOffers([]); })
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, []);

  return (
    <div>
      <Header />
      <main className="app-container">
        <div className="page-wrap">
          <h1 className="page-title">Minhas ofertas</h1>
          {loading ? <div className="text-muted">Carregando ofertas...</div> : <OfferTable offers={offers} />}
        </div>
      </main>
    </div>
  );
}
