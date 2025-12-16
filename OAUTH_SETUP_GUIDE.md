# 소셜 로그인 등록 가이드

네이버와 구글 소셜 로그인을 설정하기 위한 단계별 가이드입니다.

---

## 📋 목차
1. [NEXTAUTH_SECRET 생성](#1-nextauth_secret-생성)
2. [카카오 OAuth 설정 (기존)](#2-카카오-oauth-설정-기존)
3. [네이버 OAuth 설정](#3-네이버-oauth-설정)
4. [구글 OAuth 설정](#4-구글-oauth-설정)
5. [환경변수 설정](#5-환경변수-설정)

---

## 1. NEXTAUTH_SECRET 생성

터미널에서 다음 명령어를 실행하여 랜덤 비밀키를 생성합니다:

```bash
openssl rand -base64 32
```

또는 온라인 생성기 사용:
https://generate-secret.vercel.app/32

생성된 키를 복사해두세요.

---

## 2. 카카오 OAuth 설정 (기존)

이미 설정되어 있으므로 건너뛰어도 됩니다.

### 설정 확인사항:
- **Redirect URI**: `http://localhost:3000/api/auth/callback/kakao`
- 상품 환경에서는 도메인을 변경해야 합니다.

---

## 3. 네이버 OAuth 설정

### 3-1. 네이버 개발자 센터 접속
https://developers.naver.com/apps/register

### 3-2. 애플리케이션 등록
1. **로그인** (네이버 계정)
2. **Application → 애플리케이션 등록** 클릭
3. 정보 입력:
   - **애플리케이션 이름**: `MAXX Systems` (원하는 이름)
   - **사용 API**: `네이버 로그인` 체크
   - **서비스 환경**: `PC 웹` 선택
   - **서비스 URL**: `http://localhost:3000`
   - **네이버 로그인 Callback URL**:
     ```
     http://localhost:3000/api/auth/callback/naver
     ```
   - **제공 정보 선택**:
     - 회원이름 (필수)
     - 이메일 주소 (필수)
     - 프로필 사진 (선택)

### 3-3. Client ID와 Client Secret 복사
등록 완료 후 **내 애플리케이션** 페이지에서:
- `Client ID` 복사
- `Client Secret` 복사

**⚠️ 주의**: Secret은 절대 공개하지 마세요!

---

## 4. 구글 OAuth 설정

### 4-1. Google Cloud Console 접속
https://console.cloud.google.com/

### 4-2. 프로젝트 생성
1. 상단의 **프로젝트 선택** → **새 프로젝트**
2. 프로젝트 이름: `MAXX Systems` 입력
3. **만들기** 클릭

### 4-3. OAuth 동의 화면 구성
1. 좌측 메뉴: **API 및 서비스** → **OAuth 동의 화면**
2. **User Type**: `외부` 선택 → **만들기**
3. 정보 입력:
   - **앱 이름**: `MAXX Systems`
   - **사용자 지원 이메일**: 본인 이메일
   - **개발자 연락처 정보**: 본인 이메일
4. **저장 후 계속** 클릭
5. **범위** 단계: 그대로 **저장 후 계속**
6. **테스트 사용자** 단계: 본인 구글 계정 추가
7. **요약** 확인 후 **대시보드로 돌아가기**

### 4-4. OAuth 2.0 클라이언트 ID 생성
1. 좌측 메뉴: **API 및 서비스** → **사용자 인증 정보**
2. 상단 **+ 사용자 인증 정보 만들기** → **OAuth 2.0 클라이언트 ID**
3. 정보 입력:
   - **애플리케이션 유형**: `웹 애플리케이션`
   - **이름**: `MAXX Systems Web Client`
   - **승인된 자바스크립트 원본**:
     ```
     http://localhost:3000
     ```
   - **승인된 리디렉션 URI**:
     ```
     http://localhost:3000/api/auth/callback/google
     ```
4. **만들기** 클릭

### 4-5. Client ID와 Client Secret 복사
- `클라이언트 ID` (예: 123456-abc.apps.googleusercontent.com)
- `클라이언트 보안 비밀번호` (예: GOCSPX-xyz123abc)

**⚠️ 주의**: Secret은 절대 공개하지 마세요!

---

## 5. 환경변수 설정

### 5-1. `.env.local` 파일 생성/수정

프로젝트 루트에 `.env.local` 파일을 만들고 다음 내용을 입력합니다:

```bash
# Database (기존 값 유지)
DATABASE_URL="your_existing_database_url"
DATABASE_URL_UNPOOLED="your_existing_database_url_unpooled"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=여기에_1번에서_생성한_비밀키_붙여넣기

# Kakao OAuth (기존 값 유지)
KAKAO_CLIENT_ID=기존_카카오_REST_API_키
KAKAO_CLIENT_SECRET=기존_카카오_시크릿

# Naver OAuth (3번에서 복사한 값)
NAVER_CLIENT_ID=여기에_네이버_Client_ID_붙여넣기
NAVER_CLIENT_SECRET=여기에_네이버_Client_Secret_붙여넣기

# Google OAuth (4번에서 복사한 값)
GOOGLE_CLIENT_ID=여기에_구글_Client_ID_붙여넣기
GOOGLE_CLIENT_SECRET=여기에_구글_Client_Secret_붙여넣기

# TossPayments (기존 값 유지)
TOSS_CLIENT_KEY=기존_토스_클라이언트_키
TOSS_SECRET_KEY=기존_토스_시크릿_키
```

### 5-2. 서버 재시작

환경변수를 변경했으므로 개발 서버를 재시작합니다:

```bash
# 서버 중지: Ctrl + C
# 서버 재시작:
npm run dev
```

---

## ✅ 테스트

1. http://localhost:3000/login 접속
2. 3개의 로그인 버튼이 보입니다:
   - 카카오로 3초만에 시작하기 (노란색)
   - 네이버로 시작하기 (초록색)
   - 구글로 시작하기 (흰색)
3. 각 버튼을 클릭하여 로그인 테스트

---

## 🚀 배포 시 주의사항

프로덕션 환경 (vercel.com 등)에 배포할 때는 Callback URL을 변경해야 합니다:

### 카카오
- Callback URL: `https://your-domain.com/api/auth/callback/kakao`

### 네이버
- Callback URL: `https://your-domain.com/api/auth/callback/naver`

### 구글
- 승인된 리디렉션 URI: `https://your-domain.com/api/auth/callback/google`

### 환경변수
```bash
NEXTAUTH_URL=https://your-domain.com
```

---

## 📞 문제 해결

### 로그인 시 "Callback URL mismatch" 오류
→ Callback URL이 정확히 일치하는지 확인하세요.

### 네이버 로그인 후 "Error: 400" 오류
→ 네이버 개발자 센터에서 제공 정보 설정을 확인하세요.

### 구글 로그인 시 "Access blocked" 오류
→ OAuth 동의 화면의 테스트 사용자에 본인 계정을 추가했는지 확인하세요.

---

## 🎉 완료!

이제 카카오, 네이버, 구글 3가지 방법으로 로그인할 수 있습니다!
