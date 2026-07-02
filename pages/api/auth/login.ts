// POST /api/auth/login — valida credenciais e emite o cookie de sessão.
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import prisma from "../../../lib/prisma";
import { signSessionToken, setSessionCookie } from "../../../lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { email, password } = req.body ?? {};
  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "Informe email e senha" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    // Mensagem única para email inexistente e senha errada: não revelar
    // quais emails têm conta (enumeração de usuários).
    const invalid = { error: "Email ou senha incorretos" };
    if (!user) return res.status(401).json(invalid);

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json(invalid);

    setSessionCookie(res, signSessionToken({ userId: user.id }));
    return res.status(200).json({
      user: { id: user.id, email: user.email, nome: user.nome },
    });
  } catch (err) {
    console.error("login:", err);
    return res.status(500).json({ error: "Erro ao entrar" });
  }
}
