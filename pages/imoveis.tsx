// pages/imoveis.tsx — busca e filtros lendo do Postgres (Prisma).
// Os filtros são um <form method="get">: o estado vive na URL (compartilhável,
// funciona sem JS) e getServerSideProps refaz a consulta a cada navegação.
import type { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import prisma from "../lib/prisma";
import Disclaimer from "../components/Disclaimer";
import { formatBRL, formatDate, formatPct } from "../lib/format";
import {
  TIPOS,
  MODALIDADES,
  OCUPACOES,
  TIPO_LABEL,
  MODALIDADE_LABEL,
  OCUPACAO_LABEL,
  type ImovelResumo,
  type Tipo,
  type Modalidade,
  type Ocupacao,
} from "../types/imovel";

const PAGE_SIZE = 24;

type Filtros = {
  q: string;
  cidade: string;
  tipo: string;
  modalidade: string;
  ocupacao: string;
  descontoMin: string;
  valorMax: string;
  page: number;
};

type Props = {
  imoveis: ImovelResumo[];
  cidades: string[];
  total: number;
  filtros: Filtros;
  dbError: boolean;
};

function firstParam(v: string | string[] | undefined): string {
  return Array.isArray(v) ? v[0] ?? "" : v ?? "";
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
}) => {
  const filtros: Filtros = {
    q: firstParam(query.q).trim(),
    cidade: firstParam(query.cidade).trim(),
    tipo: firstParam(query.tipo),
    modalidade: firstParam(query.modalidade),
    ocupacao: firstParam(query.ocupacao),
    descontoMin: firstParam(query.descontoMin),
    valorMax: firstParam(query.valorMax),
    page: Math.max(1, parseInt(firstParam(query.page), 10) || 1),
  };

  try {
    const where: Record<string, unknown> = { ativo: true };

    if (filtros.q) {
      where.OR = [
        { titulo: { contains: filtros.q, mode: "insensitive" } },
        { descricao: { contains: filtros.q, mode: "insensitive" } },
        { cidade: { contains: filtros.q, mode: "insensitive" } },
      ];
    }
    if (filtros.cidade) {
      where.cidade = { equals: filtros.cidade, mode: "insensitive" };
    }
    if ((TIPOS as readonly string[]).includes(filtros.tipo)) {
      where.tipo = filtros.tipo;
    }
    if ((MODALIDADES as readonly string[]).includes(filtros.modalidade)) {
      where.modalidade = filtros.modalidade;
    }
    if ((OCUPACOES as readonly string[]).includes(filtros.ocupacao)) {
      where.ocupacao = filtros.ocupacao;
    }
    const descontoMin = parseFloat(filtros.descontoMin);
    if (!Number.isNaN(descontoMin) && descontoMin > 0) {
      where.descontoPct = { gte: descontoMin };
    }
    const valorMax = parseFloat(filtros.valorMax);
    if (!Number.isNaN(valorMax) && valorMax > 0) {
      where.valorLance = { lte: valorMax };
    }

    const [total, rows, cidadesRows] = await Promise.all([
      prisma.property.count({ where }),
      prisma.property.findMany({
        where,
        include: { source: { select: { nome: true } } },
        orderBy: [{ dataLeilao: "asc" }, { createdAt: "desc" }],
        skip: (filtros.page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.property.findMany({
        where: { ativo: true },
        distinct: ["cidade"],
        select: { cidade: true },
        orderBy: { cidade: "asc" },
      }),
    ]);

    const imoveis: ImovelResumo[] = rows.map(
      (p: {
        id: string;
        titulo: string;
        tipo: Tipo;
        modalidade: Modalidade;
        cidade: string;
        uf: string;
        bairro: string | null;
        valorAvaliacao: unknown;
        valorLance: unknown;
        descontoPct: number | null;
        ocupacao: Ocupacao;
        dataLeilao: Date | null;
        imagemUrl: string | null;
        source: { nome: string };
      }) => ({
        id: p.id,
        titulo: p.titulo,
        tipo: p.tipo,
        modalidade: p.modalidade,
        cidade: p.cidade,
        uf: p.uf,
        bairro: p.bairro,
        valorAvaliacao: p.valorAvaliacao ? Number(p.valorAvaliacao) : null,
        valorLance: p.valorLance ? Number(p.valorLance) : null,
        descontoPct: p.descontoPct,
        ocupacao: p.ocupacao,
        dataLeilao: p.dataLeilao ? p.dataLeilao.toISOString() : null,
        imagemUrl: p.imagemUrl,
        fonteNome: p.source.nome,
      })
    );

    return {
      props: {
        imoveis,
        cidades: cidadesRows.map((c: { cidade: string }) => c.cidade),
        total,
        filtros,
        dbError: false,
      },
    };
  } catch (err) {
    console.error("imoveis/getServerSideProps:", err);
    return {
      props: { imoveis: [], cidades: [], total: 0, filtros, dbError: true },
    };
  }
};

export default function ImoveisPage({
  imoveis,
  cidades,
  total,
  filtros,
  dbError,
}: Props) {
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const pageHref = (page: number) => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(filtros)) {
      if (k !== "page" && v) params.set(k, String(v));
    }
    params.set("page", String(page));
    return `/imoveis?${params.toString()}`;
  };

  return (
    <>
      <Head>
        <title>Imóveis em leilão | Proprium</title>
      </Head>
      <main className="pt-16 max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">Imóveis em leilão</h1>
        <p className="text-gray-600 mb-6">
          {dbError
            ? ""
            : `${total} imóve${total === 1 ? "l" : "is"} encontrado${
                total === 1 ? "" : "s"
              }`}
        </p>

        {/* Filtros — GET: estado na URL */}
        <form
          method="get"
          className="bg-gray-100 p-4 rounded-lg mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <input
            type="text"
            name="q"
            defaultValue={filtros.q}
            placeholder="Buscar por título, descrição ou cidade"
            className="border p-2 rounded lg:col-span-2"
          />
          <select name="cidade" defaultValue={filtros.cidade} className="border p-2 rounded">
            <option value="">Todas as cidades</option>
            {cidades.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select name="tipo" defaultValue={filtros.tipo} className="border p-2 rounded">
            <option value="">Todos os tipos</option>
            {TIPOS.map((t) => (
              <option key={t} value={t}>
                {TIPO_LABEL[t]}
              </option>
            ))}
          </select>
          <select
            name="modalidade"
            defaultValue={filtros.modalidade}
            className="border p-2 rounded"
          >
            <option value="">Todas as modalidades</option>
            {MODALIDADES.map((m) => (
              <option key={m} value={m}>
                {MODALIDADE_LABEL[m]}
              </option>
            ))}
          </select>
          <select
            name="ocupacao"
            defaultValue={filtros.ocupacao}
            className="border p-2 rounded"
          >
            <option value="">Ocupação (todas)</option>
            {OCUPACOES.map((o) => (
              <option key={o} value={o}>
                {OCUPACAO_LABEL[o]}
              </option>
            ))}
          </select>
          <select
            name="descontoMin"
            defaultValue={filtros.descontoMin}
            className="border p-2 rounded"
          >
            <option value="">Desconto mínimo</option>
            <option value="20">20% ou mais</option>
            <option value="40">40% ou mais</option>
            <option value="60">60% ou mais</option>
          </select>
          <input
            type="number"
            name="valorMax"
            defaultValue={filtros.valorMax}
            placeholder="Valor máx. (R$)"
            min={0}
            className="border p-2 rounded"
          />
          <button
            type="submit"
            className="bg-accent text-white py-2 px-6 rounded hover:bg-orange-600 transition font-medium"
          >
            Filtrar
          </button>
        </form>

        {dbError ? (
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-6 text-amber-900">
            <p className="font-semibold mb-1">Base de dados indisponível</p>
            <p className="text-sm">
              Não foi possível consultar os imóveis agora. Verifique a conexão
              com o banco (migrations aplicadas e <code>DATABASE_URL</code>{" "}
              válida) e tente novamente.
            </p>
          </div>
        ) : imoveis.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center text-gray-600">
            <p className="font-semibold mb-1">Nenhum imóvel encontrado</p>
            <p className="text-sm">
              Ajuste os filtros ou volte mais tarde — novas oportunidades são
              adicionadas conforme as fontes publicam editais.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {imoveis.map((imovel) => (
              <Link
                key={imovel.id}
                href={`/imoveis/${imovel.id}`}
                className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition bg-white flex flex-col"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {imovel.imagemUrl ? (
                  <img
                    src={imovel.imagemUrl}
                    alt={imovel.titulo}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-primary/10 flex items-center justify-center text-primary/50 text-sm">
                    Sem imagem
                  </div>
                )}
                <div className="p-4 flex-1 flex flex-col">
                  <h2 className="text-lg font-semibold">{imovel.titulo}</h2>
                  <p className="text-gray-500 text-sm">
                    {imovel.cidade} – {imovel.uf}
                    {imovel.bairro ? ` · ${imovel.bairro}` : ""}
                  </p>
                  <p className="text-accent font-bold mt-2">
                    {formatBRL(imovel.valorLance)}
                    {imovel.descontoPct !== null && (
                      <span className="ml-2 text-xs font-semibold bg-green-100 text-green-800 px-2 py-0.5 rounded-full align-middle">
                        {formatPct(imovel.descontoPct)} abaixo da avaliação
                      </span>
                    )}
                  </p>
                  <p className="text-gray-500 text-xs mt-2">
                    {MODALIDADE_LABEL[imovel.modalidade]} ·{" "}
                    {OCUPACAO_LABEL[imovel.ocupacao]} · Leilão:{" "}
                    {formatDate(imovel.dataLeilao)}
                  </p>
                  <p className="text-gray-400 text-xs mt-auto pt-3">
                    Fonte: {imovel.fonteNome}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Paginação */}
        {!dbError && totalPages > 1 && (
          <nav className="mt-8 flex justify-center gap-4 text-sm font-medium">
            {filtros.page > 1 && (
              <Link href={pageHref(filtros.page - 1)} className="text-accent">
                ← Anterior
              </Link>
            )}
            <span className="text-gray-500">
              Página {filtros.page} de {totalPages}
            </span>
            {filtros.page < totalPages && (
              <Link href={pageHref(filtros.page + 1)} className="text-accent">
                Próxima →
              </Link>
            )}
          </nav>
        )}

        <div className="mt-10">
          <Disclaimer />
        </div>
      </main>
    </>
  );
}
