
# 🛫 MilhasPix — Web (Next.js) / React App

**Resumo:**  
MilhasPix é uma implementação front-end em Next.js (app directory) + React 18 que oferece um fluxo completo para criação e gerenciamento de ofertas de venda de milhas. Este README foi gerado automaticamente a partir da análise do código consolidado do projeto. fileciteturn1file0

---

## 🎯 Objetivo do repositório
Fornecer uma interface web que permita:
- Criar **novas ofertas** de milhas em 4 passos (escolha do programa → valor → dados de conta → confirmação);
- Visualizar **Minhas Ofertas** com filtros, pesquisa e ranking;
- Consultar ranking de mercado e simular valores (com endpoint externo);
- Ser usado como base para integrar com APIs reais (MilhasPix).

---

## ✅ Principais funcionalidades
- Fluxo de criação de oferta em 4 passos (componentes `Step1`..`Step4`);
- Cálculo dinâmico de "Receba até R$ X,XX" com formatação BRL;
- Ranking (fetch para `/simulate-offers-list`);
- Persistência de ofertas via `POST /offers` (serviço remoto `https://api.milhaspix.com`);
- Proteção de rotas baseada em `localStorage.authUser` — **mas** com modo de visualização com `?preview=true` (importante, veja seção abaixo);
- Componentes de UI com Tailwind / Framer Motion / Lucide.

---

## 🔎 Modo PREVIEW (`?preview=true`) — **Muito importante**
As páginas **/nova-oferta** e **/minhas-ofertas** possuem uma checagem para impedir acesso quando o usuário não está logado (ver `localStorage.getItem('authUser')`). Para facilitar demonstrações, existe um *helper* `isPreviewMode()` que **permite burlar o requisito de login** quando a query string `preview=true` está presente.

Exemplo:
- `http://localhost:3000/nova-oferta?preview=true`
- `http://localhost:3000/minhas-ofertas?preview=true`

Isso corresponde à lógica encontrada no código das páginas (helper `isPreviewMode()` e condicionais de redirect). Use esse parâmetro quando quiser demonstrar as telas sem criar conta na aplicação. fileciteturn1file5

> **Atenção:** `?preview=true` só afeta a verificação feita no cliente (JS). Em produção, se houver rotas server-side que restrinjam acesso, será necessário adaptar.

---

## ▶️ Como rodar localmente

**Requisitos**
- Node 18+ (recomendado)
- npm ou yarn

**Passos**
```bash
# instalar dependências
npm install
# ou
yarn

# rodar dev (Next.js)
npm run dev
# ou
yarn dev
```

A aplicação roda por padrão em `http://localhost:3000/`. A rota principal que demonstra o fluxo é:
- `/nova-oferta` — fluxo de criação
- `/minhas-ofertas` — listagem com filtros

Para visualizar sem login use `?preview=true` conforme explicado acima.

---

## 📁 Estrutura principal do projeto
(organização encontrada no arquivo consolidado)

```
src/
├── app/
│   ├── nova-oferta/page.tsx
│   ├── minhas-ofertas/page.tsx
│   ├── cadastro/page.tsx
│   ├── login/page.tsx
│   ├── layout.tsx
│   └── api/
│       ├── proxy/route.ts
│       └── offers/route.ts
├── components/
│   ├── Header.tsx
│   ├── LayoutWrapper.tsx
│   ├── ToastProvider.tsx
│   └── ui/ (Button, Input, Switch, Card, etc)
├── context/
│   └── BalanceContext.tsx
├── services/
│   └── api.ts           # axios wrapper / helpers: fetchRanking, postOffer, fetchOffersList
├── hooks/
│   └── useDebouncedValue.ts
├── utils/
│   └── masks.ts, formatters.ts
└── styles/
    └── globals.css
```

Arquivos importantes encontrados no projeto: `package.json`, `tailwind.config.js`, `tsconfig.json`, `postcss.config.js`, `server.js` (fake server de teste). fileciteturn1file8

---

## 🧩 API interna / proxy e endpoints
O projeto contém duas rotas serverless (Next.js) que funcionam como proxy para a API externa:

