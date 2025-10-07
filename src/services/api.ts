// src/services/api.ts
const LOCAL_PROXY = "/api/proxy";
const INTERNAL_OFFERS_ROUTE = "/api/offers";

async function fetchJson(url: string, opts: RequestInit = {}) {
  const res = await fetch(url, opts);
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Erro HTTP ${res.status} - ${txt}`);
  }
  return res.json();
}

// Ranking de ofertas (valor em milheiro)
export async function fetchRanking(mileValue: number | string) {
  const v = Number(mileValue || 0).toFixed(2);
  const url = `${LOCAL_PROXY}?endpoint=simulate-ranking&query=mile_value=${encodeURIComponent(v)}`;
  return fetchJson(url);
}

// Lista de ofertas simuladas (API externa via proxy)
export async function fetchOffersList() {
  const url = `${LOCAL_PROXY}?endpoint=simulate-offers-list`;
  const data = await fetchJson(url);
  const list = Array.isArray(data) ? data : data.offers ?? data.data ?? [];
  return list.map((o: any, i: number) => ({
    id: o.offerId ?? o.id ?? `OF-${i + 1}`,
    program: o.loyaltyProgram ?? o.program ?? "Smiles",
    subProgram: o.offerType ?? o.subProgram ?? "Comum",
    status: o.status ?? o.offerStatus ?? "Ativa",
    login: o.accountLogin ?? o.login ?? "user@example.com",
    amount: o.availableQuantity ?? o.amount ?? o.miles ?? "100.000",
    date: o.createdAt
      ? new Date(o.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })
      : "21 Jun 2025",
  }));
}

// POST para nossa API interna (persistência simulada)
export async function postOffer(payload: any) {
  const url = INTERNAL_OFFERS_ROUTE;
  return fetchJson(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
}

// GET ofertas internas
export async function fetchInternalOffers() {
  const url = INTERNAL_OFFERS_ROUTE;
  try {
    const res = await fetchJson(url);
    return Array.isArray(res) ? res : [];
  } catch {
    return [];
  }
}

// Retorna listagem combinada: internas (criadas) + remotas (API simulate-offers-list)
export async function fetchMergedOffers() {
  const [internal, remote] = await Promise.allSettled([fetchInternalOffers(), fetchOffersList()]);
  const internalList = internal.status === "fulfilled" ? internal.value : [];
  const remoteList = remote.status === "fulfilled" ? remote.value : [];
  // garantir que IDs internos fiquem no topo e evitamos duplicatas por id
  const merged = [...internalList, ...remoteList.filter((r: any) => !internalList.some((l: any) => l.id === r.id))];
  return merged;
}
