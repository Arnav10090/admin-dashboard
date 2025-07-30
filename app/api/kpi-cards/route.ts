import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Fetch all visible KPI cards
export async function GET() {
  try {
    const cards = await prisma.kpiCard.findMany({
      where: {
        isVisible: true
      },
      orderBy: { 
        order: 'asc' 
      }
    });
    
    return NextResponse.json(cards);
  } catch (error) {
    console.error('Error fetching KPI cards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch KPI cards.' }, 
      { status: 500 }
    );
  }
}

// POST: Create a new KPI card
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Check if this is a default card being added
    if (data.isDefault) {
      // For default cards, check if one with the same name already exists
      const existingCard = await prisma.kpiCard.findFirst({
        where: {
          name: data.name,
          isDefault: true
        }
      });
      
      if (existingCard) {
        // If a default card with this name exists, update its visibility instead of creating a new one
        const updatedCard = await prisma.kpiCard.update({
          where: { id: existingCard.id },
          data: { isVisible: true }
        });
        return NextResponse.json(updatedCard);
      }
    }
    
    // Create the new card
    const card = await prisma.kpiCard.create({
      data: {
        name: data.name,
        minValue: data.minValue ?? 0,
        maxValue: data.maxValue ?? 100,
        benchmark: data.benchmark ?? 0,
        achieved: data.achieved ?? null,
        date: data.date ? new Date(data.date) : new Date(), // Default to current date if not provided
        order: data.order ?? 0, // Default order to 0 if not provided
        isDefault: data.isDefault ?? false,
        isVisible: true // Ensure new cards are visible by default
      },
    });

    // If this is a coils/hr card, create or update the corresponding tons/hr card
    if (card.name.toLowerCase().includes('coils/hr')) {
      const tonsCardName = card.name.replace('Coils', 'Tons');
      const multiplier = 10; // 1 coil = 10 tons
      
      // Check if tons card already exists
      const allCards = await prisma.kpiCard.findMany();
      const existingTonsCard = allCards.find(c => 
        c.name.toLowerCase() === tonsCardName.toLowerCase()
      );

      if (existingTonsCard) {
        // Update existing tons card
        await prisma.kpiCard.update({
          where: { id: existingTonsCard.id },
          data: {
            benchmark: (data.benchmark ?? 0) * multiplier,
            achieved: data.achieved ? data.achieved * multiplier : null,
            minValue: (data.minValue ?? 0) * multiplier,
            maxValue: (data.maxValue ?? 100) * multiplier,
            isVisible: true
          },
        });
      } else {
        // Create new tons card
        await prisma.kpiCard.create({
          data: {
            name: tonsCardName,
            minValue: (data.minValue ?? 0) * multiplier,
            maxValue: (data.maxValue ?? 100) * multiplier,
            benchmark: (data.benchmark ?? 0) * multiplier,
            achieved: data.achieved ? data.achieved * multiplier : null,
            date: data.date ? new Date(data.date) : new Date(),
            order: (data.order ?? 0) + 1, // Place it after the coils card
            isDefault: data.isDefault ?? false,
            isVisible: true
          },
        });
      }
      
      console.log(`Created/updated ${tonsCardName} based on ${card.name}`);
    }
    
    console.log('Created new KPI card:', card);
    return NextResponse.json(card, { status: 201 });
  } catch (error) {
    console.error('Error creating KPI card:', error);
    return NextResponse.json(
      { error: 'Failed to create KPI card: ' + (error as Error).message }, 
      { status: 500 }
    );
  }
}

// PUT and DELETE handlers can be implemented in dynamic routes (e.g., /api/kpi-cards/[id]/route.ts)