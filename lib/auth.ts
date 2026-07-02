// lib/auth.ts
// Autenticação própria: JWT assinado com HS256, transportado em cookie
// httpOnly (o JS do navegador nunca lê o token — mitiga roubo via XSS).
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export const AUTH_COOKIE = "proprium_token";
const TOKEN_MAX_AGE_S = 60 * 60 * 24 * 7; // 7 dias

export type SessionPayload = {
  userId: string;
};

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    // Falhar cedo e alto: rodar com sessão sem segredo seria um buraco de
    // segurança silencioso (tokens forjáveis).
    throw new Error(
      "JWT_SECRET não definido. Gere um com `openssl rand -base64 32` e adicione ao .env."
    );
  }
  return secret;
}

export function signSessionToken(payload: SessionPayload): string {
  return jwt.sign(payload, getJwtSecret(), {
    algorithm: "HS256",
    expiresIn: TOKEN_MAX_AGE_S,
  });
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret(), {
      algorithms: ["HS256"],
    });
    if (typeof decoded === "object" && typeof decoded.userId === "string") {
      return { userId: decoded.userId };
    }
    return null;
  } catch {
    return null;
  }
}

function buildCookie(value: string, maxAgeSeconds: number): string {
  const parts = [
    `${AUTH_COOKIE}=${value}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAgeSeconds}`,
  ];
  if (process.env.NODE_ENV === "production") {
    parts.push("Secure");
  }
  return parts.join("; ");
}

export function setSessionCookie(res: NextApiResponse, token: string): void {
  res.setHeader("Set-Cookie", buildCookie(token, TOKEN_MAX_AGE_S));
}

export function clearSessionCookie(res: NextApiResponse): void {
  res.setHeader("Set-Cookie", buildCookie("", 0));
}

/** Extrai e valida a sessão a partir do cookie da requisição. */
export function getSession(req: NextApiRequest): SessionPayload | null {
  const token = req.cookies[AUTH_COOKIE];
  if (!token) return null;
  return verifySessionToken(token);
}
