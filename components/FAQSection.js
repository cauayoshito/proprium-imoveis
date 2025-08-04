// components/FAQSection.js
import { useState } from "react";

const faqs = [
  {
    question: "Como faço para me cadastrar na plataforma?",
    answer:
      "Basta clicar em “Login” no canto superior, depois em “Criar Conta” e preencher seus dados. Você receberá um e-mail de confirmação e poderá acessar imediatamente.",
  },
  {
    question: "Quais formas de pagamento são aceitas?",
    answer:
      "Aceitamos cartão de crédito (Visa, MasterCard e Elo) em até 12x sem juros, boleto bancário e PIX. Você escolhe ao assinar o plano.",
  },
  {
    question: "Posso cancelar meu plano a qualquer momento?",
    answer:
      "Sim! Você pode cancelar diretamente pelo painel de controle. Seu acesso permanecerá ativo até o fim do período já pago e não haverá cobranças futuras.",
  },
  {
    question: "Como funciona o filtro de cidades nos leilões?",
    answer:
      "Clique na aba “Imóveis” e selecione a cidade desejada para ver apenas os imóveis daquela localidade. Use “Todas” para voltar ao geral.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="bg-gray-50 py-16">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-primary mb-8">
          Perguntas Frequentes
        </h2>
        <div className="space-y-4">
          {faqs.map((item, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex justify-between items-center bg-white px-4 py-3 text-left focus:outline-none"
              >
                <span className="font-medium text-gray-800">
                  {item.question}
                </span>
                <span className="text-accent font-bold text-xl">
                  {openIndex === idx ? "–" : "+"}
                </span>
              </button>
              {openIndex === idx && (
                <div className="px-4 py-3 bg-white border-t border-gray-200">
                  <p className="text-gray-700">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
