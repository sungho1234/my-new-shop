// /components/PaymentModal.tsx

"use client";

import React, { useEffect, useState } from "react";
import styles from "./PaymentModal.module.css";

// 1. 결제 수단 타입 (카카오페이, 네이버페이, 그 외 페이)
type PaymentMethod = "KAKAOPAY" | "NAVERPAY" | "OTHERPAY";

export type PaymentItem = {
  title: string;
  subtitle?: string;
  priceLabel: string;
  priceValue: number;
  thumbnail?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  item: PaymentItem;
  productId: string; // 실제 상품 ID (예: 'first-guide', 'system-builder')
  onPay?: (item: PaymentItem, method: PaymentMethod) => void;
};

export default function PaymentModal({ open, onClose, item, productId, onPay }: Props) {
  // 2. 처음 선택되는 기본값을 'KAKAOPAY'로 설정합니다.
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("KAKAOPAY");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const handlePayClick = async () => {
    if (!selectedMethod) {
      alert("결제수단을 선택해주세요.");
      return;
    }

    // 커스텀 onPay 함수가 있으면 사용
    if (onPay) {
      onPay(item, selectedMethod);
      return;
    }

    // 기본 결제 로직
    try {
      // 1. 로그인 확인
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        alert('로그인이 필요합니다.');
        return;
      }
      const user = JSON.parse(userStr);

      // 2. 주문 생성 (실제 API 호출)
      const orderBody: any = { productId };

      // NextAuth 로그인 (네이버/구글)이면 userId, 카카오면 kakaoId 전달
      if (user.dbId) {
        orderBody.userId = user.dbId;
      } else {
        orderBody.kakaoId = user.id;
      }

      const orderResponse = await fetch('/api/order/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderBody),
      });

      if (!orderResponse.ok) {
        throw new Error('주문 생성 실패');
      }

      const { order } = await orderResponse.json();

      // 3. 토스페이먼츠 결제
      const { loadTossPayments } = await import('@tosspayments/payment-sdk');
      const CLIENT_KEY = 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq'; // 테스트 키
      const tossPayments = await loadTossPayments(CLIENT_KEY);

      // 결제 수단에 따라 다른 결제 방법 호출
      let paymentMethod = '카드'; // 기본값 (그 외 결제 = KG이니시스 카드결제)

      console.log('🔔 선택한 결제 수단:', selectedMethod);

      const paymentOptions: any = {
        amount: order.finalAmount,
        orderId: order.id,
        orderName: item.title,
        customerName: '구매자',
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      };

      if (selectedMethod === 'KAKAOPAY') {
        // 카카오페이 - 바로 카카오페이 결제창 열기
        paymentMethod = '간편결제';
        paymentOptions.easyPay = '카카오페이';
        paymentOptions.flowMode = 'DIRECT'; // 바로 카카오페이로 이동
        console.log('→ 카카오페이 직접 연결');
      } else if (selectedMethod === 'NAVERPAY') {
        // 네이버페이 - 바로 네이버페이 결제창 열기
        paymentMethod = '간편결제';
        paymentOptions.easyPay = '네이버페이';
        paymentOptions.flowMode = 'DIRECT'; // 바로 네이버페이로 이동
        console.log('→ 네이버페이 직접 연결');
      } else if (selectedMethod === 'OTHERPAY') {
        // 그 외 결제 - KG이니시스 카드결제
        paymentMethod = '카드';
        console.log('→ 카드 결제');
      }

      await tossPayments.requestPayment(paymentMethod, paymentOptions);

    } catch (error) {
      console.error('결제 오류:', error);
      alert('결제 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <header className={styles.header}>
          <h3>주문/결제</h3>
          <button className={styles.closeBtn} onClick={onClose} aria-label="닫기">×</button>
        </header>
        <div className={styles.body}>
          <section className={styles.left}>
            <div className={styles.productCard}>
              {item.thumbnail && <img src={item.thumbnail} alt={item.title} className={styles.thumb} />}
              <div className={styles.productMeta}>
                <strong className={styles.productTitle}>{item.title}</strong>
                {item.subtitle && <span className={styles.productSub}>{item.subtitle}</span>}
              </div>
            </div>
            <div className={styles.optionBox}>
                <label className={styles.optionLabel}>선택 옵션</label>
                <div className={styles.optionRow}>
                    <span>기본 상품</span>
                    <span className={styles.optionPrice}>{item.priceLabel}</span>
                </div>
            </div>
            <div className={styles.couponBox}>
                <label className={styles.optionLabel}>쿠폰</label>
                <select className={styles.select} defaultValue="">
                    <option value="" disabled>사용 가능한 쿠폰이 없습니다</option>
                </select>
            </div>
            <div className={styles.addonsBox}>
                <label className={styles.optionLabel}>추가 구매상품</label>
                <div className={styles.addonsGrid}>
                    <div className={styles.addonCard}>
                        <div className={styles.addonThumb} />
                        <div className={styles.addonMeta}>추후 제공 예정</div>
                    </div>
                </div>
            </div>
          </section>

          <aside className={styles.right}>
            <div className={styles.summary}>
              <div className={styles.summaryRow}>
                <span>총 상품 금액</span>
                <strong>{item.priceLabel}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>할인 금액</span>
                <strong>0원</strong>
              </div>
              <div className={styles.divider} />
              <div className={styles.totalRow}>
                <span>최종 결제 금액</span>
                <strong className={styles.totalPrice}>{item.priceLabel}</strong>
              </div>
            </div>
            <div className={styles.paySection}>
              <label className={styles.payLabel}>결제수단</label>

              {/* 카카오페이, 네이버페이 (위쪽 줄) */}
              <div className={styles.payMethods}>
                <button
                  className={`${styles.payBtnOutline} ${selectedMethod === 'KAKAOPAY' ? styles.payBtnOutlineSelected : ''}`}
                  onClick={() => setSelectedMethod('KAKAOPAY')}
                >
                  카카오페이
                </button>

                <button
                  className={`${styles.payBtnOutline} ${selectedMethod === 'NAVERPAY' ? styles.payBtnOutlineSelected : ''}`}
                  onClick={() => setSelectedMethod('NAVERPAY')}
                >
                  네이버페이
                </button>
              </div>

              {/* 그 외 결제 (아래쪽, 위쪽 2개 버튼 합친 너비) */}
              <div style={{ marginTop: '0' }}>
                <button
                  className={`${styles.payBtnOutline} ${selectedMethod === 'OTHERPAY' ? styles.payBtnOutlineSelected : ''}`}
                  onClick={() => setSelectedMethod('OTHERPAY')}
                  style={{ width: '100%' }}
                >
                  그 외 결제
                </button>
              </div>
              <button className={styles.primaryBtn} onClick={handlePayClick}>
                결제하기
              </button>
              <p className={styles.notice}>
                구매하는 순간, 위 내용에 동의하는 것으로 간주합니다.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
