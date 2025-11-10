import { db } from "@/infrastructure/db/drizzle";
import { service } from "@/infrastructure/db/schema";

// Unsplash 이미지 URL (강의/교육 관련 이미지)
const serviceData = [
  {
    title: "처음 시작하는 Python 프로그래밍",
    subtitle: "기초부터 실전까지, 파이썬 완벽 마스터",
    category: "programming",
    tutorInfo: "김철수 | 10년차 풀스택 개발자 | 전 네이버 시니어 개발자",
    coverImageUrl:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&h=600&fit=crop",
    description: `<h2>강의 소개</h2><p>프로그래밍을 처음 시작하는 분들을 위한 파이썬 기초 강의입니다. 변수, 함수, 조건문부터 시작해서 객체지향 프로그래밍까지 단계별로 학습합니다.</p><h3>수강 대상</h3><ul><li>프로그래밍을 처음 배우는 분</li><li>파이썬 기초를 다지고 싶은 분</li><li>데이터 분석, AI 개발을 위한 기초를 쌓고 싶은 분</li></ul>`,
    price: 89000,
    salePrice: 69000,
  },
  {
    title: "실전 UI/UX 디자인 with Figma",
    subtitle: "사용자 중심의 디자인 사고방식 익히기",
    category: "design",
    tutorInfo: "박영희 | 7년차 프로덕트 디자이너 | 전 카카오 UX 디자이너",
    coverImageUrl:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
    description: `<h2>강의 소개</h2><p>Figma를 활용한 실전 UI/UX 디자인 강의입니다. 디자인 시스템 구축부터 프로토타이핑까지 실무에서 바로 적용할 수 있는 스킬을 배웁니다.</p><h3>커리큘럼</h3><ul><li>사용자 리서치 및 페르소나 설정</li><li>와이어프레임 및 프로토타이핑</li><li>디자인 시스템 구축</li><li>반응형 디자인</li></ul>`,
    price: 120000,
    salePrice: 89000,
  },
  {
    title: "디지털 마케팅 마스터클래스",
    subtitle: "SEO, 광고, SNS 마케팅을 한 번에",
    category: "marketing",
    tutorInfo: "이민수 | 마케팅 전략가 | 전 구글 코리아 마케팅 매니저",
    coverImageUrl:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    description: `<h2>강의 소개</h2><p>온라인 비즈니스 성장을 위한 필수 디지털 마케팅 전략을 배웁니다. 검색엔진 최적화, 광고 운영, SNS 마케팅까지 통합적으로 학습합니다.</p><h3>무엇을 배우나요?</h3><ul><li>구글 애널리틱스 활용법</li><li>페이스북/인스타그램 광고</li><li>콘텐츠 마케팅 전략</li><li>전환율 최적화 (CRO)</li></ul>`,
    price: 150000,
    salePrice: 120000,
  },
  {
    title: "스타트업 창업 실전 가이드",
    subtitle: "아이디어부터 투자 유치까지",
    category: "business",
    tutorInfo: "최정훈 | 연쇄 창업가 | 3개 스타트업 엑싯 경험",
    coverImageUrl:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop",
    description: `<h2>강의 소개</h2><p>실제 창업 경험을 바탕으로 한 스타트업 창업 실전 가이드입니다. 아이디어 검증부터 MVP 개발, 투자 유치까지 전 과정을 다룹니다.</p><h3>주요 내용</h3><ul><li>시장 조사 및 고객 검증</li><li>비즈니스 모델 설계</li><li>MVP 개발 및 린 스타트업</li><li>투자 피칭 및 IR 자료 작성</li></ul>`,
    price: 199000,
  },
  {
    title: "React와 Next.js로 만드는 웹 애플리케이션",
    subtitle: "최신 프론트엔드 기술 스택 마스터",
    category: "programming",
    tutorInfo: "강동욱 | 프론트엔드 개발자 | 전 토스 시니어 엔지니어",
    coverImageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop",
    description: `<h2>강의 소개</h2><p>React와 Next.js를 활용한 모던 웹 애플리케이션 개발 강의입니다. 컴포넌트 설계, 상태 관리, 서버 사이드 렌더링까지 실무 중심으로 학습합니다.</p><h3>선수 지식</h3><ul><li>JavaScript 기본 문법</li><li>HTML/CSS 기초</li></ul><h3>학습 내용</h3><ul><li>React Hooks 완벽 이해</li><li>Next.js App Router</li><li>TypeScript와 타입 안정성</li><li>성능 최적화 기법</li></ul>`,
    price: 129000,
    salePrice: 99000,
  },
  {
    title: "브랜드 아이덴티티 디자인",
    subtitle: "로고부터 브랜드북까지",
    category: "design",
    tutorInfo: "정수진 | 브랜드 디자이너 | 다수의 스타트업 브랜딩 경험",
    coverImageUrl:
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=600&fit=crop",
    description: `<h2>강의 소개</h2><p>기업과 제품의 정체성을 시각적으로 표현하는 브랜드 아이덴티티 디자인을 배웁니다. 로고 제작부터 컬러 시스템, 타이포그래피까지 전문적인 브랜딩 작업을 경험합니다.</p><h3>프로젝트</h3><ul><li>실제 브랜드 아이덴티티 개발</li><li>브랜드북 제작</li><li>애플리케이션 가이드</li></ul>`,
    price: 99000,
    salePrice: 79000,
  },
  {
    title: "데이터 분석 with Python",
    subtitle: "Pandas, NumPy로 데이터 다루기",
    category: "etc",
    tutorInfo: "한지민 | 데이터 사이언티스트 | 현 네이버 데이터 분석가",
    coverImageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    description: `<h2>강의 소개</h2><p>Python을 활용한 데이터 분석 실무 강의입니다. Pandas와 NumPy를 사용하여 데이터를 수집, 정제, 분석하고 시각화하는 방법을 배웁니다.</p><h3>학습 목표</h3><ul><li>데이터 전처리 및 정제</li><li>탐색적 데이터 분석 (EDA)</li><li>데이터 시각화 (Matplotlib, Seaborn)</li><li>통계 분석 기초</li></ul>`,
    price: 110000,
    salePrice: 85000,
  },
];

export async function seedService() {
  try {
    console.log("🌱 Seeding service data...");

    // 1. Delete existing services (cascade delete reviews and display_services)
    await db.delete(service);
    console.log("✓ Cleared existing service data");

    // 2. Create services
    const createdServices = await db
      .insert(service)
      .values(serviceData)
      .returning();

    console.log(`✓ Created ${createdServices.length} services`);
    console.log("✅ Service seed completed successfully");

    return createdServices;
  } catch (error) {
    console.error("❌ Error seeding service data:", error);
    throw error;
  }
}

