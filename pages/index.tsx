// pages/index.tsx
import Head from "next/head";
import Hero from "../components/Hero";
import AuctionSection from "../components/AuctionSection";
import PricingSection from "../components/PricingSection";
import DescriptionSection from "../components/DescriptionSection";
import ContactSection from "../components/ContactSection";

export default function Home() {
  return (
    <>
      <Head>
        <title>Proprium | Imóveis de leilão para investir</title>
        <meta
          name="description"
          content="O Proprium reúne e organiza oportunidades de imóveis de leilão em Minas Gerais, com filtros, alertas e resumo de risco para investidores."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {/* Hero / topo da página */}
        <Hero />

        {/* Seção de imóveis filtráveis */}
        <AuctionSection />

        {/* Seção de planos */}
        <PricingSection />

        {/* Seção de descrição adicional */}
        <DescriptionSection />

        {/* Seção de contato */}
        <ContactSection />
      </main>
    </>
  );
}
