"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail } from "lucide-react";
import { useToast } from "@/components/ToastProvider";

export default function LoginPage() {
  const router = useRouter();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  function validateEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!validateEmail(email)) {
      toast.push({ type: "error", title: "E-mail inválido" });
      return;
    }
    if (senha.length < 6) {
      toast.push({ type: "error", title: "A senha deve ter ao menos 6 caracteres" });
      return;
    }

    setLoading(true);
    try {
      // simula autenticação
      await new Promise((r) => setTimeout(r, 800));
      localStorage.setItem("authUser", JSON.stringify({ email }));
      toast.push({ type: "success", title: "Login realizado com sucesso!" });
      router.push("/nova-oferta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-[#F8FBFF]">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center text-[#1E90FF] mb-6">Entrar</h1>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
<Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-[#1E90FF]/30 text-sm"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-[#1E90FF]/30 text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1E90FF] text-white rounded-full py-2 font-medium hover:bg-[#1878d8] transition disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Não tem uma conta?{" "}
          <Link href="/cadastro" className="text-[#1E90FF] hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </main>
  );
}
