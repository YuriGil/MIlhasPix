import "./../styles/globals.css";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Header from "@/components/Header";
import { BalanceProvider } from "../context/BalanceContext";
import ToastProvider from "@/components/ToastProvider";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MilhasPix",
  description: "Gerencie suas ofertas de milhas e acompanhe seu saldo Pix em tempo real.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={plusJakarta.className}>
        <BalanceProvider>
          <ToastProvider>
            <Header />
            {children}
          </ToastProvider>
        </BalanceProvider>
      </body>
    </html>
  );
}
