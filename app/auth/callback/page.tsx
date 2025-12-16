'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (session?.user) {
      // @ts-ignore - isProfileComplete는 session callback에서 추가한 필드
      const isProfileComplete = session.user.isProfileComplete;

      if (isProfileComplete === false) {
        // 프로필 미완성 -> 추가 정보 입력 페이지로
        router.push('/signup/complete');
      } else {
        // 프로필 완성 -> 메인 페이지로
        router.push('/');
      }
    }
  }, [session, status, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">로그인 처리 중...</p>
      </div>
    </div>
  );
}
