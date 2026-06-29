# Proprium

Agregador e curadoria de **oportunidades de leilão de imóveis** para o
investidor pessoa física iniciante/intermediário. O Proprium **reúne e
organiza** informações públicas de leilão, oferecendo busca, filtros, alertas e
um **resumo de risco** por imóvel — sempre com link para o **edital original**
da fonte.

> ⚠️ O Proprium informa e organiza. **Não presta parecer jurídico** e não
> garante a exatidão dos dados. Confira sempre o edital original da fonte.
> Investir em leilão envolve riscos.

## Visão de produto

- **Nicho:** investidor PF (não corretor, não leiloeiro).
- **Killer feature:** alerta por **WhatsApp** quando surge imóvel no perfil de
  busca do usuário.
- **Diferencial:** **resumo de risco** por imóvel (ocupação, dívidas, aceita
  financiamento), sumarizado do edital com a **Claude API**.
- **Monetização:** assinatura recorrente (Básico / Pro / Enterprise), com
  paywall nos alertas e no limite de imóveis.

## Stack

| Camada        | Tecnologia                          |
| ------------- | ----------------------------------- |
| Frontend/SSR  | Next.js 15 (Pages Router) + React 18 |
| Linguagem     | TypeScript                          |
| Estilo        | Tailwind CSS                        |
| Banco         | PostgreSQL (Neon)                   |
| ORM           | Prisma                              |
| Autenticação  | Própria (JWT + bcrypt)              |
| IA            | Claude API (Anthropic)              |
| Alertas       | WhatsApp                            |
| Pagamentos    | Stripe / Pix                        |

## Como rodar (desenvolvimento)

```bash
npm install
cp .env.example .env   # preencha as variáveis
npm run dev            # http://localhost:3000
```

Scripts: `npm run dev` (desenvolvimento), `npm run build` (build de produção),
`npm start` (servir build), `npm run deploy` (deploy Vercel).

## Roadmap — MVP Fase 0 (regional, MG)

O trabalho é feito em **blocos pequenos**, com validação a cada etapa.

- [x] **Bloco 0 — Fundação:** TypeScript, padronização de marca, `.env.example`,
      `next.config.js`, disclaimers legais, este README.
- [ ] **Bloco 1 — Schema:** modelagem do banco com Prisma (imóveis, fontes,
      perfis de busca, alertas, usuários, assinaturas) + migrations.
- [ ] **Bloco 2 — Autenticação própria** (JWT + bcrypt) substituindo o login
      atual.
- [ ] **Bloco 3 — Busca + filtros reais + página de detalhe** lendo do banco.
- [ ] **Bloco 4 — Ingestão/normalização** de 3–5 fontes (Caixa + leiloeiros),
      respeitando ToS/robots e preferindo fontes oficiais/públicas.
- [ ] **Bloco 5 — Resumo de risco** do edital com a Claude API.
- [ ] **Bloco 6 — Perfil de busca → alerta por WhatsApp.**
- [ ] **Bloco 7 — Paywall + assinatura** (Stripe / Pix).

## Estrutura

```
components/   Componentes React (UI)
pages/        Rotas (Pages Router) e, futuramente, /pages/api
public/       Imagens estáticas
styles/       CSS global (Tailwind)
```

## Convenções

- Não inventar fontes, dados de imóveis ou números de mercado.
- Preferir fontes **oficiais/públicas**; respeitar **ToS e robots.txt**.
- Todo texto voltado ao usuário deve deixar claro que o Proprium **informa e
  organiza, não dá parecer jurídico**.
