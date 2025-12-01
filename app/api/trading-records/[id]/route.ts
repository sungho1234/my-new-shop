import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// PUT: 특정 거래 기록 수정
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    const {
      symbol,
      entryDateTime,
      exitDateTime,
      positionDirection,
      leverage,
      positionSize,
      entryPrice,
      exitPrice,
      pnl,
      roi,
      roundTripFee,
      entryReason,
      exitReason,
      entryEmotion,
      exitEmotion,
      lessonLearned,
    } = body;

    // 거래 기록 업데이트
    const updatedRecord = await prisma.tradingRecord.update({
      where: { id },
      data: {
        symbol,
        entryDateTime,
        exitDateTime,
        positionDirection,
        leverage,
        positionSize,
        entryPrice,
        exitPrice,
        pnl,
        roi,
        roundTripFee,
        entryReason,
        exitReason,
        entryEmotion,
        exitEmotion,
        lessonLearned,
      },
    });

    return NextResponse.json(updatedRecord, { status: 200 });
  } catch (error) {
    console.error(`PUT /api/trading-records/${params.id} Error:`, error);
    return NextResponse.json({ error: 'Failed to update trading record' }, { status: 500 });
  }
}

// DELETE: 특정 거래 기록 삭제
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // 거래 기록 삭제
    await prisma.tradingRecord.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Trading record deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`DELETE /api/trading-records/${params.id} Error:`, error);
    return NextResponse.json({ error: 'Failed to delete trading record' }, { status: 500 });
  }
}
