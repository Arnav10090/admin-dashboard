import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Fetch user preferences by userId (from query param)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    const prefs = await prisma.userPreference.findUnique({ where: { userId } });
    return NextResponse.json(prefs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user preferences.' }, { status: 500 });
  }
}

// POST: Set or update user preferences
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const prefs = await prisma.userPreference.upsert({
      where: { userId: data.userId },
      update: { layout: data.layout, cardOrder: data.cardOrder },
      create: { userId: data.userId, layout: data.layout, cardOrder: data.cardOrder },
    });
    return NextResponse.json(prefs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to set user preferences.' }, { status: 500 });
  }
} 