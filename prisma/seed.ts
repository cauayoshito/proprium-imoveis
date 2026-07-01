// prisma/seed.ts
// Seed mínimo para desenvolvimento local. NÃO cria imóveis fictícios — apenas
// registra a fonte oficial pública (Caixa) como ponto de partida da ingestão.
// A verificação de robots.txt/ToS e a captação real acontecem no Bloco 4;
// por isso robotsOk/tosOk começam como false (a confirmar).
import { PrismaClient, SourceType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.source.upsert({
    where: { id: "caixa-oficial" },
    update: {},
    create: {
      id: "caixa-oficial",
      nome: "Caixa Econômica Federal — Venda de Imóveis",
      tipo: SourceType.OFICIAL,
      url: "https://venda-imoveis.caixa.gov.br",
      robotsOk: false, // a verificar no Bloco 4
      tosOk: false, // a verificar no Bloco 4
      ativo: false, // ativa somente após validação legal da captação
    },
  });

  console.log("Seed concluído: fonte oficial (Caixa) registrada.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
