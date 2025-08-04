// pages/planos.js
import Head from "next/head";
import Navbar from "../components/Navbar";
import PricingSection from "../components/PricingSection";
import FAQSection from "../components/FAQSection";
import Footer from "../components/TestimonialsSection";

export default function PlanosPage() {
  return (
    <>
      <Head>
        <title>Planos | Proprium Investimentos</title>
        <meta
          name="description"
          content="Escolha o plano ideal para acessar e monitorar imóveis de leilão."
        />
      </Head>

      <Navbar />

      <main className="pt-24">
        <PricingSection />
        <FAQSection />
      </main>

      <Footer />
    </>
  );
}
