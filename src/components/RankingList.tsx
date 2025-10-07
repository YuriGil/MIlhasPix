"use client";
import React from "react";

type RankItem = { position?: number; value: number | string };

export default function RankingList({ list = [] as RankItem[] }) {
  return (
    <div className="ranking-card">
      <h4 className="ranking-title">Ranking das ofertas</h4>
      <div className="ranking-body">
        {list.length === 0 ? (
          <div className="text-muted">— sem dados —</div>
        ) : (
          list.map((r, i) => (
            <div key={i} className="ranking-row">
              <div className="rank-pos">{r.position ?? i + 1}º</div>
              <div className="rank-value">
                {typeof r.value === "number" ? `R$ ${Number(r.value).toFixed(2)}` : String(r.value)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
