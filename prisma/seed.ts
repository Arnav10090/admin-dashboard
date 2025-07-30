import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const predefinedCards = [
  // Default cards (will be shown by default)
  {
    name: 'Coils/HR',
    minValue: 0,
    maxValue: 100,
    benchmark: 80,
    achieved: 75,
    order: 1,
    isDefault: true,
    isVisible: true
  },
  {
    name: 'Tons/HR',
    minValue: 0,
    maxValue: 200,
    benchmark: 180,
    achieved: 175,
    order: 2,
    isDefault: true,
    isVisible: true
  },
  {
    name: 'Coils Shipped/HR',
    minValue: 0,
    maxValue: 80,
    benchmark: 70,
    achieved: 68,
    order: 3,
    isDefault: true,
    isVisible: true
  },
  // Additional cards (can be added by users)
  {
    name: 'Scrap Rate',
    minValue: 0,
    maxValue: 20,
    benchmark: 2,
    achieved: 1.8,
    order: 4,
    isDefault: false,
    isVisible: true
  },
  {
    name: 'OEE (Overall Equipment Effectiveness)',
    minValue: 0,
    maxValue: 100,
    benchmark: 85,
    achieved: 82.5,
    order: 5,
    isDefault: false,
    isVisible: true
  },
  {
    name: 'Downtime %',
    minValue: 0,
    maxValue: 100,
    benchmark: 5,
    achieved: 4.2,
    order: 6,
    isDefault: false,
    isVisible: true
  },
  {
    name: 'Maintenance Response Time',
    minValue: 0,
    maxValue: 120,
    benchmark: 30,
    achieved: 25,
    order: 7,
    isDefault: false,
    isVisible: true
  },
  {
    name: 'Safety Incidents',
    minValue: 0,
    maxValue: 10,
    benchmark: 0,
    achieved: 0,
    order: 8,
    isDefault: false,
    isVisible: true
  },
];

async function main() {
  console.log('Seeding KPI cards...');
  
  // Process all predefined cards directly without checking for duplicates
  for (const cardData of predefinedCards) {
    try {
      await prisma.kpiCard.create({
        data: {
          ...cardData,
          date: new Date(),
        },
      });
      console.log(`Added card: ${cardData.name}`);
    } catch (error) {
      console.error(`Error adding card ${cardData.name}:`, error);
    }
  }
  
  console.log('Successfully seeded KPI cards');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
