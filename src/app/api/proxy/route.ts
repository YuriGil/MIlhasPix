import { NextResponse } from "next/server";

const API_URL = "https://api.milhaspix.com";

export async function GET(req: Request) {
  try {
    const urlObj = new URL(req.url);
    const endpoint = urlObj.searchParams.get("endpoint");
    const query = urlObj.searchParams.get("query") || "";

    if (!endpoint) {
      return NextResponse.json({ error: "Missing endpoint" }, { status: 400 });
    }

    const target = `${API_URL}/${endpoint}${query ? `?${query}` : ""}`;
    const res = await fetch(target, { cache: "no-store" });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, {
      status: res.status,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
