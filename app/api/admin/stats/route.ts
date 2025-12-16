import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 관리자 대시보드 통계 API
export async function GET(request: Request) {
  try {
    // 1. 총 매출 (완료된 주문만)
    const totalRevenue = await prisma.order.aggregate({
      where: {
        status: { in: ['PAID', 'COMPLETED'] },
      },
      _sum: {
        finalAmount: true,
      },
    });

    // 2. 총 주문 수
    const totalOrders = await prisma.order.count();

    // 3. 오늘 주문 수
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = await prisma.order.count({
      where: {
        createdAt: {
          gte: today,
        },
      },
    });

    // 4. 오늘 매출
    const todayRevenue = await prisma.order.aggregate({
      where: {
        status: { in: ['PAID', 'COMPLETED'] },
        createdAt: {
          gte: today,
        },
      },
      _sum: {
        finalAmount: true,
      },
    });

    // 5. 상태별 주문 수
    const ordersByStatus = await prisma.order.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });

    // 6. 최근 주문 10개
    const recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        orderItems: true,
        payment: true,
      },
    });

    // 7. 총 회원 수
    const totalUsers = await prisma.user.count();

    // 8. 월별 매출 (최근 6개월)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await prisma.$queryRaw`
      SELECT
        DATE_TRUNC('month', "createdAt") as month,
        SUM("finalAmount") as revenue,
        COUNT(*) as count
      FROM "Order"
      WHERE "createdAt" >= ${sixMonthsAgo}
        AND status IN ('PAID', 'COMPLETED')
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month DESC
    `;

    return NextResponse.json({
      summary: {
        totalRevenue: totalRevenue._sum.finalAmount || 0,
        totalOrders,
        todayOrders,
        todayRevenue: todayRevenue._sum.finalAmount || 0,
        totalUsers,
      },
      ordersByStatus,
      recentOrders,
      monthlyRevenue,
    });
  } catch (error) {
    console.error('❌ Error fetching admin stats:', error);
    return NextResponse.json(
      { message: 'Failed to fetch admin stats', error: String(error) },
      { status: 500 }
    );
  }
}
