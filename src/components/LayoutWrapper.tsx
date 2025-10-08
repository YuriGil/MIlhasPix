"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Rotas onde o Header NÃO deve aparecer
  const noHeaderRoutes = ["/nova-oferta", "/cadastro", "/login", "/minhas-ofertas"];

  const shouldShowHeader = !noHeaderRoutes.some((path) => pathname.startsWith(path));

  return (
    <>
      {shouldShowHeader && <Header />}
      {children}
    </>
  );
}
