"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
      <Link href="/nova-oferta">Nova Oferta</Link>
      <Link href="/minhas-ofertas">Minhas Ofertas</Link>
    </nav>
  );
}
