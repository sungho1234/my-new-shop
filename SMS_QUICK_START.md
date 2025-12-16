# NHN Cloud SMS 5분 설정 가이드

## 1. NHN Cloud 가입 (1분)

1. [NHN Cloud 콘솔](https://console.nhncloud.com/) 접속
2. 회원가입 (카카오, 네이버 계정으로 가능)
3. 로그인 후 프로젝트 생성 (이름: `my-shop-sms`)

## 2. SMS 서비스 활성화 (1분)

1. 좌측 메뉴 **Notification > SMS** 클릭
2. **서비스 활성화** 버튼 클릭

## 3. 발신번호 등록 (2분)

1. **발신번호 관리** 탭 클릭
2. **발신번호 등록** 클릭
3. **본인 휴대폰 번호** 입력 (예: `010-1234-5678`)
4. SMS로 받은 인증번호 입력
5. 등록 완료 ✅ (즉시 사용 가능)

## 4. API 키 발급 (1분)

### AppKey 복사
1. SMS 콘솔 상단의 **URL & Appkey** 클릭
2. **Appkey** 복사 (예: `abc123def456...`)

### SecretKey 생성
1. 우측 상단 프로필 아이콘 클릭
2. **API 보안 설정** 선택
3. **SecretKey 만들기** 클릭
4. SecretKey 복사 (⚠️ 한 번만 표시되므로 메모장에 저장!)

## 5. 환경변수 설정

`.env.local` 파일에 다음 3줄 추가:

```env
NHN_SMS_APP_KEY=여기에_AppKey_붙여넣기
NHN_SMS_SECRET_KEY=여기에_SecretKey_붙여넣기
NHN_SMS_SENDER_NUMBER=01012345678
```

### 예시:
```env
NHN_SMS_APP_KEY=aBcD1234EfGh5678
NHN_SMS_SECRET_KEY=xYzW9876VuTs4321
NHN_SMS_SENDER_NUMBER=01012345678
```

> ⚠️ **주의**: `NHN_SMS_SENDER_NUMBER`는 **하이픈 없이** 숫자만 입력!

## 6. 서버 재시작

```bash
# 서버 종료 후 다시 실행
npm run dev
```

## 7. 테스트

1. 네이버 또는 구글로 로그인
2. 전화번호 입력 → **인증요청**
3. **실제 SMS 수신 확인** 📱
4. 인증 코드 입력 → **확인**

---

## 비용

- **가입비/월 사용료**: 무료
- **SMS 발송**: 8원/건
- **10,000원 충전** → 약 1,250건 발송 가능

### 충전 방법:
1. 콘솔 우측 상단 **충전** 클릭
2. 10,000원 선택
3. 카드 결제

---

## 문제 해결

### Q. SMS가 안 와요
- 발신번호 상태 확인: SMS 콘솔 > 발신번호 관리
- 잔액 확인: 콘솔 우측 상단
- 환경변수 확인: `.env.local` 파일 확인
- 서버 재시작: `Ctrl+C` 후 `npm run dev`

### Q. 개발 모드로 테스트하고 싶어요
`.env.local`에서 NHN 관련 3줄을 주석 처리:
```env
# NHN_SMS_APP_KEY=...
# NHN_SMS_SECRET_KEY=...
# NHN_SMS_SENDER_NUMBER=...
```
→ 콘솔에 인증 코드 출력됨

---

**더 자세한 내용은 [SMS_SETUP_GUIDE.md](./SMS_SETUP_GUIDE.md) 참고**
