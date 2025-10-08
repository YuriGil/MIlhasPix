"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";
import Header from "../../components/Header";
import { Filter } from "lucide-react";

type OfferItem = {
  offerId: string;
  offerStatus: string;
  loyaltyProgram: string;
  offerType?: string;
  accountLogin: string;
  mileAmount?: number | null;
  createdAt: string;
  programLogo?: string;
};

export default function MinhasOfertasPage() {
  const [raw, setRaw] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtros
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [programFilter, setProgramFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filterRef = useRef<HTMLDivElement>(null);

  // --- Fecha o dropdown ao clicar fora ---
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Busca ofertas ---
  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/offers?endpoint=simulate-offers-list", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || `Erro ${res.status}`);
        const list = Array.isArray(data.offers)
          ? data.offers
          : Array.isArray(data)
          ? data
          : [];
        setRaw(list);
      } catch (err: any) {
        console.error("Erro ao buscar ofertas:", err);
        setError(err.message || "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // --- Normaliza dados ---
  function normalize(item: any): OfferItem {
    const offerId = item.offerId ?? item.id ?? "—";
    const offerStatus = item.offerStatus ?? item.status ?? "—";
    const loyaltyProgram =
      item.loyaltyProgram ?? item.program ?? item.accountProgram ?? "Desconhecido";
    const offerType = item.offerType ?? item.subProgram ?? "";
    const accountLogin = item.accountLogin ?? item.login ?? "—";
    const mileAmount =
      item.mileAmount ??
      item.amount ??
      item.miles ??
      (typeof item.mileAmount === "string"
        ? Number(item.mileAmount.replace(/\D/g, ""))
        : null);
    const createdAt = item.createdAt ?? item.date ?? new Date().toISOString();

    let programLogo = "/images/default.png";
    const prog = String(loyaltyProgram).toLowerCase();
    if (prog.includes("smiles")) programLogo = "/images/smiles.png";
    if (prog.includes("tudo")) programLogo = "/images/tudoazul.png";
    if (prog.includes("latam")) programLogo = "/images/latampass.png";
    if (prog.includes("tap")) programLogo = "/images/topair.png";

    return {
      offerId,
      offerStatus,
      loyaltyProgram,
      offerType,
      accountLogin,
      mileAmount,
      createdAt,
      programLogo,
    };
  }

  const offers = useMemo(() => raw.map(normalize), [raw]);

  // --- Aplica filtros ---
  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return offers.filter((o) => {
      const matchesTerm =
        !term ||
        o.offerId.toLowerCase().includes(term) ||
        o.accountLogin.toLowerCase().includes(term) ||
        o.loyaltyProgram.toLowerCase().includes(term);
      const matchesStatus =
        !statusFilter || o.offerStatus.toLowerCase().includes(statusFilter.toLowerCase());
      const matchesProgram =
        !programFilter || o.loyaltyProgram.toLowerCase().includes(programFilter.toLowerCase());
      const matchesDate =
        (!dateFrom || new Date(o.createdAt) >= new Date(dateFrom)) &&
        (!dateTo || new Date(o.createdAt) <= new Date(dateTo));
      return matchesTerm && matchesStatus && matchesProgram && matchesDate;
    });
  }, [offers, searchTerm, statusFilter, programFilter, dateFrom, dateTo]);

  // --- Render ---
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="max-w-[1216px] mx-auto w-full px-4 py-20">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-[#2E3D50]">Minhas ofertas</h1>
          <Link
            href="/nova-oferta"
            className="bg-[#1E90FF] text-white px-5 py-2 rounded-full font-medium hover:bg-[#1878d8] transition"
          >
            + Nova oferta
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 relative">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
            <h2 className="text-gray-600 font-medium w-full sm:w-auto">Todas ofertas</h2>

            {/* Busca + Filtros */}
            <div className="flex gap-2 w-full sm:w-auto relative" ref={filterRef}>
              <div className="relative flex-1">
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Login de acesso, ID da oferta..."
                  className="w-full border border-gray-200 rounded-full px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#cfe8ff]"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"
                  />
                </svg>
              </div>

              <div className="relative">
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Filter className="w-4 h-4 text-[#1E90FF]" />
                  Filtros ▾
                </button>

                {filterOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-20 p-4 overflow-hidden">
                    <h3 className="text-sm font-medium text-gray-800 mb-2">Filtro por status</h3>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg text-sm px-2 py-1.5 mb-3 focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-[#1E90FF]"
                    >
                      <option value="">Todos</option>
                      <option value="Ativa">Ativa</option>
                      <option value="Utilização">Utilização</option>
                      <option value="Inativa">Inativa</option>
                    </select>

                    <h3 className="text-sm font-medium text-gray-800 mb-2">Programa de milhas</h3>
                    <select
                      value={programFilter}
                      onChange={(e) => setProgramFilter(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg text-sm px-2 py-1.5 mb-3 focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-[#1E90FF]"
                    >
                      <option value="">Todos</option>
                      <option value="Smiles">Smiles</option>
                      <option value="Tudo Azul">Tudo Azul</option>
                      <option value="Latam">Latam Pass</option>
                      <option value="TAP">TAP Miles&Go</option>
                    </select>

                    <h3 className="text-sm font-medium text-gray-800 mb-2">Período</h3>
                    <div className="flex items-center gap-2 mb-4">
                      <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="border border-gray-300 rounded-lg text-sm px-2 py-1.5 flex-1 min-w-0 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-[#1E90FF]"
                      />
                      <span className="text-gray-500 text-xs">até</span>
                      <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="border border-gray-300 rounded-lg text-sm px-2 py-1.5 flex-1 min-w-0 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-[#1E90FF]"
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => {
                          setStatusFilter("");
                          setProgramFilter("");
                          setDateFrom("");
                          setDateTo("");
                        }}
                        className="text-xs text-gray-500 hover:underline"
                      >
                        Limpar filtros
                      </button>
                      <button
                        onClick={() => setFilterOpen(false)}
                        className="bg-[#1E90FF] text-white text-xs px-4 py-1.5 rounded-lg hover:bg-[#1878d8] transition"
                      >
                        Aplicar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tabela */}
          {loading ? (
            <div className="py-8 text-center text-gray-500">Carregando...</div>
          ) : error ? (
            <div className="py-8 text-center text-red-500">Erro: {error}</div>
          ) : filtered.length === 0 ? (
            <div className="py-8 text-center text-gray-500">Nenhuma oferta encontrada.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-[#475569]">
                    <th className="py-3 px-4">Programa</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">ID da oferta</th>
                    <th className="py-3 px-4">Login</th>
                    <th className="py-3 px-4">Milhas ofertadas</th>
                    <th className="py-3 px-4">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((o, i) => (
                    <tr
                      key={o.offerId + i}
                      className="border-b border-gray-100 hover:bg-[#f9fbfd]"
                    >
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={o.programLogo}
                          alt={o.loyaltyProgram}
                          className="w-8 h-8 object-contain rounded-full bg-white border"
                        />
                        <div className="flex flex-col">
                          <span className="text-[#1E90FF] font-medium">
                            {o.loyaltyProgram}
                          </span>
                          <span className="text-xs text-gray-500">{o.offerType}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            String(o.offerStatus)
                              .toLowerCase()
                              .includes("ativa")
                              ? "bg-green-100 text-green-700"
                              : String(o.offerStatus)
                                  .toLowerCase()
                                  .includes("util")
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {o.offerStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{o.offerId}</td>
                      <td className="py-3 px-4 text-gray-700">{o.accountLogin}</td>
                      <td className="py-3 px-4 text-gray-700">
                        {o.mileAmount
                          ? Number(o.mileAmount).toLocaleString("pt-BR")
                          : "—"}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {o.createdAt
                          ? new Date(o.createdAt).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
