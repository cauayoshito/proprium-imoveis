// lib/prisma.ts
// Singleton do Prisma Client. Em desenvolvimento, o hot-reload do Next.js
// recria módulos a cada alteração; sem o singleton, isso abriria conexões
// demais com o Postgres. Guardamos a instância no globalThis fora de produção.
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
