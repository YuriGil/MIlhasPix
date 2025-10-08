"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import HomeButton from "./HomeButton"; 

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const noHeaderRoutes = ["/nova-oferta", "/cadastro", "/login", "/minhas-ofertas"];
  const shouldShowHeader = !noHeaderRoutes.some((path) => pathname.startsWith(path));

  return (
    <>
      {shouldShowHeader && <Header />}
      <HomeButton position="right" /> 
      {children}
    </>
  );
}
