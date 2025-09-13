import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import TypingTest from '@/lib/models/TypingTest';
import { getUserIdFromToken } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const userId = await getUserIdFromToken(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { wpm, accuracy, time } = await request.json();
    
    const testResult = await TypingTest.create({
      userId,
      wpm,
      accuracy,
      time,
    });

    return NextResponse.json(
      { message: 'Result saved successfully', result: testResult },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const userId = await getUserIdFromToken(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const results = await TypingTest.find({ userId }).sort({ createdAt: -1 });
    
    return NextResponse.json(
      { results },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}