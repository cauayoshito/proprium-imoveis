// components/Imoveis.js
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Imoveis() {
  const { data: session, status } = useSession();
  if (status === "loading")
    return <p className="p-8 text-center">Carregando imóveis…</p>;

  const imoveis = [
    {
      id: 1,
      titulo: "Casa em Salvador – Stiep",
      valor: "R$ 320.000",
      tipo: "Residencial",
      data: "10/06/2025",
    },
    {
      id: 2,
      titulo: "Apartamento em Lauro de Freitas",
      valor: "R$ 240.000",
      tipo: "Residencial",
      data: "15/06/2025",
    },
    {
      id: 3,
      titulo: "Terreno em Feira de Santana",
      valor: "R$ 180.000",
      tipo: "Terreno",
      data: "20/06/2025",
    },
    // você pode adicionar mais…
  ];

  return (
    <section id="imoveis" className="p-8 bg-gray-50">
      <h2 className="text-2xl font-bold text-center mb-6">
        Imóveis Disponíveis
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {imoveis.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow p-4 flex flex-col"
          >
            <h3 className="font-bold text-xl mb-2">{item.titulo}</h3>
            <p className="text-accent font-semibold mb-1">{item.valor}</p>
            <p className="text-sm text-gray-600 mb-4">{item.tipo}</p>
            <p className="text-xs text-gray-500 mb-4">Data: {item.data}</p>

            <Link
              href={
                session
                  ? `/imoveis/${item.id}` // logado → detalhe
                  : "/login" // não logado → login
              }
              legacyBehavior
            >
              <a className="mt-auto block bg-accent text-white text-center px-4 py-2 rounded hover:bg-orange-700">
                Ver imóvel
              </a>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
