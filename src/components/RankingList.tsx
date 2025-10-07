"use client";
import React from "react";
import { motion } from "framer-motion";

type RankItem = { position?: number; value: number | string };

export default function RankingList({ list = [] }: { list: RankItem[] }) {
  return (
    <div className="ranking-card">
      <h4 className="ranking-title">Ranking das ofertas</h4>
      <div className="ranking-body">
        {list.length === 0 ? (
          <div className="text-muted">— sem dados —</div>
        ) : (
          <div className="flex flex-col gap-2">
            {list.map((r: RankItem, i: number) => {
              const raw = r.value ?? r;
              const value =
                typeof raw === "object" ? (raw as any).value ?? (raw as any).price ?? (raw as any).mile_value ?? JSON.stringify(raw) : raw;
              const valueStr =
                typeof value === "number"
                  ? `R$ ${value.toFixed(2).replace(".", ",")}`
                  : String(value).replace(".", ",");
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}>
                  <div className={`ranking-row ${r.position === 99 ? "me" : ""}`}>
                    <div className="rank-pos">{r.position ?? i + 1}º</div>
                    <div className="rank-value">{valueStr}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
