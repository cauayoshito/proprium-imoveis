import Image from "next/image";

export default function ContactSection() {
  return (
    <footer id="contato" className="bg-primary text-white py-12 text-center">
      <div className="max-w-3xl mx-auto">
        <Image
          src="/images/logo.png"
          alt="Logo Proprium"
          width={120}
          height={40}
          className="mx-auto mb-4"
        />

        <p>CNPJ: 12.345.678/0001-90 - Proprium Consultoria Imobiliária Ltda</p>
        <p>Av. das Flores, 1234 - Centro, Belo Horizonte - MG</p>

        <div className="mt-4 space-x-6">
          <a href="https://wa.me/31999998888" className="hover:text-accent">
            WhatsApp
          </a>
          <a
            href="mailto:contato@proprium.com.br"
            className="hover:text-accent"
          >
            Email
          </a>
        </div>

        <div className="mt-6 space-x-4 text-gray-300">
          <a href="#">Instagram</a>
          <a href="#">YouTube</a>
        </div>

        <p className="mt-8 text-gray-400">
          © {new Date().getFullYear()} Proprium Investimentos - Todos os
          direitos reservados
        </p>
      </div>
    </footer>
  );
}
