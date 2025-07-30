import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Deleting all KPI cards...');
  const { count } = await prisma.kpiCard.deleteMany({});
  console.log(`Successfully deleted ${count} KPI cards.`);
}

main()
  .catch((e) => {
    console.error('Error deleting KPI cards:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
