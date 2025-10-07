import "../styles/globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400","500","600","700"]
});

export const metadata = {
  title: "MilhasPix - Desafio",
  description: "Teste técnico - MilhasPix"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={jakarta.className}>{children}</body>
    </html>
  );
}