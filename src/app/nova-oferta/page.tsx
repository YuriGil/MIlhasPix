"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Plane,
  DollarSign,
  User,
  Lock,
  Phone,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import Header from "@/components/Header";
import { useToast } from "@/components/ToastProvider";
import { fetchRanking, postOffer } from "@/services/api";
import { maskCPF, maskPhone } from "@/utils/masks";

function validateCPF(cpf: string) {
  const clean = cpf.replace(/\D/g, "");
  if (clean.length !== 11) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(clean[i]) * (10 - i);
  let rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(clean[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(clean[i]) * (11 - i);
  rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  return rev === parseInt(clean[10]);
}

function validatePassword(password: string) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function parseCurrencyToNumber(raw: string | number | undefined): number {
  if (raw == null) return 0;
  if (typeof raw === "number") return raw;
  let s = String(raw).trim();
  s = s.replace(/[^\d.,-]/g, "");
  if (s.includes(".") && s.includes(",")) {
    s = s.replace(/\./g, "").replace(",", ".");
  } else if (s.includes(",")) {
    s = s.replace(",", ".");
  }
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
}

function parseMilesNumber(raw: string | number | undefined): number {
  if (raw == null) return 0;
  if (typeof raw === "number") return Math.floor(raw);
  const digits = String(raw).replace(/\D/g, "");
  const n = parseInt(digits || "0", 10);
  return Number.isFinite(n) ? n : 0;
}

function formatBRL(n: number) {
  if (!Number.isFinite(n)) return "0,00";
  return n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function NovasOfertasPage() {
  const router = useRouter();
  const toast = useToast();
  const [menuOpen, setMenuOpen] = useState(false);

  const [step, setStep] = useState<number>(1);
  const [program, setProgram] = useState<string>("Tudo Azul");
  const [product, setProduct] = useState<string>("Liminar");
  const [miles, setMiles] = useState<string>("");
  const [valuePer1000, setValuePer1000] = useState<string>("R$ 0,00");
  const [selectedOption, setSelectedOption] = useState<string>("Imediato");
  const [averageMode, setAverageMode] = useState<boolean>(false);
  const [averagePerPassenger, setAveragePerPassenger] = useState<string>("");
  const [cpf, setCpf] = useState<string>("");
  const [login, setLogin] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [telefone, setTelefone] = useState<string>("");
  const [ranking, setRanking] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const BLUE = "#1E90FF";
  const MIN_RECOMMENDED = 14.0;
  const MAX_RECOMMENDED = 16.56;

  const numericValuePer1000 = useMemo(
    () => parseCurrencyToNumber(valuePer1000),
    [valuePer1000]
  );

  const numericMiles = useMemo(() => parseMilesNumber(miles), [miles]);

  const totalReceive = useMemo(() => {
    const total = (numericMiles / 1000) * numericValuePer1000;
    return isNaN(total) ? "0,00" : formatBRL(total);
  }, [numericMiles, numericValuePer1000]);

  // Helper preview: permite acessar sem login se ?preview=true
  function isPreviewMode() {
    if (typeof window === "undefined") return false;
    try {
      return new URLSearchParams(window.location.search).get("preview") === "true";
    } catch {
      return false;
    }
  }

  useEffect(() => {
    const user = localStorage.getItem("authUser");
    if (!user && !isPreviewMode()) {
      toast.push({ type: "error", title: "Faça login para continuar" });
      router.push("/login");
    }
  }, []);

  useEffect(() => {
    async function load() {
      if (!numericMiles || numericMiles <= 0) {
        setRanking([]);
        return;
      }
      try {
        const data = await fetchRanking(numericValuePer1000);
        let list: any[] = [];
        if (Array.isArray(data)) list = data;
        else if (Array.isArray(data?.ranking)) list = data.ranking;
        else if (Array.isArray(data?.data)) list = data.data;
        else list = [];
        setRanking(list.slice(0, 5));
      } catch (err) {
        console.error("Erro fetchRanking:", err);
        setRanking([]);
      }
    }
    const tid = setTimeout(load, 250);
    return () => clearTimeout(tid);
  }, [numericValuePer1000, numericMiles]);

  function handleValuePer1000Change(input: string) {
    const digits = String(input).replace(/\D/g, "");
    if (!digits) {
      setValuePer1000("R$ 0,00");
      return;
    }
    const v = Number(digits) / 100;
    setValuePer1000(
      v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    );
  }

  async function handleSubmit() {
    if (!validateCPF(cpf)) {
      toast.push({ type: "error", title: "CPF inválido" });
      return;
    }
    if (!validateEmail(login)) {
      toast.push({ type: "error", title: "E-mail inválido" });
      return;
    }
    if (!validatePassword(senha)) {
      toast.push({ type: "error", title: "Senha fraca. Use letras, números e símbolos." });
      return;
    }
    if (numericMiles <= 0) {
      toast.push({ type: "error", title: "Informe a quantidade de milhas." });
      return;
    }
    if (numericValuePer1000 <= 0) {
      toast.push({ type: "error", title: "Informe um valor válido por 1.000 milhas." });
      return;
    }

    const user = localStorage.getItem("authUser");
    if (!user && !isPreviewMode()) {
      toast.push({ type: "error", title: "Você precisa estar logado para enviar a oferta." });
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      await postOffer({
        program,
        product,
        miles: numericMiles,
        valuePer1000: numericValuePer1000,
        averagePerPassenger: averageMode ? parseMilesNumber(averagePerPassenger) : null,
        cpf,
        login,
        senha,
        telefone,
        receiveWhen: selectedOption,
      });
      toast.push({ type: "success", title: "Oferta criada com sucesso!" });
      setStep(4);
      router.refresh();
    } catch (err) {
      console.error("Erro postOffer:", err);
      toast.push({ type: "error", title: "Erro ao criar oferta." });
    } finally {
      setLoading(false);
    }
  }

  const suggestedAverage = useMemo(() => {
    if (!numericMiles || numericMiles < 20000) return "—";
    const parts = Math.ceil(numericMiles / 27800);
    const avg = Math.round(numericMiles / Math.max(1, parts));
    return avg.toLocaleString("pt-BR");
  }, [numericMiles]);

  return (
    <div className="min-h-screen bg-[#F8FBFF] text-[#1F3346]">
      <Header />

      <main className="max-w-[1216px] mx-auto px-4 sm:px-6 md:px-12 flex flex-col md:flex-row gap-10">
        <aside className="w-full md:w-[260px] relative mb-0 md:mb-0">
          <button
            onClick={() => router.push("/minhas-ofertas")}
            className="w-full mb-4 bg-[#1E90FF] text-white py-2 rounded-full text-sm font-medium hover:bg-[#1878d8] transition"
          >
            Minhas Ofertas
          </button>

          <div className="rounded-2xl md:border md:border-gray-200 md:shadow-sm p-4 md:p-6 bg-transparent">
            <StepSidebar currentStep={step} setStep={setStep} />
          </div>
        </aside>

        <section className="flex-1 w-full">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 min-h-[600px]">
            {step === 1 && (
              <Step1
                program={program}
                setProgram={setProgram}
                product={product}
                setProduct={setProduct}
                onNext={() => setStep(2)}
              />
            )}

            {step === 2 && (
              <Step2
                miles={miles}
                setMiles={setMiles}
                valuePer1000={valuePer1000}
                setValuePer1000={handleValuePer1000Change}
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
                averageMode={averageMode}
                setAverageMode={setAverageMode}
                averagePerPassenger={averagePerPassenger}
                setAveragePerPassenger={setAveragePerPassenger}
                ranking={ranking}
                calcTotal={totalReceive}
                onBack={() => setStep(1)}
                onNext={() => setStep(3)}
                suggestedAverage={suggestedAverage}
                minRecommended={MIN_RECOMMENDED}
                maxRecommended={MAX_RECOMMENDED}
                BLUE={BLUE}
              />
            )}

            {step === 3 && (
              <Step3
                cpf={cpf}
                setCpf={(v: string) => setCpf(maskCPF(v))}
                login={login}
                setLogin={setLogin}
                senha={senha}
                setSenha={setSenha}
                telefone={telefone}
                setTelefone={(v: string) => setTelefone(maskPhone(v))}
                onBack={() => setStep(2)}
                onSubmit={handleSubmit}
                loading={loading}
              />
            )}

            {step === 4 && <Step4 onBack={() => router.push("/minhas-ofertas")} />}
          </div>
        </section>
      </main>
    </div>
  );
}

function StepSidebar({ currentStep }: any) {
  const steps = [
    { id: 1, title: "Escolha a companhia aérea" },
    { id: 2, title: "Oferte suas milhas" },
    { id: 3, title: "Insira os dados do programa" },
    { id: 4, title: "Pedido finalizado" },
  ];

  return (
    <div className="w-full flex flex-col items-center md:items-start">
      {/* --- MOBILE (horizontal grid) --- */}
      <div className="grid grid-cols-4 md:hidden w-full max-w-[380px] mx-auto gap-1">
        {steps.map((s) => {
          const active = currentStep === s.id;
          const completed = currentStep > s.id;
          return (
            <div key={s.id} className="flex flex-col items-center">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all ${
                  completed
                    ? "bg-[#1E90FF] border-[#1E90FF]"
                    : active
                    ? "border-[#1E90FF] bg-white"
                    : "border-gray-300 bg-white"
                }`}
              >
                <div
                  className={`rounded-full ${
                    completed
                      ? "bg-white w-2 h-2"
                      : active
                      ? "bg-[#1E90FF] w-2 h-2"
                      : "bg-transparent w-1.5 h-1.5"
                  }`}
                />
              </div>
              <span
                className={`text-[10px] font-semibold ${
                  active ? "text-[#1E90FF]" : "text-gray-600"
                }`}
              >
                Passo {s.id}
              </span>
              <span
                className={`text-[9px] text-center ${
                  active ? "text-[#1E90FF]" : "text-gray-500"
                }`}
              >
                {s.title.length > 18 ? s.title.slice(0, 18) + "..." : s.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* --- Barra de progresso (mobile) --- */}
      <div className="w-full h-[2px] bg-gray-200 mt-2 md:hidden rounded-full overflow-hidden">
        <div
          className="h-full bg-[#1E90FF] transition-all duration-300"
          style={{ width: `${(currentStep / steps.length) * 100}%` }}
        />
      </div>

      {/* --- DESKTOP (vertical sidebar) --- */}
      <div className="hidden md:flex flex-col gap-6 rg-10 mt-2 ml-1">
        {steps.map((s, idx) => {
          const active = currentStep === s.id;
  const completed = currentStep > s.id;
  const isLast = idx === steps.length - 1;

  return (
    <div key={s.id} className="flex items-start gap-3">
      {/* Bolinha + linha */}
      <div className="flex flex-col items-center relative">
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
            completed
              ? "bg-[#1E90FF] border-[#1E90FF]"
              : active
              ? "border-[#1E90FF] bg-white"
              : "border-gray-300 bg-white"
          }`}
        >
          <div
            className={`rounded-full ${
              completed
                ? "bg-white w-2.5 h-2.5"
                : active
                ? "bg-[#1E90FF] w-2.5 h-2.5"
                : "bg-transparent w-2 h-2"
            }`}
          />
        </div>
        {!isLast && (
          <div
            className={`w-[2px] h-24 mb-[-50px]  ${
              completed ? "bg-[#1E90FF]" : "bg-gray-200"
            }`}
          />
        )}
      </div>

      {/* Texto */}
      <div className="flex flex-col">
        <span
          className={`text-sm font-semibold ${
            active ? "text-[#1E90FF]" : "text-gray-600"
          }`}
        >
          Passo {s.id}
        </span>
        <span
          className={`text-xs ${
            active ? "text-[#1E90FF]" : "text-gray-500"
          }`}
        >
          {s.title}
        </span>
      </div>
    </div>
  );
})}
      </div>
    </div>
  );
}

function Step1({ program, setProgram, product, setProduct, onNext }: any) {
  const airlineOptions = [
    { name: "Tudo Azul", logo: "/images/tudoazul.png" },
    { name: "Smiles", logo: "/images/smiles.png" },
    { name: "Latam Pass", logo: "/images/latampass.png" },
    { name: "TAP Miles&Go", logo: "/images/topair.png" },
  ];

  const productOptions = ["Liminar", "Comum", "Especial"];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-xl font-semibold mb-6">01. Escolha a companhia aérea</h2>
      <p className="text-sm text-gray-600 mb-6">Escolha de qual programa de fidelidade você deseja vender suas milhas. Use apenas contas em seu nome.</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {airlineOptions.map((opt) => (
          <button
            key={opt.name}
            onClick={() => setProgram(opt.name)}
            className={`flex flex-col items-center gap-2 py-3 px-3 rounded-xl border transition ${program === opt.name ? "border-[#1E90FF] bg-[#E6F2FF]" : "border-gray-200 hover:border-[#1E90FF]/30"
              }`}
          >
            <img src={opt.logo} alt={opt.name} className="w-10 h-10" />
            <span className="text-sm font-medium text-[#0F1724]">{opt.name}</span>
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Produto</label>
          <select value={product} onChange={(e) => setProduct(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#1E90FF]/30">
            {productOptions.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">CPF's Disponíveis</label>
          <input disabled value="ilimitado" className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2 text-sm text-gray-500" />
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={onNext} className="bg-[#1E90FF] text-white px-6 py-2 rounded-full hover:bg-[#1878d8]">
          Prosseguir <span className="ml-2">→</span>
        </button>
      </div>
    </motion.div>
  );
}

function Step2(props: any) {
  const {
    miles,
    setMiles,
    valuePer1000,
    setValuePer1000,
    selectedOption,
    setSelectedOption,
    averageMode,
    setAverageMode,
    averagePerPassenger,
    setAveragePerPassenger,
    ranking,
    calcTotal,
    onBack,
    onNext,
    suggestedAverage,
    minRecommended,
    maxRecommended,
    BLUE,
  } = props;

  const numericValue = parseCurrencyToNumber(valuePer1000);
  const outOfRange = numericValue > 0 && (numericValue < minRecommended || numericValue > maxRecommended);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col md:flex-row gap-6">
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-6">02. Oferte suas milhas</h2>

        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3">Quero receber</p>
          <div className="flex flex-wrap gap-3">
            {["Imediato", "em 2 dias", "em 7 dias", "Depois do voo"].map((opt) => (
              <button
                key={opt}
                onClick={() => setSelectedOption(opt)}
                className={`px-5 py-2 rounded-full border text-sm transition ${selectedOption === opt ? "border-[#1E90FF] bg-[#E6F2FF] text-[#00334D]" : "border-gray-300 text-gray-600 hover:border-[#1E90FF]/30"}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-6">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Milhas ofertadas</label>

            {/* ICON: aligned vertically using top-1/2 -translate-y-1/2 */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <Plane size={18} />
            </div>

            {/* INPUT: increased vertical padding and focus:border for visual harmony */}
            <input
              value={miles}
              onChange={(e) => setMiles(e.target.value)}
              placeholder="Ex: 10.000"
              className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-[#1E90FF]/30 focus:border-[#1E90FF] transition"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Valor a cada 1.000 milhas</label>

            {/* ICON: aligned vertically using top-1/2 -translate-y-1/2 */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <DollarSign size={18} />
            </div>

            <input
              value={valuePer1000}
              onChange={(e) => setValuePer1000(e.target.value)}
              placeholder="R$ 0,00"
              className={`w-full border rounded-lg pl-10 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-[#1E90FF]/30 focus:border-[#1E90FF] transition ${outOfRange ? "border-red-400" : "border-gray-300"}`}
            />
            <p className={`text-xs mt-1 ${outOfRange ? "text-red-500" : "text-gray-500"}`}>
              Escolha entre R$ {minRecommended.toFixed(2).replace(".", ",")} e R$ {maxRecommended.toFixed(2).replace(".", ",")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 text-sm text-gray-700">Definir média de milhas por passageiro</div>
          <div>
            <Switch checked={averageMode} onChange={setAverageMode} />
          </div>
        </div>

        {averageMode && (
          <div className="mb-6">
            <input
              value={averagePerPassenger}
              onChange={(e) => setAveragePerPassenger(e.target.value)}
              placeholder="Ex: 27.800"
              className="w-full md:w-40 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1E90FF]/30 focus:border-[#1E90FF] transition"
            />
          </div>
        )}

        <div className="text-right text-gray-700 mb-8">
          Receba até{" "}
          <span style={{ color: BLUE, fontWeight: 700 }}>
            R$ {calcTotal}
          </span>
        </div>

        {/* BUTTONS: added top border and padding to give visual separation from content */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6 border-t border-gray-100 pt-6">
          <button onClick={onBack} className="w-full sm:w-auto flex items-center gap-2 border border-[#1E90FF] text-[#1E90FF] px-6 py-2 rounded-full hover:bg-[#E6F2FF] transition">
            <ArrowLeft size={16} /> Voltar
          </button>

          <button onClick={onNext} className="w-full sm:w-auto bg-[#1E90FF] text-white px-6 py-2.5 rounded-full hover:bg-[#1878d8] flex items-center gap-2 justify-center transition">
            Prosseguir <ArrowRight size={16} />
          </button>
        </div>

      </div>

      {/* ASIDE: cards harmonized with consistent border/shadow/padding */}
      <aside className="w-full md:w-[320px] space-y-6 mt-6 md:mt-0">
        <div className="bg-[#F9FAFB] border border-gray-200 rounded-2xl shadow-sm p-4">
          <h4 className="text-sm font-semibold text-gray-800 mb-2">Média de milhas</h4>
          <p className="text-xs text-gray-600 mb-3">Ao vender mais de 20.000 milhas, ative as Opções Avançadas para definir a média de milhas por emissão.</p>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">Melhor média para a sua oferta:</div>
            <div className="text-sm font-semibold" style={{ color: "#0b6a8a" }}>{props.suggestedAverage}</div>
          </div>
        </div>

        <div className="bg-[#F9FAFB] border border-gray-200 rounded-2xl shadow-sm p-4">
          <h4 className="text-sm font-semibold text-gray-800 mb-4">Ranking das ofertas</h4>
          {!miles || parseMilesNumber(miles) <= 0 ? (
            <p className="text-gray-500 text-sm">Aguardando milhas...</p>
          ) : ranking.length > 0 ? (
            <ul className="space-y-2">
              {ranking.map((r: any, idx: number) => (
                <li key={idx} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">{idx + 1}º</span>
                  <span className="font-semibold text-gray-800">{formatRankingValueForRender(r)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">Nenhum dado disponível.</p>
          )}
        </div>
      </aside>
    </motion.div>
  );
}

function formatRankingValueForRender(raw: any) {
  try {
    if (raw == null) return "—";
    if (typeof raw === "number") return `R$ ${formatBRL(raw)}`;
    if (typeof raw === "string") {
      const n = parseCurrencyToNumber(raw);
      return n > 0 ? `R$ ${formatBRL(n)}` : "—";
    }
    if (typeof raw === "object") {
      const candidate = raw.value ?? raw.price ?? raw.mile_value ?? raw.offerValue ?? raw;
      const n = parseCurrencyToNumber(candidate);
      return n > 0 ? `R$ ${formatBRL(n)}` : "—";
    }
    return "—";
  } catch {
    return "—";
  }
}

function Step3({ cpf, setCpf, login, setLogin, senha, setSenha, telefone, setTelefone, onBack, onSubmit, loading }: any) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-xl font-semibold mb-6">03. Insira os dados do programa</h2>

      <div className="grid sm:grid-cols-2 gap-6 mb-6">
        <InputWithIcon icon={<User size={16} />} label="CPF do Titular" value={cpf} onChange={setCpf} placeholder="000.000.000-00" />
        <InputWithIcon icon={<Phone size={16} />} label="Telefone para autenticação" value={telefone} onChange={setTelefone} placeholder="(11) 99999-9999" />
      </div>

      <InputWithIcon icon={<User size={16} />} label="Login de acesso" value={login} onChange={setLogin} placeholder="email@exemplo.com" />
      <div className="mt-4 mb-8">
        <InputWithIcon icon={<Lock size={16} />} label="Senha de acesso" type="password" value={senha} onChange={setSenha} placeholder="••••••••" />
      </div>

      <div className="flex justify-between items-center mt-8 gap-4">
        <button
          onClick={onBack}
          className="flex items-center justify-center gap-2 border border-[#1E90FF] text-[#1E90FF] px-6 py-2 rounded-full font-medium hover:bg-[#E6F2FF] h-10"
        >
          <ArrowLeft size={16} /> Voltar
        </button>
        <button
          onClick={onSubmit} 
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-[#1E90FF] text-white px-6 py-2 rounded-full font-medium hover:bg-[#1878d8] h-10 disabled:opacity-60"
        >
          {loading ? "Enviando..." : "Prosseguir"} <ArrowRight size={16} />
        </button>
      </div>
    </motion.div>
  );
}

function Step4({ onBack }: any) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
      <CheckCircle size={64} className="text-green-500 mx-auto mb-6" />
      <h3 className="text-2xl font-semibold mb-2">Ordem de venda criada com sucesso!</h3>
      <p className="text-gray-600 mb-8">Agora é só aguardar — assim que suas milhas forem vendidas, o valor será transferido direto para sua conta via Pix.</p>
      <button onClick={onBack} className="bg-[#1E90FF] text-white px-6 py-2 rounded-full hover:bg-[#1878d8]">Ver minhas ofertas →</button>
    </motion.div>
  );
}


function InputWithIcon({ icon, label, value, onChange, placeholder, type = "text", error }: any) {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        {icon}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full border rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-[#1E90FF]/30 ${error ? "border-red-400" : "border-gray-300"}`}
      />
      {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
    </div>
  );
}

function Switch({ checked, onChange }: any) {
  return (
    <button
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      className={`relative inline-flex items-center h-6 w-12 rounded-full transition-colors ${checked ? "bg-[#1E90FF]" : "bg-gray-300"}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${checked ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );
}
