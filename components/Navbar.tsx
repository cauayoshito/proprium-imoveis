// components/Navbar.tsx
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useAuth } from "../lib/auth-context";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

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

          {loading ? null : user ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-sm text-gray-300">
                {user.nome ?? user.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-white/10 text-white px-3 py-1 rounded text-sm hover:bg-white/20 transition"
              >
                Sair
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-accent text-white px-3 py-1 rounded text-sm hover:bg-orange-600 transition"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
