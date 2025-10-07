"use client";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <header className="absolute top-0 left-0 w-full h-14 bg-[#007AFF] flex items-center px-8">
        <img src="/logo-horizontal.png" alt="MilhasPix" className="h-6" />
        <div className="ml-auto text-white font-semibold text-sm">R$ 283,12</div>
      </header>

      <main className="flex flex-col items-center justify-center text-center mt-8">
        <h1 className="text-3xl font-bold text-[#007AFF] mb-2">Bem-vindo ao MilhasPix</h1>
        <p className="text-gray-500 max-w-md mb-8">
          Cadastre suas ofertas de milhas, acompanhe seu ranking em tempo real e receba via Pix de forma rápida e segura.
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => router.push("/nova-oferta")}
            className="bg-[#007AFF] text-white font-medium px-6 py-3 rounded-lg hover:bg-[#0066d6] transition"
          >
            Nova Oferta
          </button>
          <button
            onClick={() => router.push("/minhas-ofertas")}
            className="border border-[#007AFF] text-[#007AFF] font-medium px-6 py-3 rounded-lg hover:bg-blue-50 transition"
          >
            Minhas Ofertas
          </button>
        </div>
      </main>
    </div>
  );
}
