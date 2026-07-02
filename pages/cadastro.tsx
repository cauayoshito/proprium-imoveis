// pages/cadastro.tsx
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../lib/auth-context";

export default function CadastroPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro ao criar a conta");
        return;
      }
      await refresh();
      router.push("/imoveis");
    } catch {
      setError("Falha de conexão. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Criar conta | Proprium</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-primary/10 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white max-w-md w-full p-8 rounded-lg shadow-lg"
        >
          <h1 className="text-2xl font-bold text-center mb-6 text-primary">
            Criar conta
          </h1>

          {error && (
            <p
              role="alert"
              className="mb-4 rounded bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-sm"
            >
              {error}
            </p>
          )}

          <label className="block mb-1 text-sm font-medium text-gray-700">
            Nome
          </label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Seu nome"
            autoComplete="name"
            className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/50 transition outline-none"
          />

          <label className="block mb-1 text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@exemplo.com"
            autoComplete="email"
            className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/50 transition outline-none"
            required
          />

          <label className="block mb-1 text-sm font-medium text-gray-700">
            Senha
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo de 8 caracteres"
            autoComplete="new-password"
            minLength={8}
            className="w-full mb-6 px-4 py-3 border border-gray-300 rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/50 transition outline-none"
            required
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-accent text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-60"
          >
            {submitting ? "Criando…" : "Criar conta"}
          </button>

          <p className="mt-4 text-center text-sm text-gray-600">
            Já tem conta?{" "}
            <Link href="/login" className="text-accent font-medium">
              Entrar
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
