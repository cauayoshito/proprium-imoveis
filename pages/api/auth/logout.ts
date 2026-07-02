// POST /api/auth/logout — limpa o cookie de sessão.
import type { NextApiRequest, NextApiResponse } from "next";
import { clearSessionCookie } from "../../../lib/auth";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método não permitido" });
  }
  clearSessionCookie(res);
  return res.status(200).json({ ok: true });
}
