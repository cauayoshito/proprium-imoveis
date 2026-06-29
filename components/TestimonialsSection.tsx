// components/TestimonialsSection.tsx
import Image from "next/image";

type Depoimento = {
  id: number;
  nome: string;
  local: string;
  texto: string;
  avatar: string;
};

const depoimentos: Depoimento[] = [
  {
    id: 1,
    nome: "Alexandre Garbin",
    local: "Campinas-SP",
    texto:
      "“Estou extremamente satisfeito com a ferramenta. A funcionalidade do mapa, semelhante ao Google Maps, proporciona uma experiência incrível, facilitando encontrar os leilões nos bairros desejados.”",
    avatar: "/images/alexandre.jpeg",
  },
  {
    id: 2,
    nome: "Marcos Yamamoto",
    local: "Curitiba-PR",
    texto:
      "“Ótimo! Preço justo para as oportunidades que entregam principalmente pela economia de tempo utilizando a filtragem! Recomendo!”",
    avatar: "/images/paulo.jpg",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="depoimentos" className="bg-primary py-16">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-white text-center mb-8">
          O que estão falando da Proprium
        </h2>
        <div className="space-y-6">
          {depoimentos.map((d) => (
            <div
              key={d.id}
              className="bg-white rounded-2xl p-6 lg:flex lg:items-center lg:gap-6"
            >
              <div className="flex-shrink-0 mb-4 lg:mb-0">
                <Image
                  src={d.avatar}
                  alt={d.nome}
                  width={64}
                  height={64}
                  className="rounded-full object-cover"
                />
              </div>
              <div>
                <p className="text-gray-700 italic">{d.texto}</p>
                <p className="mt-4 font-semibold text-gray-900">
                  {d.nome} <span className="text-gray-500">– {d.local}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
