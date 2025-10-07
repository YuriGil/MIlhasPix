// services/api.ts
const LOCAL_PROXY = "/api/proxy";

async function fetchJson(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);
  return res.json();
}

export async function fetchRanking(mileValue: number | string) {
  const v = Number(mileValue || 0).toFixed(2);
  const url = `${LOCAL_PROXY}?endpoint=simulate-ranking&query=mile_value=${encodeURIComponent(v)}`;
  return fetchJson(url);
}

export async function fetchOffersList() {
  const url = `${LOCAL_PROXY}?endpoint=simulate-offers-list`;
  return fetchJson(url);
}
