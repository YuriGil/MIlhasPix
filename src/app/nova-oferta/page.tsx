"use client";

import "../styles/nova-oferta.css";

import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Stepper from "../../components/Stepper";
import RankingList from "../../components/RankingList";
import CurrencyInput from "../../components/CurrencyInput";
import { fetchRanking } from "../../services/api";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { useRouter } from "next/navigation";

export default function NovaOfertaPage() {
  const router = useRouter();
  const [milheiro, setMilheiro] = useState<string>("R$ 25,00"); // formatted
  // parse numeric value (float) for API: convert R$ 25,00 -> 25.00
  const parseFormattedToNumber = (formatted: string) => {
    if (!formatted) return 0;
    const digits = formatted.replace(/[^\d,]/g, "").replace(".", "");
    // keep last two digits as cents
    const only = digits.replace(/\./g, "");
    const withComma = only;
    if (!withComma) return 0;
    // replace last comma position: but easier approach: transform '2500' to 25.00
    // We assume format like '2500' where last two are cents
    const pure = withComma.replace(/^0+/, "") || "0";
    const n = Number(pure) / 100;
    return n;
  };

  const debouncedFormatted = useDebouncedValue(milheiro, 350);
  const [ranking, setRanking] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const val = parseFormattedToNumber(debouncedFormatted);
    // call API if value > 0
    let cancelled = false;
    if (val >= 0) {
      setLoading(true);
      fetchRanking(val)
        .then((res: any) => {
          if (cancelled) return;
          // API might return array or object; normalize to list
          const list = Array.isArray(res) ? res : res.ranking ?? res;
          // map to expected shape: { position, value }
          const mapped = (list || []).map((item: any, idx: number) => {
            if (typeof item === "number" || typeof item === "string") {
              return { position: idx + 1, value: item };
            }
            if (item.value !== undefined) return { position: item.position ?? idx + 1, value: item.value };
            return { position: idx + 1, value: item };
          });
          setRanking(mapped);
        })
        .catch(() => {
          setRanking([]);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }
    return () => {
      cancelled = true;
    };
  }, [debouncedFormatted]);

    return (
    <div>
      <div className="header-bar">
        <div className="header-inner"><img src="/logo-horizontal.png" alt="logo" style={{height:32}}/></div>
      </div>

      <div className="nova-page">
        <div className="nova-grid">
          <aside className="stepper">
            <Stepper step={2} />
          </aside>

          <section className="main-card">
            <h2 style={{fontWeight:600, marginBottom:12}}>02. Oferte suas milhas</h2>
            {/* conteúdo do formulário: use as classes .form-row .input .select .cta conforme CSS acima */}
            <div className="form-row">
              <div className="field">
                <label>Milhas ofertadas</label>
                <input className="input" placeholder="10.000" />
              </div>
              <div className="field">
                <label>Valor a cada 1.000 milhas</label>
                <CurrencyInput value={milheiro} onChange={setMilheiro} placeholder="R$ 25,00" />
              </div>
            </div>

            <div style={{display:'flex', gap:12, marginTop:18}}>
              <button className="round-btn" onClick={()=>router.back()}>← Voltar</button>
              <button className="cta" style={{marginLeft:'auto'}} onClick={()=>router.push('/minhas-ofertas')}>Prosseguir →</button>
            </div>
          </section>

          <aside className="right-card">
            <div style={{fontWeight:600, marginBottom:12}}>Média de milhas</div>
            <div style={{padding:12, border:'1px solid #E6F7F5', borderRadius:8, background:'#F0FEFA'}}>R$ 24.325,23</div>
            <div style={{marginTop:18}}>
              <RankingList list={ranking} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
};