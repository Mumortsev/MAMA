"use client";

import { useEffect, useRef } from "react";
import PingPongVideo from "@/components/PingPongVideo";
import Particles from "@/components/Particles";

function Quote({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("quote-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`quote-animate ${className}`}>
      {children}
    </div>
  );
}

const quotes = [
  "Мама — это тепло, которое всегда с тобой.",
  "Из Усть-Кута в Краснодар, путь, полный любви.",
  "Каждое воспоминание — как золото.",
  "Спасибо за заботу, тепло и свет.",
  "С 60-летием, любимая мама!"
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Мобильная версия: видео-герой на весь экран */}
      <div className="md:hidden relative h-screen">
        <PingPongVideo
          src="/video_2026-05-02_13-30-40.mp4"
          reversedSrc="/video_2026-05-02_13-30-40_out.mp4"
          className="absolute inset-0 w-full h-full"
          rounded={false}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
        <div className="relative z-10 h-full flex flex-col justify-start items-center text-center px-6 pt-[15vh]">
          <h1 className="text-5xl text-white mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-bold animate-on-load leading-tight tracking-wide">С Юбилеем, Мама!</h1>
          <p className="text-2xl text-white/90 mb-6 animate-on-load font-medium drop-shadow-[0_2px_3px_rgba(0,0,0,0.7)]">60 лет любви и мудрости</p>
          <div className="w-16 h-[1px] bg-white/50"></div>
        </div>
        <div className="absolute bottom-40 left-1/2 -translate-x-1/2 w-8 h-14 bg-white/10 rounded-full border border-white/20 relative overflow-hidden">
          <div className="w-2.5 h-2.5 bg-white rounded-full absolute bottom-2 left-1/2 animate-swipe"></div>
        </div>
      </div>

      {/* Мобильная версия: цитаты */}
      <div className="md:hidden flex flex-col gap-[15vh] w-full max-w-2xl mx-auto px-6 py-20 relative">
        <Particles className="absolute inset-0 pointer-events-none" variant="deep" />
        {quotes.map((quote, idx) => (
          <Quote key={idx} className="text-center">
            <h2 className="text-3xl italic font-serif text-gold-dark leading-relaxed relative z-10 px-4">
              «{quote}»
            </h2>
          </Quote>
        ))}
      </div>

      {/* Десктопная версия: две колонки */}
      <div className="hidden md:flex min-h-screen">
        <div className="w-1/2 h-screen sticky top-0">
          <PingPongVideo
            src="/video_2026-05-02_13-30-40.mp4"
            reversedSrc="/video_2026-05-02_13-30-40_out.mp4"
            className="w-full h-full"
          />
        </div>

        <div className="w-1/2 flex flex-col items-center px-8 py-20 overflow-y-auto hide-scrollbar relative">
          <Particles className="absolute inset-0 pointer-events-none" variant="mist" />
          <div className="min-h-[80vh] flex flex-col justify-center items-center text-center mb-12 relative z-10">
            <h1 className="text-6xl text-gold-dark mb-6 drop-shadow-sm font-bold animate-on-load">С Юбилеем, Мама!</h1>
            <p className="text-2xl text-sage mb-8 animate-on-load">60 лет любви и мудрости</p>
            <div className="w-16 h-[1px] bg-gold-dark/50"></div>
          </div>

          <div className="flex flex-col gap-[20vh] w-full max-w-2xl relative z-10">
            {quotes.map((quote, idx) => (
              <Quote key={idx} className="text-center">
                <h2 className="text-4xl italic font-serif text-text-main leading-relaxed">
                  «{quote}»
                </h2>
              </Quote>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
