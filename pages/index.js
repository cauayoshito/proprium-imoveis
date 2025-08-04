// pages/index.js
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
        <title>Malsa Investimentos</title>
        <meta
          name="description"
          content="Invista com segurança em imóveis de leilão em Minas Gerais"
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
