"use client";

import { useEffect, useRef, useState } from "react";

interface PingPongVideoProps {
  src: string;
  reversedSrc?: string;
  className?: string;
  rounded?: boolean;
}

export default function PingPongVideo({ src, reversedSrc, className = "", rounded = true }: PingPongVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showForward, setShowForward] = useState(true);

  useEffect(() => {
    if (!reversedSrc) return;

    const container = containerRef.current;
    if (!container) return;

    const forwardVideo = container.querySelector("video[data-forward]") as HTMLVideoElement;
    const backwardVideo = container.querySelector("video[data-backward]") as HTMLVideoElement;
    if (!forwardVideo || !backwardVideo) return;

    const handleForwardEnd = () => {
      backwardVideo.currentTime = 0;
      backwardVideo.play().catch(() => {});
      setShowForward(false);
    };

    const handleBackwardEnd = () => {
      forwardVideo.currentTime = 0;
      forwardVideo.play().catch(() => {});
      setShowForward(true);
    };

    forwardVideo.addEventListener("ended", handleForwardEnd);
    backwardVideo.addEventListener("ended", handleBackwardEnd);

    // Start playing forward video
    forwardVideo.play().catch(() => {});

    return () => {
      forwardVideo.removeEventListener("ended", handleForwardEnd);
      backwardVideo.removeEventListener("ended", handleBackwardEnd);
    };
  }, [reversedSrc]);

  return (
    <div ref={containerRef} className={`overflow-hidden ${rounded ? 'rounded-3xl' : ''} ${className}`}>
      <video
        data-forward
        src={src}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        style={{ opacity: showForward ? 1 : 0 }}
        onError={(e) => console.error('Forward video error:', e)}
      />
      {reversedSrc && (
        <video
          data-backward
          src={reversedSrc}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          style={{ opacity: showForward ? 0 : 1 }}
          onError={(e) => console.error('Backward video error:', e)}
        />
      )}
    </div>
  );
}
