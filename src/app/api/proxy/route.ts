import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://api.milhaspix.com";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const endpoint = searchParams.get("endpoint");
    const query = searchParams.get("query") || "";

    if (!endpoint) {
      return NextResponse.json({ error: "Missing endpoint" }, { status: 400 });
    }

    const target = `${API_BASE}/${endpoint}${query ? `?${query}` : ""}`;
    const res = await fetch(target, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));

    return new NextResponse(JSON.stringify(data), {
      status: res.status,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: String(error?.message || error) }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
