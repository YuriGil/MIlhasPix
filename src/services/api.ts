// src/services/api.ts

const LOCAL_PROXY = "/api/proxy";

async function fetchJson(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);
  return res.json();
}

// Ranking de ofertas (valor em milheiro)
export async function fetchRanking(mileValue: number | string) {
  const v = Number(mileValue || 0).toFixed(2);
  const url = `${LOCAL_PROXY}?endpoint=simulate-ranking&query=mile_value=${encodeURIComponent(v)}`;
  return fetchJson(url);
}

// Lista de ofertas simuladas
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
