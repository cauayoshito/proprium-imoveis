// pages/planos.tsx
import Head from "next/head";
import PricingSection from "../components/PricingSection";
import FAQSection from "../components/FAQSection";
import ContactSection from "../components/ContactSection";

export default function PlanosPage() {
  return (
    <>
      <Head>
        <title>Planos | Proprium</title>
        <meta
          name="description"
          content="Escolha o plano ideal para acessar e monitorar imóveis de leilão."
        />
      </Head>

      <main className="pt-24">
        <PricingSection />
        <FAQSection />
      </main>

      <ContactSection />
    </>
  );
}
