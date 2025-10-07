// src/app/nova-oferta/page.tsx
"use client";
import React, { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useBalance } from "../../context/BalanceContext";
import CurrencyInput from "@/components/CurrencyInput";
import RankingList from "@/components/RankingList";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { fetchRanking, postOffer } from "@/services/api";

const PROGRAMS = [
  { id: "tudoazul", label: "Tudo Azul", sub: "Liminar", img: "/images/tudoazul.png" },
  { id: "smiles", label: "Smiles", sub: "Liminar", img: "/images/smiles.png" },
  { id: "latam", label: "LATAM PASS", sub: "Comum", img: "/images/latampass.png" },
  { id: "tap", label: "TAP Air Portugal", sub: "Comum", img: "/images/topair.png" },
];

export default function NovaOfertaPage() {
  const router = useRouter();
  const { balance, setBalance } = useBalance();

  const [activeStep, setActiveStep] = useState<number>(1);
  const [selectedProgram, setSelectedProgram] = useState<string>(PROGRAMS[0].label);
  const [milheiroFormatted, setMilheiroFormatted] = useState<string>("R$ 0,00");
  const [milhasRaw, setMilhasRaw] = useState<string>("");

  const [cpf, setCpf] = useState<string>("");
  const [login, setLogin] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [telefone, setTelefone] = useState<string>("");

  const [ranking, setRanking] = useState<any[]>([]);
  const debouncedMilheiro = useDebouncedValue(milheiroFormatted, 400);

  const parseMilheiro = (formatted: string) => {
    if (!formatted) return 0;
    const digits = formatted.replace(/\D/g, "");
    const value = Number(digits || 0) / 100;
    return isNaN(value) ? 0 : value;
  };

  const milheiro = parseMilheiro(milheiroFormatted);
  const milhas = Number(milhasRaw.replace(/\D/g, "")) || 0;

  const receiveValue = useMemo(() => {
    if (!milheiro || !milhas) return 0;
    return (milhas / 1000) * milheiro;
  }, [milheiro, milhas]);

  const formattedCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  useEffect(() => {
    let mounted = true;
    const v = parseMilheiro(debouncedMilheiro);
    if (v <= 0) {
      setRanking([]);
      return;
    }
    (async () => {
      try {
        const data = await fetchRanking(v);
        if (!mounted) return;
        const list = Array.isArray(data) ? data : data.ranking ?? data;
        setRanking(Array.isArray(list) ? list : []);
      } catch {
        setRanking([]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [debouncedMilheiro]);

  const goTo = (step: number) => {
    if (step < 1) step = 1;
    if (step > 4) step = 4;
    setActiveStep(step);
    if (typeof window !== "undefined") {
      const el = document.querySelector(".main-card") as HTMLElement | null;
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleNext = () => {
    if (activeStep === 1 && !selectedProgram) return;
    if (activeStep === 2 && (!milheiro || milheiro <= 0 || !milhas || milhas <= 0)) return;
    if (activeStep === 3 && (!cpf || !login || !senha)) return;
    goTo(activeStep + 1);
  };

  const handleBack = () => {
    if (activeStep === 1) return router.back();
    goTo(activeStep - 1);
  };

  const handleFinish = async () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
    const ts = now.getTime();
    const id = `LOC-${ts.toString(36).toUpperCase()}`;

    const offer = {
      id,
      program: selectedProgram,
      subProgram: PROGRAMS.find((p) => p.label === selectedProgram)?.sub ?? "",
      status: "Ativa",
      login: login || `user${Math.floor(Math.random() * 9999)}@example.com`,
      amount: milhas,
      date: dateStr,
      ts,
      meta: { cpf, telefone, milheiro },
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
        {/* --- STEP INDICATOR (ASIDE) --- */}
        <aside className="stepper" role="tablist" aria-orientation="vertical" aria-label="Passos do formulário">
          {[1, 2, 3, 4].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => goTo(num)}
              aria-current={activeStep === num ? "step" : undefined}
              className={`step ${activeStep === num ? "active" : ""}`}
              style={{ background: "transparent", border: "none", width: "100%", textAlign: "left" }}
            >
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div className={`dot ${activeStep === num ? "dot--active" : ""}`} aria-hidden>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{num}</span>
                  {activeStep === num ? <span className="dot-inner" aria-hidden /> : null}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div className="step-title">Passo {num}</div>
                  <div className="step-sub">
                    {num === 1
                      ? "Escolha a companhia aérea"
                      : num === 2
                      ? "Oferte suas milhas"
                      : num === 3
                      ? "Insira os dados do programa"
                      : "Pedido finalizado"}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </aside>

        {/* --- MAIN CONTENT --- */}
        <section className="main-card">
          {activeStep === 1 && (
            <>
              <h2 className="section-title">01. Escolha o programa de fidelidade</h2>
              <div className="programs-grid">
                {PROGRAMS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedProgram(p.label)}
                    className={`program-select ${selectedProgram === p.label ? "selected" : ""}`}
                  >
                    <Image src={p.img} alt={p.label} width={48} height={48} style={{ objectFit: "contain" }} />
                    <div className="prog-name">{p.label}</div>
                    <div className="prog-sub">{p.sub}</div>
                  </button>
                ))}
              </div>

              <div className="flex justify-between mt-6 mobile-controls" style={{ gap: 12 }}>
                <button className="btn-pill" onClick={handleBack} aria-label="Voltar">← Voltar</button>
                <div className="page-indicator" aria-hidden>{activeStep} de 4</div>
                <button className="cta" onClick={handleNext} aria-label="Prosseguir">Prosseguir →</button>
              </div>
            </>
          )}

          {activeStep === 2 && (
            <>
              <h2 className="section-title">02. Oferte suas milhas</h2>

              <div className="form-row">
                <div className="field">
                  <label className="label">Valor por 1.000 milhas</label>
                  <CurrencyInput value={milheiroFormatted} onChange={setMilheiroFormatted} placeholder="R$ 0,00" />
                </div>

                <div className="field">
                  <label className="label">Quantidade de milhas</label>
                  <input
                    className="input"
                    type="text"
                    inputMode="numeric"
                    pattern="\d*"
                    value={milhasRaw}
                    onChange={(e) => setMilhasRaw(e.target.value.replace(/\D/g, ""))}
                    onFocus={(e) => e.currentTarget.select()}
                    placeholder="Ex: 10000"
                  />
                </div>
              </div>

              <div className="flex justify-between mt-6 mobile-controls" style={{ gap: 12 }}>
                <button className="btn-pill" onClick={handleBack}>← Voltar</button>
                <div className="page-indicator" aria-hidden>{activeStep} de 4</div>
                <button className="cta" onClick={handleNext}>Prosseguir →</button>
              </div>
            </>
          )}

          {activeStep === 3 && (
            <>
              <h2 className="section-title">03. Insira os dados do programa de fidelidade</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="label">CPF do Titular</label>
                  <input className="input" value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="000.000.000-00" />
                </div>
                <div>
                  <label className="label">Login de acesso</label>
                  <input className="input" value={login} onChange={(e) => setLogin(e.target.value)} placeholder="login@provedor.com" />
                </div>
                <div>
                  <label className="label">Senha de acesso</label>
                  <input className="input" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="*******" type="password" />
                </div>
                <div>
                  <label className="label">Telefone</label>
                  <input className="input" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="+55 (11) 9XXXX-XXXX" />
                </div>
              </div>

              <div className="flex justify-between mt-6 mobile-controls" style={{ gap: 12 }}>
                <button className="btn-pill" onClick={handleBack}>← Voltar</button>
                <div className="page-indicator" aria-hidden>{activeStep} de 4</div>
                <button className="cta" onClick={handleNext}>Concluir →</button>
              </div>
            </>
          )}

          {activeStep === 4 && (
            <div className="success-card">
              <div className="success-emoji">🎉</div>
              <h3 className="success-title">Ordem de venda criada com sucesso!</h3>
              <p className="lead max-w-sm mx-auto mb-6">
                Agora é só aguardar — assim que suas milhas forem vendidas, o valor será transferido direto para sua conta via Pix.
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
              Ao vender mais de <strong>20.000 milhas</strong>, ative as opções avançadas para definir a média de milhas por emissão.
            </div>
          </div>

          <div style={{ marginTop: 8 }}>
            <RankingList list={ranking} />
          </div>

          <div className="receive-box" style={{ marginTop: 12 }}>
            <div className="text-sm text-muted">Receba até:</div>
            <div className="receive-value">{formattedCurrency(receiveValue)}</div>
          </div>
        </aside>
      </div>
    </main>
  );
}
