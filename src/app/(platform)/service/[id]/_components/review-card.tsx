import { Star } from "lucide-react";

type ReviewCardProps = {
  id: string;
  author: string;
  rating: number;
  content: string;
  date?: string;
  images?: string[];
  isBest?: boolean;
  showDate?: boolean;
  showMoreButton?: boolean;
  contentClassName?: string;
};

export function ReviewCard({
  author,
  rating,
  content,
  date,
  images,
  isBest,
  showDate = false,
  showMoreButton = false,
  contentClassName = "mt-4 whitespace-pre-wrap break-all text-sm leading-relaxed sm:text-base",
}: ReviewCardProps) {
  return (
    <div className="rounded-lg border border-taling-gray-200 p-4 md:px-6">
      <div className="flex gap-3">
        <div className="shrink-0">
          <img
            src="//img.taling.me/Content/Images/placeholders/profile-default.jpg"
            alt="리뷰 작성자 프로필 이미지"
            className="h-10 w-10 rounded-full object-cover md:h-12 md:w-12"
            loading="lazy"
          />
        </div>
        <div className="w-full">
          <div>
            <div className="flex justify-between">
              <div className="flex gap-1 space-x-1">
                <div>{author}</div>
                {isBest && (
                  <div className="flex items-center">
                    <p className="inline-block text-taling-pink text-[0.6rem] leading-none border-taling-pink border rounded-full px-1.5 py-1">
                      BEST
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {showDate && date && (
                  <time className="cursor-default text-xs text-taling-gray-600">
                    {date}
                  </time>
                )}
              </div>
            </div>
            <div className="mt-1 flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 text-yellow-300 fill-current"
                />
              ))}
              <div className="ml-2 font-semibold">{rating.toFixed(1)}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex">
        <div className={contentClassName}>{content}</div>
      </div>
      {showMoreButton && (
        <div>
          <button
            type="button"
            className="font-semibold text-black underline underline-offset-2"
          >
            더보기
          </button>
        </div>
      )}
      {images && images.length > 0 && (
        <div className="mt-5 flex gap-2 overflow-auto">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt="포토리뷰 사진"
              className="h-auto max-h-[250px] w-full max-w-[180px] cursor-pointer rounded-lg object-cover"
              loading="lazy"
            />
          ))}
        </div>
      )}
      <div className="mt-4 flex justify-end text-xs text-taling-gray-600 hover:text-taling-gray-800">
        <button type="button">신고</button>
      </div>
    </div>
  );
}
