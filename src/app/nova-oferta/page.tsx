"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import CurrencyInput from "@/components/CurrencyInput";
import RankingList from "@/components/RankingList";
import { fetchRanking } from "@/services/api";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { useRouter } from "next/navigation";

type ProgramOption = { id: string; label: string; subtitle?: string };

const PROGRAMS: ProgramOption[] = [
  { id: "tudoazul", label: "Tudo Azul", subtitle: "Liminar" },
  { id: "smiles", label: "Smiles", subtitle: "Comum" },
  { id: "latam", label: "LATAM PASS", subtitle: "Comum" },
  { id: "tap", label: "TP AIRPORTUGAL", subtitle: "Comum" },
];

export default function NovaOfertaPage() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);

  // Step 1
  const [program, setProgram] = useState<ProgramOption>(PROGRAMS[0]);

  // Step 2
  const [milesOffered, setMilesOffered] = useState<string>("10000");
  const [milheiro, setMilheiro] = useState<string>("R$ 25,00");
  const debouncedMilheiro = useDebouncedValue(milheiro, 450);

  // Step 3 (dados do programa)
  const [cpf, setCpf] = useState<string>("");
  const [login, setLogin] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  // ranking
  const [ranking, setRanking] = useState<any[]>([]);
  const [rankingLoading, setRankingLoading] = useState(false);

  useEffect(() => {
    // fetch ranking when debounced milheiro changes
    const parseFormattedToNumber = (formatted: string) => {
      if (!formatted) return 0;
      const digits = formatted.replace(/\D/g, "");
      return Number(digits) / 100;
    };

    const val = parseFormattedToNumber(debouncedMilheiro);
    if (!val || val <= 0) {
      setRanking([]);
      return;
    }

    let canceled = false;
    setRankingLoading(true);
    fetchRanking(val)
      .then((res) => {
        if (canceled) return;
        if (Array.isArray(res)) {
          setRanking(res.map((v, i) => ({ position: i + 1, value: v })));
        } else if (res.ranking) {
          setRanking(res.ranking.map((v: any, i: number) => ({ position: i + 1, value: v })));
        } else {
          // handle fallback
          const arr = Array.isArray(res.data) ? res.data : Object.values(res).slice(0, 5);
          setRanking(arr.map((v: any, i: number) => ({ position: i + 1, value: v })));
        }
      })
      .catch(() => setRanking([]))
      .finally(() => !canceled && setRankingLoading(false));

    return () => { canceled = true; };
  }, [debouncedMilheiro]);

  const canProceedStep1 = !!program;
  const canProceedStep2 = !!milesOffered && !!milheiro;
  const canProceedStep3 = !!cpf && !!login && !!password;

  const onNext = () => {
    if (step === 1 && !canProceedStep1) return;
    if (step === 2 && !canProceedStep2) return;
    if (step === 3 && !canProceedStep3) return;

    if (step < 4) setStep((s) => s + 1);
    // Step 4 is final success once reached
  };

  const onBack = () => {
    if (step > 1) setStep((s) => s - 1);
    else router.back();
  };

  const onFinish = () => {
    // In real app: send payload to API. Here we just simulate and redirect to "minhas-ofertas"
    // You could call an internal API route that stores the offer.
    router.push("/minhas-ofertas");
  };

  return (
    <div>
      <Header />
      <main className="nova-page">
        <div className="nova-grid">
          <aside className="stepper">
            <div className={`step ${step >= 1 ? "active" : ""}`}>
              <div className={`dot ${step === 1 ? "dot--active" : ""}`}>1</div>
              <div className="step-text">
                <div className="step-title">Passo 1</div>
                <div className="step-sub">Escolha a companhia aérea</div>
              </div>
            </div>

            <div className={`step ${step >= 2 ? "active" : ""}`}>
              <div className={`dot ${step === 2 ? "dot--active" : ""}`}>2</div>
              <div className="step-text">
                <div className="step-title">Passo 2</div>
                <div className="step-sub">Oferte suas milhas</div>
              </div>
            </div>

            <div className={`step ${step >= 3 ? "active" : ""}`}>
              <div className={`dot ${step === 3 ? "dot--active" : ""}`}>3</div>
              <div className="step-text">
                <div className="step-title">Passo 3</div>
                <div className="step-sub">Insira os dados do programa</div>
              </div>
            </div>

            <div className={`step ${step >= 4 ? "active" : ""}`}>
              <div className={`dot ${step === 4 ? "dot--active" : ""}`}>4</div>
              <div className="step-text">
                <div className="step-title">Passo 4</div>
                <div className="step-sub">Pedido finalizado</div>
              </div>
            </div>
          </aside>

          <section className="main-card">
            {step === 1 && (
              <div>
                <h2 className="section-title">01. Escolha o programa de fidelidade</h2>
                <div className="programs-grid">
                  {PROGRAMS.map((p) => (
                    <button
                      key={p.id}
                      className={`program-select ${program?.id === p.id ? "selected" : ""}`}
                      onClick={() => setProgram(p)}
                      aria-pressed={program?.id === p.id}
                    >
                      <div className="prog-label">{p.label}</div>
                      <div className="prog-sub">{p.subtitle}</div>
                    </button>
                  ))}
                </div>

                <div className="form-actions">
                  <button className="btn-pill" onClick={onBack}>← Voltar</button>
                  <button className="cta" onClick={onNext} disabled={!canProceedStep1}>Prosseguir →</button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="section-title">02. Oferte suas milhas</h2>
                <div className="form-row">
                  <div className="field">
                    <label className="label">Milhas ofertadas</label>
                    <input className="input" value={milesOffered} onChange={(e) => setMilesOffered(e.target.value.replace(/\D/g, ""))} placeholder="10.000" />
                  </div>

                  <div className="field">
                    <label className="label">Valor a cada 1.000 milhas</label>
                    <CurrencyInput value={milheiro} onChange={setMilheiro} placeholder="R$ 25,00" />
                  </div>
                </div>

                <div className="opt-row">
                  <label className="inline-switch">
                    <input type="checkbox" />
                    <span>Definir média de milhas por passageiro</span>
                  </label>
                </div>

                <div className="form-actions">
                  <button className="btn-pill" onClick={onBack}>← Voltar</button>
                  <button className="cta" onClick={onNext} disabled={!canProceedStep2}>Prosseguir →</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="section-title">03. Insira os dados do programa de fidelidade</h2>
                <div className="credentials-grid">
                  <div className="cred-field">
                    <label>CPF do Titular</label>
                    <input className="input" value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="000.000.000-00" />
                  </div>
                  <div className="cred-field">
                    <label>Login de acesso</label>
                    <input className="input" value={login} onChange={(e) => setLogin(e.target.value)} placeholder="login@provedor.com" />
                  </div>
                  <div className="cred-field">
                    <label>Senha de acesso</label>
                    <input className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="*******" />
                  </div>
                  <div className="cred-field">
                    <label>Telefone para autenticação</label>
                    <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+55 (19) 9XXXX-XXXX" />
                  </div>
                </div>

                <div className="form-actions">
                  <button className="btn-pill" onClick={onBack}>← Voltar</button>
                  <button className="cta" onClick={() => { onNext(); }} disabled={!canProceedStep3}>Concluir →</button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="success-card">
                <div className="success-emoji">🎉</div>
                <h3 className="success-title">Ordem de venda criada com sucesso!</h3>
                <p className="success-desc">Agora é só aguardar — assim que suas milhas forem vendidas, o valor será transferido direto para sua conta via Pix.</p>

                <div className="form-actions">
                  <button className="btn-pill" onClick={onBack}>← Voltar</button>
                  <button className="cta" onClick={onFinish}>Ver minhas ofertas →</button>
                </div>
              </div>
            )}
          </section>

          <aside className="right-card">
            <div className="info-block">
              <div className="info-title">Média de milhas</div>
              <div className="info-body">Ao vender mais de 20.000 milhas, ative as Opções Avançadas para definir a média de milhas por emissão.</div>
            </div>

            <div style={{ marginTop: 16 }}>
              {rankingLoading ? (
                <div className="text-muted">Atualizando ranking...</div>
              ) : (
                <RankingList list={ranking} />
              )}
            </div>

            <div className="receive-box">
              <div className="receive-label">Receba até:</div>
              <div className="receive-value">R$ 24.325,23</div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
