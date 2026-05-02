"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);
  const textCharsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (isFinished) return;

    // Предотвращаем скроллинг во время прелоадера
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setIsFinished(true);
          document.body.style.overflow = "";
        }
      });

      const obj = { year: 1966 };

      tl.to(obj, {
        year: 2026,
        duration: 2.5,
        ease: "power1.inOut",
        snap: { year: 1 },
        onUpdate: () => {
          if (yearRef.current) {
            yearRef.current.innerText = obj.year.toString();
          }
        },
      })
        .to(yearRef.current, {
          opacity: 0,
          scale: 0.8,
          duration: 0.3,
          ease: "power2.in",
        })
        .call(() => {
          if (yearRef.current) {
            yearRef.current.innerText = "60";
            yearRef.current.classList.remove("text-sage");
            yearRef.current.classList.add("text-gold-dark");
          }
        })
        .to(yearRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.5)"
        })
        .fromTo(textCharsRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" },
          "-=0.2"
        )
        .to(containerRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
          delay: 0.8,
          onComplete: () => {
            document.body.classList.add("preloader-finished");
          }
        });
    }, containerRef);

    return () => {
      ctx.revert();
      document.body.style.overflow = "";
    };
  }, [isFinished]);

  if (isFinished) return null;

  const subtitle = "лет тепла и любви".split("");

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ivory pointer-events-auto"
      style={{
        backgroundImage: "radial-gradient(circle at 50% 50%, var(--color-ivory) 0%, #f4eee2 100%)"
      }}
    >
      <div className="flex flex-col items-center justify-center h-48">
        <div
          ref={yearRef}
          className="text-[6rem] md:text-[8rem] font-bold text-sage drop-shadow-sm font-serif leading-none"
        >
          1966
        </div>
        <div className="flex mt-2 overflow-hidden h-12 items-center justify-center">
          {subtitle.map((char, i) => (
            <span
              key={i}
              ref={el => { textCharsRef.current[i] = el; }}
              className="text-3xl md:text-4xl text-sage font-medium inline-block font-serif italic"
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
