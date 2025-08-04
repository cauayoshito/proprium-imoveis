// pages/login.js
import { useState } from "react";
import Head from "next/head";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signIn("credentials", { email, password, callbackUrl: "/" });
  };

  return (
    <>
      <Head>
        <title>Entrar | Proprium Investimentos</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-primary/10">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-primary max-w-md w-full p-8 rounded-lg shadow-lg"
        >
          <h1 className="text-2xl font-bold text-center mb-6 text-primary">
            Acesse sua conta
          </h1>

          <label className="block mb-1 text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@exemplo.com"
            className="
              w-full mb-4 px-4 py-3
              bg-white bg-opacity-20 placeholder-gray-400
              border border-gray-600 rounded-lg
              focus:bg-opacity-40 focus:border-accent
              focus:ring-2 focus:ring-accent/50
              transition outline-none
            "
            required
          />

          <label className="block mb-1 text-sm font-medium text-gray-700">
            Senha
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="
              w-full mb-6 px-4 py-3
              bg-white bg-opacity-20 placeholder-gray-400
              border border-gray-600 rounded-lg
              focus:bg-opacity-40 focus:border-accent
              focus:ring-2 focus:ring-accent/50
              transition outline-none
            "
            required
          />

          <button
            type="submit"
            className="w-full bg-accent text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
          >
            Entrar
          </button>
        </form>
      </div>
    </>
  );
}
