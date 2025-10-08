import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://api.milhaspix.com";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const endpoint = searchParams.get("endpoint");
    const query = searchParams.get("query") || "";

    if (!endpoint) {
      console.warn("❌ Nenhum endpoint fornecido");
      return NextResponse.json({ error: "Missing endpoint" }, { status: 400 });
    }

    const target = `${API_BASE}/${endpoint}${query ? `?${query}` : ""}`;
    console.log("🌐 Buscando dados da API:", target);

    const res = await fetch(target, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    console.log("📡 Resposta da API:", res.status);

    if (!res.ok) {
      const text = await res.text();
      console.error("🚨 Erro da API:", text);
      return NextResponse.json(
        { error: `Erro da API MilhasPix (${res.status})`, body: text },
        { status: res.status }
      );
    }

    const data = await res.json();

    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (error: any) {
    console.error("💥 Erro interno no proxy:", error);
    return NextResponse.json({ error: String(error.message || error) }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    { ok: true },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    }
  );
}
