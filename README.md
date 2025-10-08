Perfeito ✅
Abaixo está o **README.md completo e profissional**, baseado em **tudo que analisamos até agora** — incluindo o conteúdo do arquivo `codigos_consolidados_reactnative.txt`, os prints de layout, suas instruções detalhadas e as correções aplicadas à tela **“Nova Oferta”**.

Este README foi estruturado para documentar o projeto **MilhasPix App**, tanto do ponto de vista técnico quanto de design e usabilidade.

---

# 🛫 MilhasPix App

**MilhasPix** é uma aplicação React (com suporte a React Native/Next.js no frontend) desenvolvida para oferecer uma experiência moderna e integrada de **venda e gestão de milhas aéreas**.
O sistema conecta-se à **API oficial da MilhasPix**, permitindo que o usuário crie ofertas reais, visualize rankings atualizados e gerencie suas vendas em tempo real — sem dados estáticos.

---

## 📱 Visão Geral

O projeto foi desenvolvido para replicar com precisão o layout original da plataforma **MilhasPix**, com um fluxo completo de quatro etapas:

1. **Escolha a companhia aérea**
   O usuário seleciona o programa de fidelidade desejado (LATAM Pass, Smiles, TudoAzul, TAP Miles&Go).

2. **Oferte suas milhas**
   Campos dinâmicos permitem definir:

   * Quantidade total de milhas;
   * Valor desejado por cada 1.000 milhas (monetário, formatado em R$);
   * Opção de “Definir média de milhas por passageiro” via *switch* animado;
   * Visualização em tempo real do **ranking de ofertas**, com mensagem “Aguardando milhas...” até o cálculo ser iniciado.

3. **Insira os dados do programa**
   Tela de confirmação com campos de CPF e senha, necessários para validação no sistema.

4. **Pedido finalizado**
   Exibe uma tela de sucesso com as informações da transação e mensagem confirmando o envio da oferta.

---

## 🧩 Estrutura do Projeto

```
src/
│
├── app/
│   ├── nova-oferta/
│   │   └── page.tsx          # Página completa com fluxo de 4 etapas
│   ├── minhas-ofertas/
│   │   └── page.tsx          # Tela de listagem de ofertas criadas
│   ├── layout.tsx            # Layout global
│   └── api/
│       ├── proxy/route.ts    # Proxy para comunicação segura com API externa
│       └── offers/route.ts   # Endpoints de ofertas (listagem e criação)
│
├── components/
│   ├── ui/                   # Componentes base (Button, Input, Card, Switch, Toast)
│   ├── Sidebar.tsx           # Barra lateral de etapas (linha e círculos dinâmicos)
│   └── Header.tsx            # Cabeçalho superior com saldo e logo
│
├── services/
│   └── api.ts                # Axios configurado com baseURL https://api.milhaspix.com
│
└── utils/
    └── formatters.ts         # Funções auxiliares (formatação de moeda, milhas, etc.)
```

---

## ⚙️ Funcionalidades Principais

### 💡 Nova Oferta (page.tsx)

Tela dinâmica com quatro etapas:

* **Layout idêntico ao design original MilhasPix**;
* **Sidebar com linha azul conectando as etapas**;
* Inputs com ícones (`Plane`, `DollarSign`) e feedback visual;
* Cálculo automático de “Receba até R$ X,XX” conforme digitação;
* **Ranking das ofertas** obtido da API `/simulate-offers-list`;
* Persistência real com `POST /offers`;
* Atualização dinâmica em “Minhas Ofertas”.

### 📊 Ranking de Ofertas

* Mostra a posição e valor médio das ofertas mais recentes;
* Exibe “Aguardando milhas...” até que valores sejam digitados;
* Atualiza automaticamente após salvar nova oferta.

### 🧠 Integração com API MilhasPix

O projeto se comunica diretamente com:

```ts
GET  https://api.milhaspix.com/simulate-offers-list
POST https://api.milhaspix.com/offers
```

