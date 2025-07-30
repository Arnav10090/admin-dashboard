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
    isVisible: false
  },
  {
    name: 'OEE (Overall Equipment Effectiveness)',
    minValue: 0,
    maxValue: 100,
    benchmark: 85,
    achieved: 82.5,
    order: 5,
    timeFrame: 'day',
    isDefault: false,
    isVisible: false
  },
  {
    name: 'Downtime %',
    minValue: 0,
    maxValue: 100,
    benchmark: 5,
    achieved: 4.2,
    order: 6,
    timeFrame: 'shift',
    isDefault: false,
    isVisible: false
  },
  {
    name: 'Maintenance Response Time',
    minValue: 0,
    maxValue: 120,
    benchmark: 30,
    achieved: 25,
    order: 7,
    timeFrame: 'hour',
    isDefault: false,
    isVisible: false
  },
  {
    name: 'Safety Incidents',
    minValue: 0,
    maxValue: 10,
    benchmark: 0,
    achieved: 0,
    order: 8,
    timeFrame: 'month',
    isDefault: false,
    isVisible: false
  },
];

async function main() {
  console.log('Seeding additional predefined KPI cards...');
  
  // Get all existing card names to avoid duplicates
  const existingCards = await prisma.kpiCard.findMany();
  const existingCardMap = new Map(existingCards.map(card => [card.name, card]));
  
  let createdCount = 0;
  let updatedCount = 0;
  
  // Process all predefined cards
  for (const cardData of predefinedCards) {
    if (existingCardMap.has(cardData.name)) {
      // Update existing card to ensure it has the latest fields
      await prisma.kpiCard.updateMany({
        where: { name: cardData.name },
        data: {
          ...cardData,
          date: new Date(),
          isVisible: true // Ensure isVisible is set to true for existing cards
        },
      });
      updatedCount++;
      console.log(`Updated existing card: ${cardData.name}`);
    } else {
      // Create new card
      await prisma.kpiCard.create({
        data: {
          ...cardData,
          date: new Date(),
          isVisible: true
        },
      });
      createdCount++;
      console.log(`Added new card: ${cardData.name}`);
    }
  }
  
  if (createdCount === 0 && updatedCount === 0) {
    console.log('No changes needed - all cards are up to date.');
    return;
  }
  
  console.log('Successfully seeded predefined KPI cards');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
