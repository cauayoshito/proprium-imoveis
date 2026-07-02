// types/imovel.ts
// Tipos de transporte (JSON-safe) usados entre getServerSideProps e as páginas.
// Espelham os enums de prisma/schema.prisma; Decimal vira number e DateTime
// vira string ISO na serialização.

export const TIPOS = [
  "APARTAMENTO",
  "CASA",
  "TERRENO",
  "COMERCIAL",
  "RURAL",
  "GARAGEM",
  "OUTRO",
] as const;
export type Tipo = (typeof TIPOS)[number];

export const MODALIDADES = [
  "JUDICIAL",
  "EXTRAJUDICIAL",
  "VENDA_DIRETA",
  "LICITACAO_ABERTA",
  "OUTRO",
] as const;
export type Modalidade = (typeof MODALIDADES)[number];

export const OCUPACOES = ["OCUPADO", "DESOCUPADO", "DESCONHECIDO"] as const;
export type Ocupacao = (typeof OCUPACOES)[number];

export const TIPO_LABEL: Record<Tipo, string> = {
  APARTAMENTO: "Apartamento",
  CASA: "Casa",
  TERRENO: "Terreno",
  COMERCIAL: "Comercial",
  RURAL: "Rural",
  GARAGEM: "Garagem",
  OUTRO: "Outro",
};

export const MODALIDADE_LABEL: Record<Modalidade, string> = {
  JUDICIAL: "Leilão judicial",
  EXTRAJUDICIAL: "Leilão extrajudicial",
  VENDA_DIRETA: "Venda direta",
  LICITACAO_ABERTA: "Licitação aberta",
  OUTRO: "Outra modalidade",
};

export const OCUPACAO_LABEL: Record<Ocupacao, string> = {
  OCUPADO: "Ocupado",
  DESOCUPADO: "Desocupado",
  DESCONHECIDO: "Não informado",
};

export type ImovelResumo = {
  id: string;
  titulo: string;
  tipo: Tipo;
  modalidade: Modalidade;
  cidade: string;
  uf: string;
  bairro: string | null;
  valorAvaliacao: number | null;
  valorLance: number | null;
  descontoPct: number | null;
  ocupacao: Ocupacao;
  dataLeilao: string | null;
  imagemUrl: string | null;
  fonteNome: string;
};

export type DividaDetectada = {
  tipo?: string;
  valor?: number;
  descricao?: string;
};

export type TrechoFonte = {
  campo?: string;
  trecho?: string;
  pagina?: number;
};

export type AnaliseRisco = {
  ocupacao: Ocupacao;
  aceitaFinanciamento: boolean | null;
  dividas: DividaDetectada[];
  resumo: string | null;
  trechosFonte: TrechoFonte[];
  confianca: number | null;
  extractorVersion: string;
  geradoEm: string;
};

export type ImovelDetalhe = ImovelResumo & {
  descricao: string | null;
  endereco: string | null;
  areaM2: number | null;
  aceitaFinanciamento: boolean | null;
  editalUrl: string | null;
  detalheUrl: string | null;
  fonteUrl: string;
  analiseRisco: AnaliseRisco | null;
};
