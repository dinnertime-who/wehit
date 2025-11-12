import { type RefObject, useRef } from "react";
import { withContext } from "@/hooks/with-context";

const { useContext, Provider } = withContext<{
  prevVideoRef: RefObject<HTMLVideoElement | null>;
  setPrevVideoRef: (ref: HTMLVideoElement | null) => void;
}>();

export const useVideoPlayControl = useContext;

export const VideoPlayControlProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const prevVideoRef = useRef<HTMLVideoElement | null>(null);
  const setPrevVideoRef = (ref: HTMLVideoElement | null) => {
    prevVideoRef.current = ref;
  };
  return (
    <Provider context={{ prevVideoRef, setPrevVideoRef }}>{children}</Provider>
  );
};