- `/api/proxy?endpoint=<endpoint>&query=<query>` — repassa requisições para `https://api.milhaspix.com/<endpoint>` (cabeçalhos CORS e `no-store`). Veja `src/app/api/proxy/route.ts`.
- `/api/offers?endpoint=<endpoint>` — wrapper similar com logs e tratamento de erro. Veja `src/app/api/offers/route.ts`. fileciteturn1file11

Exemplo de chamada do front:
```ts
// via fetch
fetch('/api/proxy?endpoint=simulate-offers-list')
```

O arquivo `src/services/api.ts` também configura um `axios` com `baseURL: "https://api.milhaspix.com"` — considere migrá-lo para `process.env` para maior flexibilidade. fileciteturn1file7

---

## 🔐 Autenticação (local) e sessão
- O projeto usa `localStorage` para armazenar um item `authUser` ao logar / registrar (simulação).
- As páginas verificam `localStorage.getItem("authUser")` no `useEffect`.
- `?preview=true` pula essa checagem na UI (útil em demo).
Veja `src/app/login/page.tsx`, `src/app/cadastro/page.tsx`, `src/app/nova-oferta/page.tsx` e `src/app/minhas-ofertas/page.tsx`. fileciteturn1file16

---

## ⚠️ Observações & Dicas de Debug
- **Import 'react-native' em código web:** Alguns erros relatados (ex.: `Module not found: Can't resolve 'react-native'`) aparecem quando se copia código React Native diretamente para Next.js. Remova imports `react-native` das páginas web ou substitua por componentes web / `react-native-web`. (Ver histórico do projeto e mensagens de erro.)
- **Hydration error `<html> cannot be a child of <body>`:** Verifique se não há múltiplos componentes retornando `<html>`/`<body>`; no Next.js App Router `app/layout.tsx` **deve** ser o único que retorna `<html><body>`. Assegure-se que `LayoutWrapper` e outros componentes não retornem `html` ou `body`. fileciteturn1file10
- **Hardcoded API_BASE:** `https://api.milhaspix.com` está hardcoded em proxies e serviços; recomendo extrair para `.env.local` (`NEXT_PUBLIC_API_BASE`) para facilitar testes locais/mocks.
- **Test server (server.js):** Há um `server.js` com um fake backend em memória (útil para testes locais). Use-o com Node enquanto desenvolve.

---

## ✅ Checklist para produção / PR
- [ ] Remover `?preview=true` em rotas de produção ou proteger adequadamente.
- [ ] Mover `API_BASE` para variáveis de ambiente.
- [ ] Garantir que não existam imports `react-native` nas páginas Next.js.
- [ ] Adicionar testes unitários/integração (Jest / Playwright).
- [ ] Revisar e documentar contratos da API (schemas de request/response).
- [ ] Revisar políticas de segurança para armazenamento de credenciais.

---

## 📸 Screenshots / Documentação visual
(O repositório contém imagens em `/public/images` — recomendo incluir evidências visuais no README, por exemplo:)
```md
### Etapa 1 — Escolha a companhia aérea
![Etapa 1](/images/etapa1.png)

### Etapa 2 — Oferte suas milhas
![Etapa 2](/images/etapa2.png)
```

Se desejar, eu mesmo posso gerar a seção de screenshots com legendas e um conjunto de imagens prontos para inserir no README.

---

## 🙋 Como contribuir
1. Faça fork do repositório;
2. Abra uma branch `feat/<sua-melhoria>`;
3. Submeta PR com descrição clara e screenshots;
4. Execute `npm run lint` e passe os testes antes de submeter.

---

## 📝 Licença e Créditos
- Este projeto se baseia em materiais e prints da interface MilhasPix. Use com autorização da marca.
- Gerado a partir da análise do arquivo consolidado `codigos_consolidados_reactnative.txt`. fileciteturn1file0

---

Se quiser, eu:
- gero o README.md e disponibilizo para download (faço agora),  
- ou já adiciono a seção de screenshots com placeholders prontos.  
Diga qual preferência — eu já gerei o README e salvei em disco (veja link abaixo).
