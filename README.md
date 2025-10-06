# 🚀 MilhasPix - Desafio Técnico

Projeto desenvolvido como parte do desafio técnico solicitado.  
Implementação em **Next.js 14 (App Router)** + **React** + **TailwindCSS**, com consumo das APIs fornecidas.

---

## 📋 Funcionalidades

- **Tela de Nova Oferta** (`/nova-oferta`)
  - Formulário com inputs para:
    - Valor do milheiro (com máscara em R$).
    - Programa de milhas (select).
    - Quantidade de milhas.
  - Integração com API de Ranking:
    - `https://api.milhaspix.com/simulate-ranking?mile_value=VALOR`
    - Ranking atualizado em tempo real ao digitar o valor.

- **Tela de Minhas Ofertas** (`/minhas-ofertas`)
  - Consome API de ofertas fixas:
    - `https://api.milhaspix.com/simulate-offers-list`
  - Exibe tabela estilizada com ID, Programa e Valor.
  - Botão **Nova Oferta** redireciona para o cadastro.

- **UI/UX**
  - Layout baseado no Figma.
  - Tipografia `Plus Jakarta Sans`.
  - Paleta e espaçamentos conforme design.
  - Responsivo em todas as telas.
  - Botões e tabelas com hover states.

---

## 🛠️ Tecnologias

- [Next.js 14](https://nextjs.org/)  
- [React 18](https://react.dev/)  
- [Tailwind CSS](https://tailwindcss.com/)  
- [TypeScript](https://www.typescriptlang.org/)  

---

## 🚀 Rodando o Projeto Localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/milhasspix-desafio.git
   cd milhasspix-desafio
2. Instale as dependências:

         npm install
            # ou
         yarn install


3. Rode em modo desenvolvimento:

         npm run dev


4. Acesse:

http://localhost:3000/nova-oferta
http://localhost:3000/minhas-ofertas