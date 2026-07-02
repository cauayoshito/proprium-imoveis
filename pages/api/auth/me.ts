// GET /api/auth/me — retorna o usuário da sessão atual (ou 401).
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { getSession, clearSessionCookie } from "../../../lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Método não permitido" });
  }

  const session = getSession(req);
  if (!session) {
    return res.status(401).json({ user: null });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, email: true, nome: true, telefoneWhatsapp: true },
    });

    if (!user) {
      // Token válido de usuário que não existe mais: encerra a sessão.
      clearSessionCookie(res);
      return res.status(401).json({ user: null });
    }

    return res.status(200).json({ user });
  } catch (err) {
    console.error("me:", err);
    return res.status(500).json({ error: "Erro ao carregar a sessão" });
  }
}
