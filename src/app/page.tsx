"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NovaOferta() {
  const [milheiro, setMilheiro] = useState<string>("");
  const [ranking, setRanking] = useState<any[]>([]);
  const router = useRouter();

  function formatCurrency(value: string) {
    const num = value.replace(/\D/g, "");
    if (!num) return "";
    const val = (Number(num) / 100).toFixed(2);
    return val.replace(".", ",");
  }

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatCurrency(e.target.value);
    setMilheiro(formatted);

    const apiValue = formatted.replace(",", ".");
    if (!apiValue) return;

    try {
      const res = await fetch(
        `https://api.milhaspix.com/simulate-ranking?mile_value=${apiValue}`
      );
      const data = await res.json();
      setRanking(data);
    } catch {
      setRanking([]);
    }
  }

  return (
    <main className="app-container py-10">
      <h1 className="h1-figma mb-6">Cadastrar Nova Oferta</h1>

      <div className="row items-start">
        {/* Form */}
        <div className="col flex-1">
          <div className="form-group">
            <label htmlFor="milheiro" className="lead">
              Valor do milheiro (R$)
            </label>
            <input
              id="milheiro"
              type="text"
              value={milheiro}
              onChange={handleChange}
              placeholder="Digite o valor"
              className="input input-mile"
            />
          </div>

          <div className="form-group">
            <label className="lead">Banco</label>
            <select className="input">
              <option>Selecione...</option>
              <option>Itaú</option>
              <option>Bradesco</option>
              <option>Santander</option>
            </select>
          </div>

          <div className="form-group">
            <label className="lead">Programa de Pontos</label>
            <select className="input">
              <option>Selecione...</option>
              <option>Livelo</option>
              <option>Esfera</option>
              <option>LATAM Pass</option>
            </select>
          </div>

          <div className="form-group">
            <label className="lead">Quantidade de milhas</label>
            <input
              type="number"
              placeholder="Ex: 10.000"
              className="input"
            />
          </div>

          <div className="row mt-4 gap-4">
            <button
              className="btn-primary"
              onClick={() => alert("Oferta cadastrada!")}
            >
              Cadastrar
            </button>
            <button
              className="btn-pill"
              onClick={() => router.push("/minhas-ofertas")}
            >
              Ver minhas ofertas
            </button>
          </div>
        </div>

        {/* Ranking */}
        <div className="ranking card-sm">
          <h3 className="lead mb-2">Ranking</h3>
          {ranking.length === 0 && (
            <p className="text-gray-500 text-sm">
              Digite o valor do milheiro para ver o ranking.
            </p>
          )}
          {ranking.map((item, idx) => (
            <div key={idx} className="item">
              <span>{item.name}</span>
              <span className="font-bold">{item.score}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
