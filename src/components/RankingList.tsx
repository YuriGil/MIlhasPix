"use client";
import React from "react";

type RankItem = {
  position: number;
  value: number | string;
};

export default function RankingList({ title = "Ranking das ofertas", list = [] as RankItem[] }) {
  return (
    <div className="w-64 border border-gray-200 rounded-lg p-4">
      <h3 className="text-sm font-semibold mb-3">{title}</h3>
      <ol className="space-y-2">
        {list.map((r: any, idx: number) => (
          <li key={idx} className="flex justify-between items-center bg-white px-3 py-2 rounded-md">
            <span className="text-sm text-gray-600">{r.position ?? idx + 1}º</span>
            <span className="text-sm font-medium text-gray-800">{typeof r.value === "number" ? `R$ ${Number(r.value).toFixed(2)}` : r.value}</span>
          </li>
        ))}
      </ol>
      {list.length === 0 && <div className="text-xs text-gray-400 mt-3">Nenhum ranking disponível</div>}
    </div>
  );
}
