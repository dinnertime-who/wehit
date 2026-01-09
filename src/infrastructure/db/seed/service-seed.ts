import { db } from "@/infrastructure/db/drizzle";
import { service } from "@/infrastructure/db/schema";

// 카테고리별 서비스 템플릿
const serviceTemplates = {
  programming: [
    {
      title: "처음 시작하는 Python 프로그래밍",
      subtitle: "기초부터 실전까지, 파이썬 완벽 마스터",
      tutorInfo: "김철수 | 10년차 풀스택 개발자 | 전 네이버 시니어 개발자",
      coverImageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&h=600&fit=crop",
      descriptionImageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4f18ac5?w=1200&h=800&fit=crop",
      price: 89000,
      salePrice: 69000,
    },
    {
      title: "React와 Next.js로 만드는 웹 애플리케이션",
      subtitle: "최신 프론트엔드 기술 스택 마스터",
      tutorInfo: "강동욱 | 프론트엔드 개발자 | 전 토스 시니어 엔지니어",
      coverImageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop",
      descriptionImageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=800&fit=crop",
      price: 129000,
      salePrice: 99000,
    },
    {
      title: "자바스크립트 완전 정복",
      subtitle: "ES6+ 문법부터 비동기 처리까지",
      tutorInfo: "이수진 | 시니어 프론트엔드 개발자 | 전 카카오 엔지니어",
      coverImageUrl: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&h=600&fit=crop",
      descriptionImageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=800&fit=crop",
      price: 99000,
      salePrice: 79000,
    },
    {
      title: "Node.js 백엔드 개발 마스터",
      subtitle: "Express, MongoDB로 풀스택 구현하기",
      tutorInfo: "박민호 | 백엔드 아키텍트 | 전 라인 시니어 개발자",
      coverImageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop",
      descriptionImageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=800&fit=crop",
      price: 119000,
      salePrice: 89000,
    },
    {
      title: "TypeScript로 시작하는 타입 안전한 개발",
      subtitle: "타입 시스템 완벽 이해하기",
      tutorInfo: "최영수 | 타입스크립트 전문가 | 전 우아한형제들 개발자",
      coverImageUrl: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=600&fit=crop",
      descriptionImageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=800&fit=crop",
      price: 109000,
      salePrice: 85000,
    },
    {
      title: "Vue.js 3 Composition API 완전정복",
      subtitle: "최신 Vue.js로 모던 웹앱 만들기",
      tutorInfo: "정다은 | Vue.js 코어 컨트리뷰터 | 프론트엔드 전문가",
      coverImageUrl: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&h=600&fit=crop",
      descriptionImageUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&h=800&fit=crop",
      price: 95000,
      salePrice: 75000,
    },
    {
      title: "Docker와 Kubernetes 실전 운영",
      subtitle: "컨테이너 오케스트레이션 마스터",
      tutorInfo: "한태영 | DevOps 엔지니어 | 전 AWS 솔루션 아키텍트",
      coverImageUrl: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&h=600&fit=crop",
      descriptionImageUrl: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=1200&h=800&fit=crop",
      price: 149000,
      salePrice: 119000,
    },
    {
      title: "Git과 GitHub 협업 워크플로우",
      subtitle: "버전 관리부터 CI/CD까지",
      tutorInfo: "윤서준 | 소프트웨어 엔지니어 | 오픈소스 컨트리뷰터",
      coverImageUrl: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&h=600&fit=crop",
      descriptionImageUrl: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=1200&h=800&fit=crop",
      price: 79000,
      salePrice: 59000,
    },
  ],
  design: [
    {
      title: "실전 UI/UX 디자인 with Figma",
      subtitle: "사용자 중심의 디자인 사고방식 익히기",
      tutorInfo: "박영희 | 7년차 프로덕트 디자이너 | 전 카카오 UX 디자이너",
      coverImageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
      descriptionImageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=800&fit=crop",
      price: 120000,
      salePrice: 89000,
    },
    {
      title: "브랜드 아이덴티티 디자인",
      subtitle: "로고부터 브랜드북까지",
      tutorInfo: "정수진 | 브랜드 디자이너 | 다수의 스타트업 브랜딩 경험",
      coverImageUrl: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=600&fit=crop",
      descriptionImageUrl: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1200&h=800&fit=crop",
      price: 99000,
      salePrice: 79000,
    },
    {
      title: "Adobe Photoshop 실전 테크닉",
      subtitle: "포토 리터칭부터 합성까지",
      tutorInfo: "김미라 | 그래픽 디자이너 | 프리랜서 크리에이터",
      coverImageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop",
      descriptionImageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=800&fit=crop",
      price: 89000,
      salePrice: 69000,
    },
    {
      title: "일러스트레이터로 시작하는 벡터 그래픽",
      subtitle: "로고와 아이콘 디자인 마스터",
      tutorInfo: "이하늘 | 일러스트레이터 | 전 애플 디자인팀",
      coverImageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
      descriptionImageUrl: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=1200&h=800&fit=crop",
      price: 95000,
      salePrice: 75000,
    },
    {
      title: "모션 그래픽 with After Effects",
      subtitle: "영상 편집과 모션 디자인",
      tutorInfo: "송지훈 | 모션 그래픽 디자이너 | 전 CJ ENM 크리에이터",
      coverImageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop",
      descriptionImageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=800&fit=crop",
      price: 129000,
      salePrice: 99000,
    },
    {
      title: "3D 모델링 with Blender",
      subtitle: "무료 툴로 시작하는 3D 디자인",
      tutorInfo: "조민석 | 3D 아티스트 | 인디게임 개발자",
      coverImageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop",
      descriptionImageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=800&fit=crop",
      price: 139000,
      salePrice: 109000,
    },
    {
      title: "웹 디자인 실전 프로젝트",
      subtitle: "반응형 웹사이트 디자인부터 개발까지",
      tutorInfo: "배서연 | 웹 디자이너 | 전 네이버 디자인팀",
      coverImageUrl: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop",
      descriptionImageUrl: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&h=800&fit=crop",
      price: 119000,
      salePrice: 89000,
    },
    {
      title: "패키지 디자인과 브랜딩",
      subtitle: "제품 포장 디자인 실무",
      tutorInfo: "임지은 | 패키지 디자이너 | 전 롯데칠성 디자인팀",
      coverImageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
      descriptionImageUrl: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=1200&h=800&fit=crop",
      price: 109000,
      salePrice: 85000,
    },
  ],
  marketing: [
    {
      title: "디지털 마케팅 마스터클래스",
      subtitle: "SEO, 광고, SNS 마케팅을 한 번에",
      tutorInfo: "이민수 | 마케팅 전략가 | 전 구글 코리아 마케팅 매니저",
      coverImageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      descriptionImageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop",
      price: 150000,
      salePrice: 120000,
    },
    {
      title: "인스타그램 마케팅 전략",
      subtitle: "팔로워 증가와 브랜드 성장",
      tutorInfo: "최유진 | 인플루언서 마케터 | 50만 팔로워 크리에이터",
      coverImageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop",
      descriptionImageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=800&fit=crop",
      price: 99000,
      salePrice: 79000,
    },
    {
      title: "구글 애즈 완전 정복",
      subtitle: "검색 광고와 디스플레이 광고 운영",
      tutorInfo: "김태현 | 디지털 광고 전문가 | 전 페이스북 광고 매니저",
      coverImageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
      descriptionImageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop",
      price: 119000,
      salePrice: 89000,
    },
    {
      title: "콘텐츠 마케팅 전략",
      subtitle: "블로그와 유튜브로 브랜드 구축",
      tutorInfo: "박서준 | 콘텐츠 마케터 | 전 네이버 콘텐츠팀",
      coverImageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4f18ac5?w=800&h=600&fit=crop",
      descriptionImageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4f18ac5?w=1200&h=800&fit=crop",
      price: 109000,
      salePrice: 85000,
    },
    {
      title: "이메일 마케팅 자동화",
      subtitle: "Mailchimp와 HubSpot 활용법",
      tutorInfo: "정민아 | 마케팅 오토메이션 전문가 | 전 Salesforce 마케터",
      coverImageUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop",
      descriptionImageUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&h=800&fit=crop",
      price: 95000,
      salePrice: 75000,
    },
    {
      title: "페이스북 광고 운영 실무",
      subtitle: "타겟팅과 전환율 최적화",
      tutorInfo: "한지우 | 소셜 미디어 마케터 | 전 메타 광고 전문가",
      coverImageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop",
      descriptionImageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=800&fit=crop",
      price: 89000,
      salePrice: 69000,
    },
    {
      title: "유튜브 채널 성장 전략",
      subtitle: "구독자와 조회수 늘리기",
      tutorInfo: "윤서진 | 유튜브 크리에이터 | 100만 구독자",
      coverImageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop",
      descriptionImageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=800&fit=crop",
      price: 129000,
      salePrice: 99000,
    },
    {
      title: "마케팅 데이터 분석",
      subtitle: "GA4와 데이터 스튜디오 활용",
      tutorInfo: "배준호 | 마케팅 애널리스트 | 전 구글 애널리틱스 전문가",
      coverImageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
      descriptionImageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop",
      price: 119000,
      salePrice: 89000,
    },
  ],
  business: [
    {
      title: "스타트업 창업 실전 가이드",
      subtitle: "아이디어부터 투자 유치까지",
      tutorInfo: "최정훈 | 연쇄 창업가 | 3개 스타트업 엑싯 경험",
      coverImageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop",
      descriptionImageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&h=800&fit=crop",
      price: 199000,
    },
    {
      title: "비즈니스 모델 캔버스 설계",
      subtitle: "수익 모델과 가치 제안 만들기",
      tutorInfo: "김영수 | 비즈니스 컨설턴트 | 전 맥킨지 파트너",
      coverImageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
      descriptionImageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=800&fit=crop",
      price: 149000,
      salePrice: 119000,
    },
    {
      title: "리더십과 팀 관리",
      subtitle: "효과적인 조직 운영하기",
      tutorInfo: "박지영 | 조직 개발 전문가 | 전 구글 팀 리더",
      coverImageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
      descriptionImageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=800&fit=crop",
      price: 129000,
      salePrice: 99000,
    },
    {
      title: "재무 관리와 회계 기초",
      subtitle: "스타트업을 위한 재무 이해하기",
      tutorInfo: "이수진 | CPA | 전 빅4 회계법인 파트너",
      coverImageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop",
      descriptionImageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=800&fit=crop",
      price: 109000,
      salePrice: 85000,
    },
    {
      title: "고객 성공 전략",
      subtitle: "CSM과 고객 유지율 향상",
      tutorInfo: "정민호 | 고객 성공 전문가 | 전 Salesforce CSM",
      coverImageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
      descriptionImageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=800&fit=crop",
      price: 119000,
      salePrice: 89000,
    },
    {
      title: "프로젝트 관리 with Notion",
      subtitle: "효율적인 업무 관리 시스템",
      tutorInfo: "최서연 | 프로젝트 매니저 | 전 아마존 PM",
      coverImageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
      descriptionImageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=800&fit=crop",
      price: 89000,
      salePrice: 69000,
    },
    {
      title: "협상과 계약 관리",
      subtitle: "비즈니스 협상 스킬 마스터",
      tutorInfo: "한지훈 | 협상 전문가 | 전 하버드 비즈니스 스쿨",
      coverImageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop",
      descriptionImageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=800&fit=crop",
      price: 139000,
      salePrice: 109000,
    },
    {
      title: "글로벌 비즈니스 확장",
      subtitle: "해외 진출 전략과 실행",
      tutorInfo: "윤태영 | 글로벌 비즈니스 전문가 | 전 삼성 글로벌 전략팀",
      coverImageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
      descriptionImageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=800&fit=crop",
      price: 179000,
      salePrice: 139000,
    },
  ],
  etc: [
    {
      title: "데이터 분석 with Python",
      subtitle: "Pandas, NumPy로 데이터 다루기",
      tutorInfo: "한지민 | 데이터 사이언티스트 | 현 네이버 데이터 분석가",
      coverImageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
      descriptionImageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop",
      price: 110000,
      salePrice: 85000,
    },
    {
      title: "머신러닝 기초 with TensorFlow",
      subtitle: "인공지능 모델 만들기",
      tutorInfo: "김동욱 | AI 연구원 | 전 구글 AI 연구소",
      coverImageUrl: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&h=600&fit=crop",
      descriptionImageUrl: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=1200&h=800&fit=crop",
      price: 159000,
      salePrice: 129000,
    },
    {
      title: "블록체인과 암호화폐 이해하기",
      subtitle: "Web3와 NFT 기초",
      tutorInfo: "박준호 | 블록체인 개발자 | 전 이더리움 코어 개발자",
      coverImageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop",
      descriptionImageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&h=800&fit=crop",
      price: 149000,
      salePrice: 119000,
    },
    {
      title: "사진 촬영과 편집",
      subtitle: "DSLR부터 모바일 사진까지",
      tutorInfo: "이미라 | 사진작가 | 전 Vogue 포토그래퍼",
      coverImageUrl: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=600&fit=crop",
      descriptionImageUrl: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=1200&h=800&fit=crop",
      price: 99000,
      salePrice: 79000,
    },
    {
      title: "영상 편집 with Premiere Pro",
      subtitle: "유튜브 영상 제작 마스터",
      tutorInfo: "정서진 | 영상 편집자 | 전 MBC 편집팀",
      coverImageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop",
      descriptionImageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=800&fit=crop",
      price: 119000,
      salePrice: 89000,
    },
    {
      title: "온라인 강의 제작 가이드",
      subtitle: "나만의 온라인 강의 만들기",
      tutorInfo: "최민수 | 온라인 교육 전문가 | 전 에듀테크 스타트업 CEO",
      coverImageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop",
      descriptionImageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=800&fit=crop",
      price: 109000,
      salePrice: 85000,
    },
    {
      title: "프레젠테이션 스킬 향상",
      subtitle: "파워포인트와 발표 기법",
      tutorInfo: "한지은 | 커뮤니케이션 전문가 | 전 TEDx 스피커",
      coverImageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop",
      descriptionImageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=800&fit=crop",
      price: 89000,
      salePrice: 69000,
    },
    {
      title: "창의적 글쓰기",
      subtitle: "콘텐츠 기획과 스토리텔링",
      tutorInfo: "윤서준 | 작가 | 베스트셀러 작가",
      coverImageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop",
      descriptionImageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=800&fit=crop",
      price: 95000,
      salePrice: 75000,
    },
  ],
};

