// pages/imoveis/[id].tsx — detalhe do imóvel, com link para o edital original
// e o resumo de risco (gerado pelo serviço de análise no Bloco 5).
import type { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import prisma from "../../lib/prisma";
import Disclaimer from "../../components/Disclaimer";
import { formatBRL, formatDate, formatPct } from "../../lib/format";
import {
  TIPO_LABEL,
  MODALIDADE_LABEL,
  OCUPACAO_LABEL,
  type ImovelDetalhe,
  type DividaDetectada,
  type TrechoFonte,
} from "../../types/imovel";

type Props = { imovel: ImovelDetalhe };

export const getServerSideProps: GetServerSideProps<Props> = async ({
  params,
}) => {
  const id = typeof params?.id === "string" ? params.id : "";
  if (!id) return { notFound: true };

  try {
    const p = await prisma.property.findUnique({
      where: { id },
      include: {
        source: { select: { nome: true, url: true } },
        riskAnalysis: true,
      },
    });

    if (!p || !p.ativo) return { notFound: true };

    const imovel: ImovelDetalhe = {
      id: p.id,
      titulo: p.titulo,
      descricao: p.descricao,
      tipo: p.tipo,
      modalidade: p.modalidade,
      cidade: p.cidade,
      uf: p.uf,
      bairro: p.bairro,
      endereco: p.endereco,
      areaM2: p.areaM2,
      valorAvaliacao: p.valorAvaliacao ? Number(p.valorAvaliacao) : null,
      valorLance: p.valorLance ? Number(p.valorLance) : null,
      descontoPct: p.descontoPct,
      ocupacao: p.ocupacao,
      aceitaFinanciamento: p.aceitaFinanciamento,
      dataLeilao: p.dataLeilao ? p.dataLeilao.toISOString() : null,
      imagemUrl: p.imagemUrl,
      editalUrl: p.editalUrl,
      detalheUrl: p.detalheUrl,
      fonteNome: p.source.nome,
      fonteUrl: p.source.url,
      analiseRisco: p.riskAnalysis
        ? {
            ocupacao: p.riskAnalysis.ocupacao,
            aceitaFinanciamento: p.riskAnalysis.aceitaFinanciamento,
            dividas: (p.riskAnalysis.dividas ?? []) as DividaDetectada[],
            resumo: p.riskAnalysis.resumo,
            trechosFonte: (p.riskAnalysis.trechosFonte ?? []) as TrechoFonte[],
            confianca: p.riskAnalysis.confianca,
            extractorVersion: p.riskAnalysis.extractorVersion,
            geradoEm: p.riskAnalysis.geradoEm.toISOString(),
          }
        : null,
    };

    return { props: { imovel } };
  } catch (err) {
    console.error("imoveis/[id]/getServerSideProps:", err);
    return { notFound: true };
  }
};

function Fato({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <dt className="text-xs text-gray-500">{rotulo}</dt>
      <dd className="font-semibold text-primary">{valor}</dd>
    </div>
  );
}

export default function ImovelDetalhePage({ imovel }: Props) {
  const risco = imovel.analiseRisco;

  return (
    <>
      <Head>
        <title>{`${imovel.titulo} | Proprium`}</title>
      </Head>
      <main className="pt-24 max-w-4xl mx-auto px-6 pb-16">
        <Link href="/imoveis" className="text-sm text-accent">
          ← Voltar para a busca
        </Link>

        <h1 className="text-3xl font-bold mt-2">{imovel.titulo}</h1>
        <p className="text-gray-600 mt-1">
          {imovel.cidade} – {imovel.uf}
          {imovel.bairro ? ` · ${imovel.bairro}` : ""}
          {imovel.endereco ? ` · ${imovel.endereco}` : ""}
        </p>

        {imovel.imagemUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imovel.imagemUrl}
            alt={imovel.titulo}
            className="w-full max-h-96 object-cover rounded-xl mt-6"
          />
        )}

        {/* Fatos principais */}
        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
          <Fato rotulo="Lance mínimo" valor={formatBRL(imovel.valorLance)} />
          <Fato rotulo="Avaliação" valor={formatBRL(imovel.valorAvaliacao)} />
          <Fato
            rotulo="Desconto"
            valor={
              imovel.descontoPct !== null ? formatPct(imovel.descontoPct) : "—"
            }
          />
          <Fato rotulo="Tipo" valor={TIPO_LABEL[imovel.tipo]} />
          <Fato
            rotulo="Modalidade"
            valor={MODALIDADE_LABEL[imovel.modalidade]}
          />
          <Fato rotulo="Data do leilão" valor={formatDate(imovel.dataLeilao)} />
          <Fato rotulo="Ocupação" valor={OCUPACAO_LABEL[imovel.ocupacao]} />
          <Fato
            rotulo="Aceita financiamento"
            valor={
              imovel.aceitaFinanciamento === null
                ? "Não informado"
                : imovel.aceitaFinanciamento
                ? "Sim"
                : "Não"
            }
          />
          <Fato
            rotulo="Área"
            valor={imovel.areaM2 !== null ? `${imovel.areaM2} m²` : "—"}
          />
        </dl>

        {imovel.descricao && (
          <section className="mt-8">
            <h2 className="text-xl font-bold text-primary mb-2">Descrição</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {imovel.descricao}
            </p>
          </section>
        )}

        {/* Resumo de risco */}
        <section className="mt-8">
          <h2 className="text-xl font-bold text-primary mb-2">
            Resumo de risco{" "}
            <span className="text-xs font-medium bg-accent/10 text-accent px-2 py-0.5 rounded-full align-middle">
              automático
            </span>
          </h2>
          {risco ? (
            <div className="border border-gray-200 rounded-xl p-5 space-y-4">
              {risco.resumo && <p className="text-gray-800">{risco.resumo}</p>}

              {risco.dividas.length > 0 && (
                <div>
                  <h3 className="font-semibold text-sm text-gray-700 mb-1">
                    Dívidas detectadas no edital
                  </h3>
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    {risco.dividas.map((d, i) => (
                      <li key={i}>
                        {d.tipo ?? "Dívida"}
                        {d.valor !== undefined ? `: ${formatBRL(d.valor)}` : ""}
                        {d.descricao ? ` — ${d.descricao}` : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {risco.trechosFonte.length > 0 && (
                <div>
                  <h3 className="font-semibold text-sm text-gray-700 mb-1">
                    Trechos do edital que embasam esta análise
                  </h3>
                  <ul className="space-y-2">
                    {risco.trechosFonte.map((t, i) => (
                      <li
                        key={i}
                        className="text-sm text-gray-600 bg-gray-50 border-l-4 border-accent/40 pl-3 py-2 rounded-r"
                      >
                        {t.campo && (
                          <span className="font-medium">[{t.campo}] </span>
                        )}
                        “{t.trecho}”
                        {t.pagina !== undefined && (
                          <span className="text-gray-400"> (pág. {t.pagina})</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="text-xs text-gray-400">
                Gerado automaticamente em {formatDate(risco.geradoEm)} (extrator{" "}
                {risco.extractorVersion}
                {risco.confianca !== null
                  ? `, confiança ${Math.round(risco.confianca * 100)}%`
                  : ""}
                ). Confira sempre o edital original.
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500 border border-dashed border-gray-300 rounded-xl p-5">
              O resumo de risco deste imóvel ainda não foi gerado. Consulte o
              edital original abaixo.
            </p>
          )}
        </section>

        {/* Fonte e edital — sempre visíveis (transparência) */}
        <section className="mt-8 flex flex-col sm:flex-row gap-3">
          {imovel.editalUrl && (
            <a
              href={imovel.editalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-white text-center px-6 py-3 rounded-lg font-semibold hover:bg-blue-900 transition"
            >
              Ver edital original ↗
            </a>
          )}
          <a
            href={imovel.detalheUrl ?? imovel.fonteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-primary text-primary text-center px-6 py-3 rounded-lg font-semibold hover:bg-primary/5 transition"
          >
            Ver na fonte ({imovel.fonteNome}) ↗
          </a>
        </section>

        <div className="mt-10">
          <Disclaimer />
        </div>
      </main>
    </>
  );
}
