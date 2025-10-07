// src/app/api/offers/route.ts
import { NextRequest, NextResponse } from "next/server";

type Offer = {
  id: string;
  program: string;
  subProgram?: string;
  status?: string;
  login?: string;
  amount?: string | number;
  date?: string;
  meta?: any;
};

let INTERNAL_OFFERS: Offer[] = []; // atenção: persistência em memória (ephemeral)

function nowId() {
  return `LOCAL-${Date.now()}`;
}

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json(INTERNAL_OFFERS, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const id = nowId();
    const date = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
    const offer: Offer = {
      id,
      program: body.program ?? "Smiles",
      subProgram: body.subProgram ?? "Comum",
      status: body.status ?? "Ativa",
      login: body.login ?? "user@example.com",
      amount: body.amount ?? body.miles ?? "10.000",
      date,
      meta: body.meta ?? {},
    };
    // insere no topo
    INTERNAL_OFFERS.unshift(offer);
    return NextResponse.json(offer, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
