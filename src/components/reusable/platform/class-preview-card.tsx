"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useVideoPlayControl } from "@/hooks/reusable/platform/video-play-control";

type Props = {
  id: string;
  title: string;
  tutor: string;
  thumbnailUrl: string;
  videoUrl: string;
  href: React.ComponentProps<typeof Link>["href"];
};

export function ClassPreviewCard({
  title,
  tutor,
  thumbnailUrl,
  videoUrl,
  href,
}: Props) {
  const { prevVideoRef, setPrevVideoRef } = useVideoPlayControl();
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      if (!videoRef.current) return;

      if (prevVideoRef.current) {
        prevVideoRef.current.previousElementSibling
          ?.querySelector("img")
          ?.classList.add("opacity-100");
        prevVideoRef.current.pause();
      }

      videoRef.current.play();
      videoRef.current.previousElementSibling
        ?.querySelector("img")
        ?.classList.add("opacity-0");
      setPrevVideoRef(videoRef.current);
    }, 600);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  return (
    <Link
      href={href}
      className="group relative rounded-xl overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="z-10 relative">
        <Image
          className="transition-all duration-300 ease-out"
          src={thumbnailUrl}
          alt={title}
          width={300}
          height={400}
        />
      </div>

      {videoUrl && (
        <video
          ref={videoRef}
          src={videoUrl}
          className="absolute top-0 left-0 border-0 right-0 w-full h-full object-cover "
          controls={false}
          muted
          loop
          playsInline
        >
          <track kind="captions" src={videoUrl} />
        </video>
      )}

      <div className="absolute z-10 bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-800/50 to-transparent text-white">
        <h3 className="text-xs sm:text-body font-semibold text-balance break-keep line-clamp-2">
          {title}
        </h3>
        <p className="mt-1 text-xs sm:text-sm">{tutor}</p>
      </div>
    </Link>
  );
}
