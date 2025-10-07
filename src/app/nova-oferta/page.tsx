"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CurrencyInput from "@/components/CurrencyInput";
import RankingList from "@/components/RankingList";
import { fetchRanking, postOffer } from "@/services/api";
import { useBalance } from "../../context/BalanceContext";

const PROGRAMS = [
  { id: 1, img: "/images/tudoazul.png", label: "TudoAzul", sub: "Azul Linhas Aéreas" },
  { id: 2, img: "/images/smiles.png", label: "Smiles", sub: "Gol Linhas Aéreas" },
  { id: 3, img: "/images/latampass.png", label: "LATAM Pass", sub: "LATAM Airlines" },
  { id: 4, img: "/images/top.png", label: "Top Air", sub: "Programa parceiro" },
];

export default function NovaOfertaPage() {
  const [activeStep, setActiveStep] = useState(1);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [milheiroFormatted, setMilheiroFormatted] = useState("R$ 0,00");
  const [milhasRaw, setMilhasRaw] = useState("");
  const [ranking, setRanking] = useState<any[]>([]);
  const [receiveValue, setReceiveValue] = useState(0);
  const router = useRouter();
  const { setBalance } = useBalance();

  const goTo = (step: number) => setActiveStep(step);
  const handleBack = () => setActiveStep((s) => Math.max(1, s - 1));
  const handleNext = async () => {
    if (activeStep === 2) {
      const val = parseFloat(milheiroFormatted.replace(/[^\d,]/g, "").replace(",", "."));
      const rank = await fetchRanking(val);
      setRanking(rank);
      setReceiveValue(val * (Number(milhasRaw || 0) / 1000));
    }
    if (activeStep < 4) setActiveStep((s) => s + 1);
  };

  const handleFinish = async () => {
    const milheiro = milheiroFormatted;
    const milhas = milhasRaw;
    const ts = Date.now();
    const dateStr = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const offer = {
      id: `OF-${ts}`,
      program: selectedProgram || "Smiles",
      subProgram: "Comum",
      status: "Ativa",
      login: "user@example.com",
      amount: milhas,
      date: dateStr,
      ts,
      meta: { milheiro },
    };

    try {
      const prev = JSON.parse(localStorage.getItem("minhas_ofertas") || "[]");
      const next = [offer, ...prev];
      localStorage.setItem("minhas_ofertas", JSON.stringify(next));
    } catch (e) {
      console.warn("Erro salvando oferta localmente:", e);
    }

    try {
      await postOffer(offer).catch(() => {});
    } catch {}

    setBalance((prev) => prev + receiveValue);
    router.push("/minhas-ofertas");
  };

  return (
    <main className="nova-page">
      <div className="nova-grid">
        {/* --- STEPPER --- */}
        <aside className="stepper" role="tablist" aria-orientation="vertical" aria-label="Passos do formulário">
          {[1, 2, 3, 4].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => goTo(num)}
              aria-current={activeStep === num ? "step" : undefined}
              className={`step ${activeStep === num ? "active" : ""}`}
            >
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div className={`dot ${activeStep === num ? "dot--active" : ""}`} aria-hidden>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{num}</span>
                  {activeStep === num ? <span className="dot-inner" aria-hidden /> : null}
                </div>
                <div>
                  <div className="step-title">Passo {num}</div>
                  <div className="step-sub">
                    {num === 1
                      ? "Escolha a companhia aérea"
                      : num === 2
                      ? "Oferte suas milhas"
                      : num === 3
                      ? "Insira os dados"
                      : "Finalizado"}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </aside>

        {/* --- MAIN --- */}
        <section className="main-card">
          {activeStep === 1 && (
            <>
              <h2 className="section-title">01. Escolha o programa de fidelidade</h2>
              <div className="programs-grid" role="list" aria-label="Programas de fidelidade">
                {PROGRAMS.map((p) => {
                  const selected = selectedProgram === p.label;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedProgram(p.label)}
                      className={`program-select ${selected ? "selected" : ""}`}
                      role="listitem"
                      aria-pressed={selected}
                    >
                      <Image src={p.img} alt={p.label} width={48} height={48} style={{ objectFit: "contain" }} />
                      <div className="prog-name">{p.label}</div>
                      <div className="prog-sub">{p.sub}</div>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between mt-6 mobile-controls">
                <button className="btn-pill" onClick={handleBack}>← Voltar</button>
                <div className="page-indicator">{activeStep} de 4</div>
                <button className="cta" onClick={handleNext}>Prosseguir →</button>
              </div>
            </>
          )}

          {activeStep === 2 && (
            <>
              <h2 className="section-title">02. Oferte suas milhas</h2>
              <div className="form-row">
                <div className="field">
                  <label className="label">Valor por 1.000 milhas</label>
                  <CurrencyInput value={milheiroFormatted} onChange={setMilheiroFormatted} />
                </div>
                <div className="field">
                  <label className="label">Quantidade de milhas</label>
                  <input
                    className="input"
                    type="text"
                    inputMode="numeric"
                    value={milhasRaw}
                    onChange={(e) => setMilhasRaw(e.target.value.replace(/\D/g, ""))}
                    placeholder="Ex: 10000"
                  />
                </div>
              </div>

              <div className="flex justify-between mt-6 mobile-controls">
                <button className="btn-pill" onClick={handleBack}>← Voltar</button>
                <div className="page-indicator">{activeStep} de 4</div>
                <button className="cta" onClick={handleNext}>Prosseguir →</button>
              </div>
            </>
          )}

          {activeStep === 3 && (
            <>
              <h2 className="section-title">03. Revise suas informações</h2>
              <div className="ranking-card">
                <RankingList list={ranking} />
              </div>

              <div className="receive-box">
                <div className="text-sm text-muted">Receba até:</div>
                <div className="receive-value">
                  {receiveValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </div>
              </div>

              <div className="flex justify-between mt-6 mobile-controls">
                <button className="btn-pill" onClick={handleBack}>← Voltar</button>
                <div className="page-indicator">{activeStep} de 4</div>
                <button className="cta" onClick={handleNext}>Concluir →</button>
              </div>
            </>
          )}

          {activeStep === 4 && (
            <div className="success-card">
              <div className="success-emoji">🎉</div>
              <h3 className="success-title">Ordem criada com sucesso!</h3>
              <p className="lead max-w-sm mx-auto mb-6">
                Suas milhas foram ofertadas com sucesso. O valor será transferido via Pix assim que a venda for confirmada.
              </p>

              <div className="flex justify-center gap-4">
                <button className="btn-pill" onClick={() => goTo(1)}>Cadastrar nova oferta</button>
                <button className="cta" onClick={handleFinish}>Ver minhas ofertas →</button>
              </div>
            </div>
          )}
        </section>

        {/* --- RIGHT PANEL --- */}
        <aside className="right-card">
          <div className="info-block">
            <div className="info-title">Média de milhas</div>
            <div className="info-body">
              Ao vender mais de <strong>20.000 milhas</strong>, ative opções avançadas.
            </div>
          </div>

          <div style={{ marginTop: 8 }}>
            <RankingList list={ranking} />
          </div>

          <div className="receive-box" style={{ marginTop: 12 }}>
            <div className="text-sm text-muted">Receba até:</div>
            <div className="receive-value">
              {receiveValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
