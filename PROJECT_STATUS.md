# 프로젝트 구현 현황

## ✅ 구현 완료된 기능

### 🔐 인증 및 사용자 관리
- [x] 이메일/비밀번호 회원가입
- [x] 이메일/비밀번호 로그인
- [x] OAuth 로그인 (Google, Naver, Kakao)
- [x] 로그아웃
- [x] 세션 관리 (Better-auth)
- [x] 마이페이지 기본 정보 표시
- [x] 사용자 스키마 (emailVerified 필드 포함)

### 📱 Platform 페이지
- [x] 메인 페이지 (Hero Banner + Display Sections)
- [x] 서비스 목록 페이지 (페이지네이션, 필터링 포함)
  - 카테고리 필터 (전체, 프로그래밍, 디자인, 마케팅, 비즈니스, 기타)
  - 검색 기능 (제목/부제목)
  - 페이지네이션 (12개씩)
- [x] 서비스 상세 페이지
  - 서비스 정보 표시
  - 리뷰 목록 표시
  - 결제 다이얼로그
- [x] 로그인 페이지
- [x] 회원가입 페이지
- [x] 마이페이지 (프로필 정보, 구매 내역 링크)

### 🛠️ Admin 대시보드
- [x] Admin 레이아웃 (Sidebar + Header)
- [x] 대시보드 (통계 표시)
  - 총 사용자 수
  - 총 서비스 수
  - 총 리뷰 수
  - 공지사항 수
- [x] 사용자 관리 페이지 (목록 표시)
- [x] 서비스 관리 페이지 (CRUD)
- [x] 리뷰 관리 페이지 (CRUD)
- [x] 디스플레이 관리 페이지 (CRUD)
- [x] 배너 관리 페이지 (CRUD)

### 📊 데이터 관리
- [x] Service (서비스) CRUD
- [x] Review (리뷰) CRUD
- [x] Display (디스플레이) CRUD
- [x] Banner (배너) CRUD
- [x] Display-Service 관계 관리
- [x] 리뷰 통계 계산 (평균 평점, 리뷰 수)
- [x] 시드 데이터 생성 (Service, Review, Display, Banner)

### 🎨 UI/UX
- [x] 반응형 디자인
- [x] ClassCard 컴포넌트
- [x] ClassListSection 컴포넌트
- [x] DisplaySections 컴포넌트
- [x] 검색바 컴포넌트
- [x] TanStack Form 기반 폼 컴포넌트
- [x] 페이지네이션 UI
- [x] 필터 UI
- [x] Platform 모바일 사이드바

---

## 🚧 구현해야 하는 기능

### 🔐 인증 및 사용자 관리 (우선순위: 높음)
- [x] **이메일 중복 체크**
  - 회원가입 시 실시간 이메일 중복 확인
  - API 엔드포인트: `GET /api/auth/check-email?email=...`
  - UI: 이메일 입력 필드에 중복 확인 버튼/실시간 검증

- [x] **이메일 인증번호 발송**
  - 회원가입 시 이메일 인증번호 발송
  - API 엔드포인트: `POST /api/auth/send-verification-code`
  - 이메일 발송 기능 (SMTP 또는 이메일 서비스 연동)
  - 인증번호 저장 (Redis 또는 DB)

- [x] **이메일 인증번호 검증**
  - 발송된 인증번호 확인
  - API 엔드포인트: `POST /api/auth/verify-email-code`
  - 인증 성공 시 `emailVerified` 필드 업데이트
  - 회원가입 플로우에 인증 단계 추가

- [ ] **사용자 추가 정보 입력**
  - 회원가입 후 추가 정보 입력 페이지
  - 필드 예시:
    - 전화번호
    - 생년월일
    - 성별
  - User 스키마 확장 또는 별도 UserProfile 테이블
  - 마이페이지에서 추가 정보 수정 기능

- [ ] **계정 찾기** (`/find-account`)
  - 이메일로 계정 찾기
  - 비밀번호 재설정 기능

### 📱 Platform 페이지 (우선순위: 중간)
- [x] **주문/결제 페이지** (`/order`)
  - 결제 정보 입력
  - 결제 프로세스 연동 (무통장 입금)
  - 주문 생성 기능

- [x] **주문 완료 페이지** (`/order/complete`)
  - 주문 완료 확인
  - 주문 번호 표시
  - 구매 내역 링크

- [x] **구매 내역 페이지** (`/mypage/purchase-history`)
  - 주문 목록 표시
  - 주문 상태 표시
  - 주문 상세 보기

- [x] **구매 내역 상세 페이지** (`/mypage/purchase-history/[id]`)
  - 주문 상세 정보
  - 결제 정보
  - 주문 항목 목록

- [ ] **약관 페이지** (`/terms/[id]`)
  - 이용약관
  - 개인정보처리방침
  - 기타 약관

### 🛠️ Admin 대시보드 (우선순위: 중간)
- [ ] **공지사항 관리** (`/admin/notices`)
  - 공지사항 CRUD
  - 공지사항 스키마 생성
  - 공지사항 목록/상세 페이지

- [x] **설정 페이지** (`/admin/settings`)
  - 결제 계좌 정보 관리
  - 사이트 설정 관리

- [ ] **권한 검증 추가**
  - 모든 Admin API에 권한 검증 추가
  - Admin 레이아웃에 세션 체크 및 admin role 확인
  - 현재 TODO 주석으로 표시됨

### 📊 데이터 관리 (우선순위: 낮음)
- [x] **주문(Order) 스키마 및 CRUD**
  - 주문 정보 저장
  - 주문 상태 관리
  - 결제 정보 연동

### 🔧 기타
- [ ] **로고 교체**
  - 현재 TODO 주석으로 표시됨
  - 실제 로고 이미지로 변경



---

## 📝 참고사항

### 현재 TODO 주석이 있는 위치
- `src/app/api/banners/**` - 권한 검증 추가 필요
- `src/app/api/displays/**` - 권한 검증 추가 필요
- `src/app/admin/(dashboard)/layout.tsx` - 세션 체크 및 권한 검증 추가 필요
- `src/components/reusable/logo.tsx` - 실제 로고로 변경 필요

### 스키마 상태
- User 스키마에 `emailVerified` 필드 존재 (boolean, default: false)
- Verification 테이블 존재 (인증번호 저장용으로 활용 가능)

### 인증 플로우
현재 회원가입 플로우:
1. 이름, 이메일, 비밀번호 입력
2. 이메일 중복 체크 (실시간)
3. 이메일 인증번호 발송
4. 인증번호 입력 및 검증
5. 가입 완료

추가 구현 필요:
- 추가 정보 입력 (전화번호, 생년월일, 성별)

