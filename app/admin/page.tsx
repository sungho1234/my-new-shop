'use client';

import { useEffect, useState } from 'react';

interface AdminStats {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    todayOrders: number;
    todayRevenue: number;
    totalUsers: number;
  };
  ordersByStatus: Array<{
    status: string;
    _count: { status: number };
  }>;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    status: string;
    finalAmount: number;
    createdAt: string;
    user: { name: string | null; email: string | null };
    orderItems: Array<{ productName: string }>;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('통계 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) {
    return <div className="text-center text-gray-600">데이터를 불러올 수 없습니다.</div>;
  }

  const statusKorean: { [key: string]: string } = {
    PENDING: '대기',
    PAID: '결제완료',
    COMPLETED: '완료',
    CANCELLED: '취소',
    REFUNDED: '환불',
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">대시보드</h1>
          <p className="mt-2 text-sm text-gray-700">
            전체 주문 및 매출 현황을 확인하세요
          </p>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  총 매출
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {stats.summary.totalRevenue.toLocaleString()}원
                </dd>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  총 주문
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {stats.summary.totalOrders}건
                </dd>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  오늘 주문
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {stats.summary.todayOrders}건
                </dd>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  오늘 매출
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {stats.summary.todayRevenue.toLocaleString()}원
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 상태별 주문 */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">주문 상태</h2>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {stats.ordersByStatus.map((item) => (
              <div key={item.status} className="text-center">
                <p className="text-sm text-gray-500">{statusKorean[item.status] || item.status}</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {item._count.status}건
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 최근 주문 */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">최근 주문</h2>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  주문번호
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  고객
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상품
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  금액
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  주문일시
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.user.name || order.user.email || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.orderItems[0]?.productName || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.finalAmount.toLocaleString()}원
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'PAID'
                        ? 'bg-blue-100 text-blue-800'
                        : order.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {statusKorean[order.status] || order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString('ko-KR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
