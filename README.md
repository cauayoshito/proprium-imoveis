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
| IA            | Serviço próprio Python (FastAPI): extração por regras + NLP (pdfplumber/regex/spaCy) — **sem cloud API** |
| Alertas       | WhatsApp                            |
| Pagamentos    | Stripe / Pix                        |

> **Decisão de IA (ADR):** em vez de depender de uma API de nuvem, o "resumo de
> risco" do edital é feito por um **microserviço Python (FastAPI)** com extração
> **baseada em regras + NLP clássico**. É custo-zero por chamada, **explicável**
> (cita o trecho-fonte do edital, o que casa com o disclaimer legal) e um bom
> componente de portfólio. Detalhado no Bloco 5.

## Como rodar (desenvolvimento)

```bash
npm install
cp .env.example .env   # preencha as variáveis
npm run dev            # http://localhost:3000
```

Scripts: `npm run dev` (desenvolvimento), `npm run build` (build de produção),
`npm start` (servir build), `npm run deploy` (deploy Vercel).

## Banco de dados (Prisma + Neon)

O schema fica em [`prisma/schema.prisma`](prisma/schema.prisma). Aplique as
migrations **a partir de uma máquina que alcance o Neon** (a `DATABASE_URL` no
seu `.env`):

```bash
npm run db:migrate    # cria/aplica a migration (prisma migrate dev) em dev
npm run db:seed       # popula dados mínimos de desenvolvimento
npm run db:studio     # abre o Prisma Studio para inspecionar o banco
```

Em produção/CI use `npm run db:deploy` (`prisma migrate deploy`).

Scripts de banco: `db:generate`, `db:migrate`, `db:deploy`, `db:seed`,
`db:studio`.

> ⚠️ **Nota de ambiente:** o Prisma conecta ao Postgres por TCP (porta 5432).
> Ambientes de execução com egress só-HTTPS (ex.: alguns sandboxes de CI/agente)
> não conseguem alcançar o Neon — rode as migrations no seu ambiente local ou em
> um CI com acesso ao banco.

## Roadmap — MVP Fase 0 (regional, MG)

O trabalho é feito em **blocos pequenos**, com validação a cada etapa.

- [x] **Bloco 0 — Fundação:** TypeScript, padronização de marca, `.env.example`,
      `next.config.js`, disclaimers legais, este README.
- [~] **Bloco 1 — Schema:** modelagem do banco com Prisma (usuários, fontes,
      imóveis, análise de risco, perfis de busca, alertas, assinaturas). Schema
      pronto; a migration é aplicada localmente (ver "Banco de dados").
- [x] **Bloco 2 — Autenticação própria** (JWT em cookie httpOnly + bcrypt):
      rotas `/api/auth/{register,login,logout,me}`, páginas de login/cadastro
      e remoção do next-auth.
- [ ] **Bloco 3 — Busca + filtros reais + página de detalhe** lendo do banco.
- [ ] **Bloco 4 — Ingestão/normalização** de 3–5 fontes (Caixa + leiloeiros),
      respeitando ToS/robots e preferindo fontes oficiais/públicas.
- [ ] **Bloco 5 — Resumo de risco** do edital via microserviço Python/FastAPI
      (regras + NLP clássico, sem cloud API).
- [ ] **Bloco 6 — Perfil de busca → alerta por WhatsApp.**
- [ ] **Bloco 7 — Paywall + assinatura** (Stripe / Pix).

## Estrutura

```
components/   Componentes React (UI)
pages/        Rotas (Pages Router) e, futuramente, /pages/api
lib/          Utilitários compartilhados (ex.: cliente Prisma)
prisma/       schema.prisma, migrations e seed
public/       Imagens estáticas
styles/       CSS global (Tailwind)
```

## Convenções

- Não inventar fontes, dados de imóveis ou números de mercado.
- Preferir fontes **oficiais/públicas**; respeitar **ToS e robots.txt**.
- Todo texto voltado ao usuário deve deixar claro que o Proprium **informa e
  organiza, não dá parecer jurídico**.
