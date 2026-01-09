import TipTapImage from "@tiptap/extension-image";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useEffect, useEffectEvent, useState } from "react";
import type {
  PlanType,
  ServicePlanFormatted,
} from "@/shared/types/service.type";
import { ReviewCard } from "./review-card";
import { ServicePlanCard } from "./service-plan-card";

type Review = {
  id: string;
  author: string;
  rating: number;
  content: string;
  date?: string;
  images?: string[];
  isBest?: boolean;
};

type Props = {
  videoUrl?: string | null;
  imageUrl?: string | null;
  detailImages: string;
  reviews: Review[];
  reviewCount: number;
  plans?: Record<PlanType, ServicePlanFormatted>;
};

export function Service(props: Props) {
  const [activeTab, setActiveTab] = useState<"intro" | "review" | "plan">(
    "intro",
  );
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const handleTabChange = (tab: "intro" | "review" | "plan") => {
    window.location.hash = `#service-${tab}`;
  };

  useEffect(() => {
    window.location.hash = `#service-${activeTab}`;
  }, [activeTab]);

  const handleScroll = useEffectEvent(() => {
    const scrollPosition = window.scrollY + 200;

    const introElement = document.getElementById("service-intro");
    const reviewElement = document.getElementById("service-review");
    const planElement = document.getElementById("service-plan");

    if (planElement && scrollPosition >= planElement.offsetTop) {
      setActiveTab("plan");
    } else if (reviewElement && scrollPosition >= reviewElement.offsetTop) {
      setActiveTab("review");
    } else if (introElement && scrollPosition >= introElement.offsetTop) {
      setActiveTab("intro");
    }
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffectEvent를 사용하기 때문에 의존성 배열에 넣지 않음
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // 초기 로드 시 실행

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="flex flex-col gap-12 md:min-w-[824px] md:gap-16">
      {/* Video Section */}
      <div className="hidden md:block">
        <div className="relative">
          <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden">
            <div>
              {props.videoUrl && (
                <video
                  tabIndex={-1}
                  loop
                  muted
                  autoPlay
                  playsInline
                  src={props.videoUrl}
                />
              )}
              {props.imageUrl && (
                <Image
                  className="object-cover"
                  src={props.imageUrl}
                  alt="service"
                  width={824}
                  height={464}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Best Review Section */}
      {props.reviews.filter((r) => r.isBest).length > 0 && (
        <section className="flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-semibold">베스트 리뷰</h2>
          </div>
          <div className="flex flex-col gap-4 text-sm">
            {props.reviews
              .filter((r) => r.isBest)
              .map((review) => (
                <ReviewCard
                  key={review.id}
                  id={review.id}
                  author={review.author}
                  rating={review.rating}
                  content={review.content}
                  date={review.date}
                  images={review.images}
                  isBest={review.isBest}
                />
              ))}
          </div>
        </section>
      )}

      {/* Tab Navigation */}
      <div className="top-20 sticky z-25 -mx-4 flex w-screen flex-col justify-center gap-2 bg-white md:top-gnb-height md:mx-0 md:w-full">
        <div className="h-1 w-screen bg-taling-gray-100 md:hidden" />
        <div className="flex flex-row">
          <TabButton
            label="클래스 소개"
            tab="intro"
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
          <TabButton
            label={
              <div className="flex items-center gap-1">
                리뷰{" "}
                <div className="text-xs text-taling-pink">
                  {props.reviewCount}
                </div>
              </div>
            }
            tab="review"
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
          <TabButton
            label="결제하러가기"
            tab="plan"
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>
      </div>

      {/* Detail Images Section */}
      <div id="service-intro">
        <div
          className="overflow-hidden"
          data-component="service-intro"
          style={isDescriptionExpanded ? undefined : { maxHeight: "2000px" }}
        >
          <div className="flex flex-col">
            <DescriptionContent description={props.detailImages} />
          </div>
        </div>
        {!isDescriptionExpanded && (
          <div className="relative">
            <div className="absolute bottom-0 left-0 right-0 mb-16 h-60 bg-gradient-to-t from-white via-transparent to-transparent" />
            <button
              type="button"
              className="group relative transition-colors overflow-hidden disabled:pointer-events-none border-taling-gray-300 bg-transparent shadow-sm hover:bg-taling-gray-100 hover:text-taling-gray-900 disabled:opacity-50 whitespace-nowrap px-4 mt-10 flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md border py-2 text-sm font-medium md:text-base"
              data-component="service-description-more-button"
              onClick={() => setIsDescriptionExpanded(true)}
            >
              <div className="inline-flex items-center justify-center gap-s4 whitespace-nowrap text-body1normal-medium text-taling-gray-900 relative z-10 visible">
                클래스 소개 더보기
                <ChevronDown className="h-4 w-4 md:h-5 md:w-5" />
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Student Reviews Section */}
      <div id="service-review">
        <section className="flex flex-col gap-4">
          <div className="h-1 -mx-4 bg-taling-gray-100 md:hidden" />
          <div>
            <h2 className="text-lg font-semibold">수강생 리뷰</h2>
          </div>
          <div className="flex flex-col gap-4 text-sm">
            {props.reviews
              .filter((r) => !r.isBest)
              .map((review) => (
                <ReviewCard
                  key={review.id}
                  id={review.id}
                  author={review.author}
                  rating={review.rating}
                  content={review.content}
                  date={review.date}
                  images={review.images}
                  showDate
                  showMoreButton
                  contentClassName="mt-4 whitespace-pre-wrap break-all text-sm leading-relaxed sm:text-base line-clamp-4 max-h-24 sm:max-h-28"
                />
              ))}
          </div>
          {/* <div className="mt-8 flex justify-center text-sm">
            <button
              type="button"
              className="flex items-center justify-center gap-1 rounded-md px-4 py-2 text-taling-gray-700 hover:bg-taling-gray-200"
            >
              리뷰 더보기
              <ChevronDown className="h-5 w-5" />
            </button>
          </div> */}
        </section>
      </div>

      <div>
        {" "}
        <section className="mt-12" id="service-plan">
          {props.plans && (
            <ServicePlanCard
              plans={props.plans}
              onInquiry={() => {
                console.log("문의하기 클릭");
              }}
              onPurchase={(planType) => {
                console.log(`${planType} 플랜 구매하기 클릭`);
              }}
            />
          )}
        </section>
      </div>
    </div>
  );
}

const TabButton = ({
  label,
  tab,
  activeTab,
  onTabChange,
}: {
  label: React.ReactNode;
  tab: "intro" | "review" | "plan";
  activeTab: "intro" | "review" | "plan";
  onTabChange: (tab: "intro" | "review" | "plan") => void;
}) => {
  return (
    <div className="flex grow flex-col items-center justify-center">
      <div
        className={`flex basis-1 cursor-pointer items-center rounded-md p-2 py-3 text-sm font-semibold text-taling-gray-800 md:p-4 md:py-5 lg:text-base ${
          activeTab === tab ? "text-taling-pink" : "black"
        }`}
        onClick={() => onTabChange(tab)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onTabChange(tab);
          }
        }}
      >
        {label}
        <div />
      </div>
      <div
        className={
          activeTab === tab
            ? "mx-auto w-full border-b-2 border-taling-pink"
            : ""
        }
      />
    </div>
  );
};

const DescriptionContent = ({ description }: { description: string }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      TipTapImage.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: "rounded-lg max-w-full",
        },
      }),
    ],
    content: description,
    immediatelyRender: false,
    editable: false,
  });

  return <EditorContent editor={editor} />;
};
