import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    console.log('=== Starting to fetch available KPI cards ===');
    
    // Get the displayed card IDs from query parameters
    const searchParams = request.nextUrl.searchParams;
    const displayedCardIds = searchParams.get('displayedCardIds')?.split(',').filter(Boolean) || [];
    console.log('1. Displayed card IDs from query params:', displayedCardIds);
    
    // Get all hidden cards (isVisible: false)
    console.log('2. Fetching all hidden cards...');
    const hiddenCards = await prisma.kpiCard.findMany({
      where: {
        isVisible: false,
      },
      select: {
        id: true,
        name: true,
        isVisible: true,
      },
    });
    console.log('3. Hidden cards in the database:', hiddenCards.map(c => ({
      id: c.id,
      name: c.name,
      isVisible: c.isVisible
    })));
    
    // Find all visible cards that are currently displayed on the dashboard
    console.log('4. Fetching currently visible cards...');
    const visibleCards = await prisma.kpiCard.findMany({
      where: {
        isVisible: true,
      },
      select: {
        id: true,
        name: true,
      },
    });
    console.log('5. Currently visible cards:', visibleCards);
    
    // Combine the displayed card IDs from both sources
    const allDisplayedCardIds = [
      ...displayedCardIds,
      ...visibleCards.map(card => card.id)
    ].filter((id, index, self) => id && self.indexOf(id) === index);
    
    console.log('6. All displayed card IDs (combined):', allDisplayedCardIds);
    
    // Filter out the displayed cards from the hidden cards
    const availableCards = hiddenCards
      .filter(card => !allDisplayedCardIds.includes(card.id))
      .map(card => ({
        id: card.id,
        name: card.name,
        // Include other necessary fields with default values
        minValue: 0,
        maxValue: 100,
        benchmark: 50,
        timeFrame: 'day',
        order: 0,
        isVisible: card.isVisible
      }));
    
    console.log('7. Available cards after filtering:', availableCards);
    console.log('=== Finished fetching available KPI cards ===\n');
    
    return NextResponse.json(availableCards);
  } catch (error) {
    console.error('Error fetching available KPI cards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch available KPI cards.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
