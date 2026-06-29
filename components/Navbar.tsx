// components/Navbar.tsx
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="fixed top-0 w-full bg-[#00113C] shadow-md z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
        <Link href="/" className="inline-block">
          <Image
            src="/images/logo.png"
            alt="Proprium"
            width={160}
            height={48}
            className="object-contain"
          />
        </Link>

        <nav className="flex items-center space-x-6 text-accent font-medium">
          <Link href="/">Início</Link>
          <Link href="/imoveis">Imóveis</Link>
          <Link href="/planos">Planos</Link>
          <Link
            href="/login"
            className="bg-accent text-white px-3 py-1 rounded text-sm hover:bg-orange-600 transition"
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
