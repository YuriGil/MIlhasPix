"use client";
import React from "react";
import { useRouter } from "next/navigation";

type Offer = {
  id: string;
  program: string;
  subProgram?: string;
  status?: string;
  login?: string;
  amount?: string | number;
  date?: string;
};

export default function OfferTable({ offers = [] as Offer[] }) {
  const router = useRouter();
  return (
    <div className="offers-panel">
      <div className="offers-header">
        <div className="title">Todas ofertas</div>
        <div className="controls">
          <input className="search-input" placeholder="Login de acesso, ID da oferta..." />
          <button className="filter-btn">Filtros ▾</button>
        </div>
      </div>

      <div className="table-wrap">
        <table className="offers-table">
          <thead>
            <tr>
              <th>Programa</th>
              <th>Status</th>
              <th>ID da oferta</th>
              <th>Login</th>
              <th>Milhas ofertadas</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((o) => (
              <tr key={o.id}>
                <td>
                  <div className="program-cell">
                    <div className="program-logo" />
                    <div className="program-info">
                      <div className="prog-name">{o.program}</div>
                      <div className="prog-sub">{o.subProgram}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`chip ${o.status?.toLowerCase().includes("ativa") ? "chip--green" : "chip--blue"}`}>
                    {o.status}
                  </span>
                </td>
                <td>{o.id}</td>
                <td>{o.login}</td>
                <td>{o.amount}</td>
                <td>{o.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-actions">
        <button className="btn-primary" onClick={() => router.push("/nova-oferta")}>+ Nova oferta</button>
      </div>
    </div>
  );
}
