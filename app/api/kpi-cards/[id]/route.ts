import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Fetch a single KPI card by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const card = await prisma.kpiCard.findUnique({
      where: { id: params.id },
    });
    if (!card) return NextResponse.json({ error: 'KPI card not found.' }, { status: 404 });
    return NextResponse.json(card);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch KPI card.' }, { status: 500 });
  }
}

// PATCH: Update a KPI card's visibility by ID
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();
    
    // First, check if the card exists
    const card = await prisma.kpiCard.findUnique({
      where: { id: params.id },
    });

    if (!card) {
      return NextResponse.json(
        { error: 'KPI card not found.' }, 
        { status: 404 }
      );
    }

    // Update only the isVisible field
    const updatedCard = await prisma.kpiCard.update({
      where: { id: params.id },
      data: {
        isVisible: data.isVisible !== undefined ? data.isVisible : card.isVisible,
      },
    });

    return NextResponse.json(updatedCard);
  } catch (error) {
    console.error('Error updating KPI card visibility:', error);
    return NextResponse.json(
      { error: 'Failed to update KPI card visibility.' }, 
      { status: 500 }
    );
  }
}

// PUT: Update a KPI card by ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();
    
    // First, get the current card to preserve existing values
    const currentCard = await prisma.kpiCard.findUnique({
      where: { id: params.id },
    });

    if (!currentCard) {
      return NextResponse.json(
        { error: 'KPI card not found.' }, 
        { status: 404 }
      );
    }

    // Only update fields that are provided in the request
    const updateData: {
      name?: string;
      minValue?: number;
      maxValue?: number;
      benchmark?: number;
      achieved?: number | null;
      date?: string;
      order?: number;
      isDefault?: boolean;
      isVisible?: boolean;
    } = {};

    // Update only the fields that were provided in the request
    if (data.name) updateData.name = data.name;
    if (data.minValue !== undefined) updateData.minValue = data.minValue;
    if (data.maxValue !== undefined) updateData.maxValue = data.maxValue;
    if (data.benchmark !== undefined) updateData.benchmark = data.benchmark;
    if (data.achieved !== undefined) updateData.achieved = data.achieved;
    if (data.date) updateData.date = data.date;
    if (data.order !== undefined) updateData.order = data.order;
    if (data.isDefault !== undefined) updateData.isDefault = data.isDefault;
    if (data.isVisible !== undefined) updateData.isVisible = data.isVisible;

    // Update the card
    const card = await prisma.kpiCard.update({
      where: { id: params.id },
      data: updateData,
    });

    // Handle bidirectional updates between coils/hr and tons/hr cards
    const isCoilsCard = card.name.toLowerCase().includes('coils/hr');
    const isTonsCard = card.name.toLowerCase().includes('tons/hr');
    
    if (isCoilsCard) {
      // Update corresponding tons/hr card when coils/hr card is updated
      const tonsCardName = card.name.replace('Coils', 'Tons');
      const allCards = await prisma.kpiCard.findMany();
      const tonsCard = allCards.find(c => 
        c.name.toLowerCase().includes('tons/hr')
      );

      if (tonsCard) {
        // Calculate the new values (10x the coils/hr values)
        const multiplier = 10; // 1 coil = 10 tons
        const updatedTonsCard = await prisma.kpiCard.update({
          where: { id: tonsCard.id },
          data: {
            benchmark: data.benchmark !== undefined ? data.benchmark * multiplier : undefined,
            achieved: data.achieved !== undefined ? (data.achieved ? data.achieved * multiplier : null) : undefined,
            minValue: data.minValue !== undefined ? data.minValue * multiplier : undefined,
            maxValue: data.maxValue !== undefined ? data.maxValue * multiplier : undefined,
          },
        });
        
        console.log(`Updated ${tonsCardName} based on ${card.name} changes`);
      }
    } else if (isTonsCard) {
      // Update corresponding coils/hr card when tons/hr card is updated
      const coilsCardName = card.name.replace('Tons', 'Coils');
      const allCards = await prisma.kpiCard.findMany();
      const coilsCard = allCards.find(c => 
        c.name.toLowerCase().includes('coils/hr')
      );

      if (coilsCard) {
        // Calculate the new values (1/10th of the tons/hr values)
        const divisor = 10; // 10 tons = 1 coil
        const updatedCoilsCard = await prisma.kpiCard.update({
          where: { id: coilsCard.id },
          data: {
            benchmark: data.benchmark !== undefined ? Math.round((data.benchmark / divisor) * 100) / 100 : undefined,
            achieved: data.achieved !== undefined ? (data.achieved ? Math.round((data.achieved / divisor) * 100) / 100 : null) : undefined,
            minValue: data.minValue !== undefined ? Math.round((data.minValue / divisor) * 100) / 100 : undefined,
            maxValue: data.maxValue !== undefined ? Math.round((data.maxValue / divisor) * 100) / 100 : undefined,
          },
        });
        
        console.log(`Updated ${coilsCardName} based on ${card.name} changes`);
      }
    }

    return NextResponse.json(card);
  } catch (error) {
    console.error('Error updating KPI card:', error);
    return NextResponse.json(
      { error: 'Failed to update KPI card.' }, 
      { status: 500 }
    );
  }
}

// DELETE: Hide a KPI card from the dashboard (soft delete)
export async function DELETE(
  req: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    // First check if the card exists
    const card = await prisma.kpiCard.findUnique({
      where: { id: params.id },
    });
    
    if (!card) {
      return NextResponse.json(
        { error: 'KPI card not found.' }, 
        { status: 404 }
      );
    }
    
    // Update the card to hide it from the dashboard
    await prisma.kpiCard.update({ 
      where: { id: params.id },
      data: { isVisible: false }
    });
    
    return NextResponse.json({ 
      message: 'KPI card hidden from dashboard successfully.' 
    });
  } catch (error) {
    console.error('Error hiding KPI card:', error);
    return NextResponse.json(
      { error: 'Failed to hide KPI card.' }, 
      { status: 500 }
    );
  }
}