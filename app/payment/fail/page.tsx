'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function PaymentFailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get('message') || '결제에 실패했습니다.';

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">❌</div>
        <h1 className="text-2xl font-bold mb-2">결제 실패</h1>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          메인으로 돌아가기
        </button>
      </div>
    </div>
  );
}
