"use client";

import "../styles/minhas-ofertas.css"; // ajustar caminho relativo se necessário

import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import OfferTable from "../../components/OfferTable";
import { fetchOffersList } from "../../services/api";
import { useRouter } from "next/navigation";

export default function MinhasOfertasPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    fetchOffersList()
      .then((res: any) => {
        // normalize depending on API response shape
        const list = Array.isArray(res) ? res : res.offers ?? res;
        const mapped = (list || []).map((it: any, idx: number) => ({
          id: it.id ?? `GJ${idx}`,
          program: it.program ?? it.company ?? "Smiles",
          subProgram: it.subProgram ?? it.tier ?? "Comum",
          status: it.status ?? "Ativa",
          login: it.login ?? "coculiloj@gmail.com",
          amount: it.amount ?? it.miles ?? "100.000.000",
          date: it.date ?? "21 Jun 2025",
        }));
        if (mounted) setOffers(mapped);
      })
      .catch(() => {
        if (mounted) setOffers([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

   return (
    <div className="app-container">
      <div className="header-bar">
        <div className="header-inner">
          <div style={{display:'flex', alignItems:'center', gap:12}}>
            <img src="/logo-horizontal.png" alt="MilhasPix" style={{height:32}} />
          </div>
          <div>
            <button className="btn-pill">R$ 283,12</button>
          </div>
        </div>
      </div>

      <main className="page-wrap">
        <div className="page-head">
          <div className="page-title">Minhas ofertas</div>
          <div>
            <button className="btn-primary" onClick={() => router.push('/nova-oferta')}>+ Nova oferta</button>
          </div>
        </div>

        <OfferTable offers={offers} />
        {loading && <div style={{color:'#9CA3AF', marginTop:12}}>Carregando ofertas...</div>}
      </main>
    </div>
  );

}
