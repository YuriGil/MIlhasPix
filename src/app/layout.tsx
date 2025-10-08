"use client";

import "./globals.css";
import { BalanceProvider } from "../context/BalanceContext";
import LayoutWrapper from "../components/LayoutWrapper";
import ToastProvider from "../components/ToastProvider"; 

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-white antialiased text-gray-900">
        <BalanceProvider>
          <ToastProvider> 
            <LayoutWrapper>{children}</LayoutWrapper>
          </ToastProvider>
        </BalanceProvider>
      </body>
    </html>
  );
}
