// src/components/OfferTable.tsx
"use client";
import React from "react";
import Image from "next/image";

const getStatusChip = (status: string) => {
  const base = "chip";
  if (!status) return base;
  if (status.toLowerCase().includes("ativa")) return `${base} chip--green`;
  if (status.toLowerCase().includes("util") || status.toLowerCase().includes("utilizando")) return `${base} chip--blue`;
  return base;
};

const getLogoForProgram = (program?: string) => {
  if (!program) return "/images/default.png";
  const p = program.toLowerCase();
  if (p.includes("azul") || p.includes("tudo")) return "/images/tudoazul.png";
  if (p.includes("smiles")) return "/images/smiles.png";
  if (p.includes("latam")) return "/images/latampass.png";
  if (p.includes("tap")) return "/images/topair.png";
  return "/images/default.png";
};

export default function OfferTable({ offers = [] }: { offers: any[] }) {
  if (!offers || offers.length === 0) {
    return <div className="text-muted mt-4">Nenhuma oferta encontrada.</div>;
  }

  return (
    <div className="offers-panel">
      <div className="offers-header">
        <h2 className="title">Minhas ofertas</h2>
        <div className="controls">
          <input className="search-input" placeholder="Login de acesso, ID da oferta..." />
          <button className="filter-btn">Filtros ▾</button>
        </div>
      </div>

      <div className="table-wrap">
        <table className="offers-table" role="table" aria-label="Tabela de ofertas">
          <colgroup>
            <col style={{ width: "38%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "6%" }} />
            <col style={{ width: "6%" }} />
          </colgroup>
          <thead>
            <tr>
              <th>Programa</th>
              <th>Status</th>
              <th>ID da oferta</th>
              <th>Login</th>
              <th>Milhas</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer: any) => (
              <tr key={offer.id ?? `${offer.program}-${offer.login}-${Math.random()}`}>
                <td>
                  <div className="program-cell">
                    <div className="program-logo" aria-hidden>
                      <Image
                        src={getLogoForProgram(offer.program)}
                        alt={offer.program || "Programa"}
                        width={40}
                        height={40}
                        className="rounded-full"
                        priority={false}
                      />
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div className="prog-name" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{offer.program}</div>
                      <div className="prog-sub">{offer.subProgram}</div>
                    </div>
                  </div>
                </td>

                <td>
                  <span className={getStatusChip(offer.status || "")}>{offer.status || "—"}</span>
                </td>

                <td style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{offer.id}</td>
                <td style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{offer.login}</td>
                <td style={{ textAlign: "left" }}>{offer.amount ?? offer.miles ?? "—"}</td>
                <td>{offer.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-actions" style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
        <button className="cta" onClick={() => (window.location.href = "/nova-oferta")}>+ Nova oferta</button>
      </div>
    </div>
  );
}