// 서비스 데이터 생성 (40개)
function generateServiceData() {
  const services: Array<{
    title: string;
    subtitle: string;
    category: string;
    tutorInfo: string;
    coverImageUrl: string;
    description: string;
    classType: "group" | "individual" | "oneday";
    maxParticipants: number;
    duration: number;
    durationUnit: "시간" | "개월";
  }> = [];

  // 각 카테고리별로 8개씩 생성
  Object.entries(serviceTemplates).forEach(([category, templates]) => {
    templates.forEach((template) => {
      // description을 이미지 기반 HTML로 생성
      const description = `<div style="text-align: center;"><img src="${template.descriptionImageUrl}" alt="${template.title}" style="max-width: 100%; height: auto; border-radius: 8px;" /></div>`;

      // 클래스 타입을 랜덤하게 설정
      const classTypes: Array<"group" | "individual" | "oneday"> = ["group", "individual", "oneday"];
      const classType = classTypes[Math.floor(Math.random() * classTypes.length)];
      
      // 클래스 타입에 따라 인원 설정
      const maxParticipants = classType === "group" ? Math.floor(Math.random() * 8) + 3 : classType === "individual" ? 1 : Math.floor(Math.random() * 15) + 5;
      
      // 기간 설정 (1-12개월 또는 1-8시간)
      const isMonthly = Math.random() > 0.5;
      const duration = isMonthly ? Math.floor(Math.random() * 12) + 1 : Math.floor(Math.random() * 8) + 1;
      const durationUnit = isMonthly ? "개월" : "시간";

      services.push({
        title: template.title,
        subtitle: template.subtitle,
        category,
        tutorInfo: template.tutorInfo,
        coverImageUrl: template.coverImageUrl,
        description,
        classType,
        maxParticipants,
        duration,
        durationUnit,
      });
    });
  });

  return services;
}

export async function seedService() {
  try {
    console.log("🌱 Seeding service data...");

    // 1. Delete existing services (cascade delete reviews and display_services)
    await db.delete(service);
    console.log("✓ Cleared existing service data");

    // 2. Generate service data (40 services)
    const serviceData = generateServiceData();

    // 3. Create services
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