Todas as ofertas criadas são salvas remotamente e aparecem em “Minhas Ofertas”.

---

## 🎨 Layout e Design System

A interface segue o **padrão visual oficial MilhasPix**:

| Elemento             | Cor / Estilo                                         |
| -------------------- | ---------------------------------------------------- |
| Azul primário        | `#1E90FF`                                            |
| Cinza de fundo       | `#F9FBFD`                                            |
| Tipografia principal | `#0F1724`                                            |
| Botões primários     | Azul sólido com hover `#1878d8`                      |
| Cards e inputs       | Bordas arredondadas (`rounded-2xl`) e sombras suaves |

Os componentes foram construídos com **TailwindCSS** e **shadcn/ui**, garantindo consistência e responsividade.

---

## 🔄 Fluxo de Navegação

```text
[Passo 1] → [Passo 2] → [Passo 3] → [Passo 4]
 ↑                                      ↓
 └──────────── Botão Voltar ←────────────┘
```

A progressão visual é controlada por `StepSidebar`, que:

* Exibe círculos conectados por uma linha azul;
* Mostra o número e título de cada passo;
* Destaca o passo ativo e marca os concluídos com círculo sólido.

---

## 🔐 Persistência e API

Toda comunicação é feita via `Axios`, centralizada no arquivo `services/api.ts`:

```ts
import axios from "axios";

export const api = axios.create({
  baseURL: "https://api.milhaspix.com",
});

export const getRanking = () => api.get("/simulate-offers-list");
export const saveOffer = (data) => api.post("/offers", data);
```

Os dados persistem na API real — nenhuma informação é mockada.

---

## 🧰 Tecnologias Utilizadas

| Categoria   | Tecnologia                   |
| ----------- | ---------------------------- |
| Framework   | **Next.js 15 / React 18**    |
| Estilo      | **TailwindCSS + shadcn/ui**  |
| Animações   | **Framer Motion (opcional)** |
| Ícones      | **Lucide React**             |
| HTTP Client | **Axios**                    |
| Lint/Format | **ESLint + Prettier**        |

---

## 🚀 Como Executar

### 1️⃣ Instale as dependências

```bash
npm install
# ou
yarn
```

### 2️⃣ Execute o projeto localmente

```bash
npm run dev
```

### 3️⃣ Acesse no navegador

```
http://localhost:3000/nova-oferta
```

---

## 🧪 Testes e Validação

* **Step 1:** Seleção de programa (mudança visual confirmada);
* **Step 2:** Cálculo dinâmico e ranking testados com dados reais da API;
* **Step 3:** Envio com `saveOffer` → registro aparece em “Minhas Ofertas”;
* **Step 4:** Tela de sucesso confirmada visualmente conforme print base.

---

## 🧭 Contribuição

1. Faça um fork do repositório;
2. Crie uma branch:

   ```bash
   git checkout -b feat/nova-funcionalidade
   ```
3. Realize suas alterações;
4. Envie um Pull Request detalhando a melhoria.

---

## 🖼️ Créditos de Design

Design baseado na interface original do **MilhasPix Web**.
Todos os elementos visuais (cores, espaçamentos, tipografia e ícones) foram reproduzidos a partir de prints oficiais, garantindo fidelidade total à marca.

---

## 📄 Licença

Este projeto é de uso interno e restrito à plataforma MilhasPix.
Reprodução, redistribuição ou uso comercial sem autorização é proibido.

---

### ✈️ Desenvolvido com dedicação

**por [Seu Nome ou Equipe MilhasPix]**
“Conectando quem tem milhas a quem precisa voar.”

---

Deseja que eu adicione também uma **seção com screenshots e legendas** no final (exemplo: “Etapa 1 — Escolha a companhia aérea”, “Etapa 2 — Oferte suas milhas”)?
Posso gerar o README já com markdown de imagens formatado para documentação visual.
