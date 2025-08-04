// pages/imoveis.js
import { useState } from "react";
import Image from "next/image";

const mockImoveis = [
  {
    id: 1,
    titulo: "Apartamento no Centro",
    preco: "R$ 350.000",
    cidade: "Belo Horizonte",
    imagem: "/imoveis/bh.jpg",
  },
  {
    id: 2,
    titulo: "Casa com Piscina",
    preco: "R$ 780.000",
    cidade: "Salvador",
    imagem: "/imoveis/ba.jpg",
  },
  {
    id: 3,
    titulo: "Sala Comercial",
    preco: "R$ 220.000",
    cidade: "São Paulo",
    imagem: "/imoveis/sp.jpg",
  },
];

export default function Imoveis() {
  const [busca, setBusca] = useState("");

  const imoveisFiltrados = mockImoveis.filter((imovel) =>
    imovel.titulo.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <main className="pt-16 max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Imóveis Disponíveis</h1>

      {/* 🔹 Filtros */}
      <div className="bg-gray-100 p-4 rounded-lg mb-8 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Buscar por nome ou cidade"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="border p-2 rounded w-full sm:w-64"
        />
        <select className="border p-2 rounded">
          <option>Tipo de Imóvel</option>
          <option>Apartamento</option>
          <option>Casa</option>
          <option>Comercial</option>
        </select>
        <select className="border p-2 rounded">
          <option>Faixa de Preço</option>
          <option>Até R$ 200.000</option>
          <option>R$ 200.000 a R$ 500.000</option>
          <option>Acima de R$ 500.000</option>
        </select>
      </div>

      {/* 🔹 Grid de Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {imoveisFiltrados.map((imovel) => (
          <div
            key={imovel.id}
            className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition"
          >
            <Image
              src={imovel.imagem}
              alt={imovel.titulo}
              width={400}
              height={250}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold">{imovel.titulo}</h2>
              <p className="text-accent font-bold">{imovel.preco}</p>
              <p className="text-gray-500 text-sm">{imovel.cidade}</p>
              <button className="mt-3 w-full bg-accent text-white py-2 rounded hover:bg-orange-600 transition">
                Ver Detalhes
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
