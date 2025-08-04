// components/PricingSection.js
import Link from "next/link";

export default function PricingSection() {
  const planos = [
    {
      title: "Básico",
      price: "R$ 49,90/mês",
      features: [
        "Acesso a 100 imóveis",
        "Filtros básicos",
        "Suporte via e-mail",
      ],
    },
    {
      title: "Pro",
      price: "R$ 99,90/mês",
      features: [
        "Acesso ilimitado",
        "Filtros avançados",
        "Alertas por WhatsApp",
        "Suporte prioritário",
      ],
    },
    {
      title: "Enterprise",
      price: "Sob consulta",
      features: [
        "Relatórios customizados",
        "Onboarding dedicado",
        "API de integrações",
        "Suporte 24/7",
      ],
    },
  ];

  return (
    <section id="price" className="bg-white text-gray-800 py-16 px-4">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Nossos Planos</h2>
        <p className="text-lg text-gray-600">
          Escolha o plano ideal para acessar e monitorar imóveis de leilão.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
        {planos.map((plano) => (
          <div
            key={plano.title}
            className="border border-gray-200 rounded-lg p-6 shadow hover:shadow-lg transition"
          >
            <h3 className="text-2xl font-semibold mb-2">{plano.title}</h3>
            <p className="text-3xl font-bold text-accent mb-4">{plano.price}</p>
            <ul className="space-y-2 mb-6">
              {plano.features.map((f) => (
                <li key={f} className="flex items-center">
                  <span className="inline-block w-2 h-2 bg-accent rounded-full mr-2" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/login"
              className="w-full block bg-primary text-white py-2 rounded hover:bg-primary/90 text-center transition"
            >
              Assinar
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
