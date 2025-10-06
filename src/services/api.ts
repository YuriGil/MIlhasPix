// src/services/api.ts
const API_URL = "https://api.milhaspix.com";

async function fetchJson(url: string) {
  const res = await fetch(url);
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`${res.status} ${txt}`);
  }
  return res.json();
}

/**
 * Chama simulate-ranking com mile_value formatado com ponto decimal (ex: 16.50)
 */
export async function getRanking(mileValue: number) {
  const v = Number(mileValue).toFixed(2); // garante "16.50"
  const url = `${API_URL}/simulate-ranking?mile_value=${encodeURIComponent(v)}`;
  return fetchJson(url);
}

/**
 * Busca a lista de ofertas
 */
export async function getOffers() {
  const url = `${API_URL}/simulate-offers-list`;
  return fetchJson(url);
}
// use client-side fetching in pages, but service can be used server/client
export async function fetchRanking(mile_value: number) {
  const q = String(mile_value ?? 0);
  const url = `https://api.milhaspix.com/simulate-ranking?mile_value=${encodeURIComponent(q)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Erro ao buscar ranking");
  return res.json();
}

export async function fetchOffersList() {
  const url = `https://api.milhaspix.com/simulate-offers-list`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Erro ao buscar ofertas");
  return res.json();
}
