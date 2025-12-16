/**
 * SMS 인증 코드 임시 저장소 (메모리 기반)
 * 프로덕션에서는 Redis 사용 권장
 */

interface VerificationCode {
  code: string;
  expiresAt: number;
  attempts: number; // 인증 시도 횟수
}

class SMSStore {
  private store: Map<string, VerificationCode> = new Map();
  private readonly MAX_ATTEMPTS = 5; // 최대 5번 시도
  private readonly EXPIRY_TIME = 5 * 60 * 1000; // 5분

  /**
   * 인증 코드 저장
   */
  set(phone: string, code: string): void {
    this.store.set(phone, {
      code,
      expiresAt: Date.now() + this.EXPIRY_TIME,
      attempts: 0,
    });
  }

  /**
   * 인증 코드 확인
   */
  verify(phone: string, code: string): { success: boolean; message: string } {
    const data = this.store.get(phone);

    if (!data) {
      return { success: false, message: '인증 코드가 존재하지 않습니다. 다시 요청해주세요.' };
    }

    // 만료 체크
    if (Date.now() > data.expiresAt) {
      this.store.delete(phone);
      return { success: false, message: '인증 코드가 만료되었습니다. 다시 요청해주세요.' };
    }

    // 시도 횟수 체크
    if (data.attempts >= this.MAX_ATTEMPTS) {
      this.store.delete(phone);
      return { success: false, message: '인증 시도 횟수를 초과했습니다. 다시 요청해주세요.' };
    }

    // 인증 코드 확인
    if (data.code !== code) {
      data.attempts += 1;
      return {
        success: false,
        message: `인증 코드가 일치하지 않습니다. (${data.attempts}/${this.MAX_ATTEMPTS})`
      };
    }

    // 인증 성공 - 저장소에서 제거
    this.store.delete(phone);
    return { success: true, message: '인증이 완료되었습니다.' };
  }

  /**
   * 인증 코드 삭제
   */
  delete(phone: string): void {
    this.store.delete(phone);
  }

  /**
   * 만료된 코드 정리 (주기적으로 실행)
   */
  cleanup(): void {
    const now = Date.now();
    for (const [phone, data] of this.store.entries()) {
      if (now > data.expiresAt) {
        this.store.delete(phone);
      }
    }
  }
}

// 싱글톤 인스턴스
export const smsStore = new SMSStore();

// 5분마다 만료된 코드 정리
if (typeof window === 'undefined') {
  setInterval(() => {
    smsStore.cleanup();
  }, 5 * 60 * 1000);
}
