import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Calculate and return the yield for a specific KPI card
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    // Fetch the card and its latest value
    const card = await prisma.kpiCard.findUnique({
      where: { id },
    });
    if (!card) return NextResponse.json({ error: 'KPI card not found.' }, { status: 404 });
    if (card.achieved == null || card.benchmark == null) {
      return NextResponse.json({ error: 'Insufficient data for yield calculation.' }, { status: 400 });
    }
    const achieved = card.achieved;
    const yieldPercent = ((achieved - card.benchmark) / card.benchmark) * 100;
    return NextResponse.json({
      cardId: card.id,
      cardName: card.name,
      achieved,
      benchmark: card.benchmark,
      yieldPercent,
    });
  } catch (error) {
    console.error('Failed to calculate yield:', error);
    return NextResponse.json({ error: 'Failed to calculate yield.' }, { status: 500 });
  }
} 