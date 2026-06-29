// components/Hero.tsx
import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative h-screen bg-[url('/images/1.jpg')] bg-cover bg-center flex items-center"
    >
      {/* Sobreposição translúcida */}
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 max-w-2xl mx-auto text-center px-4">
        {/* 🔹 Título com animação */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold text-white mb-4"
        >
          Transforme sonhos em{" "}
          <span className="text-accent">investimentos reais</span> com leilões
          de imóveis
        </motion.h1>

        {/* 🔹 Parágrafo com animação */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg md:text-xl text-gray-200 mb-8"
        >
          Descubra oportunidades exclusivas em todo o país e multiplique seu
          patrimônio de forma simples, segura e com o suporte que você merece.
        </motion.p>

        {/* 🔹 Botões com animação em sequência */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <Link
            href="/imoveis"
            className="bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
          >
            Ver Imóveis
          </Link>
          <Link
            href="/planos"
            className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition"
          >
            Conheça os Planos
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
