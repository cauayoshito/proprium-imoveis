// POST /api/auth/register — cria a conta, já autentica (cookie de sessão).
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import prisma from "../../../lib/prisma";
import { signSessionToken, setSessionCookie } from "../../../lib/auth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BCRYPT_ROUNDS = 10;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { email, password, nome } = req.body ?? {};

  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: "Email inválido" });
  }
  if (typeof password !== "string" || password.length < 8) {
    return res
      .status(400)
      .json({ error: "A senha deve ter pelo menos 8 caracteres" });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    });
    if (existing) {
      return res.status(409).json({ error: "Este email já está cadastrado" });
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        nome: typeof nome === "string" && nome.trim() ? nome.trim() : null,
      },
      select: { id: true, email: true, nome: true },
    });

    setSessionCookie(res, signSessionToken({ userId: user.id }));
    return res.status(201).json({ user });
  } catch (err) {
    console.error("register:", err);
    return res.status(500).json({ error: "Erro ao criar a conta" });
  }
}
