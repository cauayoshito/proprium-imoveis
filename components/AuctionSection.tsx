// components/AuctionSection.tsx
import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

type ImovelLeilao = {
  id: number;
  titulo: string;
  lance: string;
  local: string;
  data: string;
  imagem: string;
};

// ⚠️ Dados de exemplo (placeholder). Serão substituídos pela ingestão real
// de fontes oficiais/públicas de leilão no Bloco 4. Nada aqui é oferta real.
const imoveis: ImovelLeilao[] = [
  {
    id: 1,
    titulo: "Casa em Salvador – Stiep",
    lance: "R$ 320.000",
    local: "Salvador",
    data: "10/06/2025",
    imagem: "/imoveis/stiep.jpg",
  },
  {
    id: 2,
    titulo: "Apartamento em Lauro de Freitas",
    lance: "R$ 240.000",
    local: "Lauro de Freitas",
    data: "15/06/2025",
    imagem: "/imoveis/lauro.jpg",
  },
  {
    id: 3,
    titulo: "Terreno em Feira de Santana",
    lance: "R$ 180.000",
    local: "Feira de Santana",
    data: "20/06/2025",
    imagem: "/imoveis/feira.jpg",
  },
];

export default function AuctionSection() {
  // 1) Todos os Hooks devem vir primeiro:
  const { status } = useSession();
  const [filtro, setFiltro] = useState("Todas");
  const cidades = useMemo(
    () => ["Todas", ...new Set(imoveis.map((i) => i.local))],
    []
  );
  const filtrados = useMemo(
    () =>
      filtro === "Todas" ? imoveis : imoveis.filter((i) => i.local === filtro),
    [filtro]
  );

  // 2) Early return para loading
  if (status === "loading") {
    return <p className="p-8 text-center">Carregando imóveis…</p>;
  }

  // 3) Render principal
  return (
    <section id="imoveis" className="scroll-mt-24 px-6 py-16 bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-8 text-primary">
        Imóveis em Leilão
      </h2>

      {/* Filtros de cidade */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {cidades.map((c) => (
          <button
            key={c}
            onClick={() => setFiltro(c)}
            className={`px-4 py-2 rounded-full font-medium transition ${
              filtro === c
                ? "bg-accent text-white shadow-lg"
                : "bg-white text-primary border border-gray-300 hover:bg-gray-100"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Lista de cartões */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtrados.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden flex flex-col"
          >
            <Image
              src={item.imagem}
              alt={item.titulo}
              width={400}
              height={240}
              className="object-cover"
            />
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="text-xl font-semibold text-primary">
                {item.titulo}
              </h3>
              <p className="text-accent font-bold mt-2">Lance: {item.lance}</p>
              <p className="text-gray-600 mt-1">Local: {item.local}</p>
              <p className="text-gray-600 mt-1">Data: {item.data}</p>

              <Link
                href={`/imoveis/${item.id}`}
                className="mt-auto bg-primary text-white py-2 rounded hover:bg-blue-900 text-center"
              >
                Ver imóvel
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
