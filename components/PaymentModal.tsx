// /components/PaymentModal.tsx

"use client";

import React, { useEffect, useState } from "react";
import styles from "./PaymentModal.module.css";

// 1. 결제 수단 타입에 'KAKAOPAY'를 추가합니다.
type PaymentMethod = "KAKAOPAY" | "NAVERPAY";

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
  onPay?: (item: PaymentItem, method: PaymentMethod) => void;
};

export default function PaymentModal({ open, onClose, item, onPay }: Props) {
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

  const handlePayClick = () => {
    if (!selectedMethod) {
      alert("결제수단을 선택해주세요.");
      return;
    }
    if (onPay) {
      onPay(item, selectedMethod);
    } else {
      alert(`[테스트] ${selectedMethod}로 ${item.priceLabel} 결제를 진행합니다.`);
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
              <div className={styles.payMethods}>
                {/* 3. '카드결제' 버튼을 '카카오페이'로 변경합니다. */}
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
