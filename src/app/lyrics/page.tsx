"use client";

import { useEffect, useRef, useState } from "react";

const lyrics = [
  { time: 14, text: "Снега седой Сибири остались в прошлом сне," },
  { time: 21, text: "Ты выбрала маршрут, наперекор зиме." },
  { time: 27, text: "Мы все живём в тепле, мы все живём в весне," },
  { time: 34, text: "И этим счастьем мы обязаны тебе." },
  { time: 39, text: "Собрать детей, родителей — и изменить судьбу," },
  { time: 45, text: "Сорваться с места, к югу, где солнце и тепло." },
  { time: 52, text: "Не каждый бы решился на эту борьбу," },
  { time: 58, text: "Но нам с такой мамой безумно повезло." },

  { time: 63, text: "Мама, ты — наш самый верный свет," },
  { time: 67, text: "В имени твоём — вся суть и сила." },
  { time: 70, text: "Шестьдесят прекрасных, ярких лет," },
  { time: 73, text: "Сколько ты на плечах своих выносила." },
  { time: 76, text: "Характер твой — кремень, он твёрже, чем металл," },
  { time: 79, text: "Ты выстояла там, где слабый бы упал." },
  { time: 83, text: "Ты защитила нас от горя и невзгод," },
  { time: 86, text: "Светлана Алексеевна — ты наш стальной оплот." },

  { time: 92, text: "Сняла халат, пошла сквозь беды напролом," },
  { time: 95, text: "Когда страна ломалась, ты держала дом." },
  { time: 98, text: "Москва, Черкизовский, плацкарт и Лужники," },
  { time: 101, text: "Таскала ты баулы, надрываясь, по-мужски." },
  { time: 105, text: "Одела сотни женщин, чтоб нас с колен поднять," },
  { time: 108, text: "Здоровье там оставила... и как же не обнять?" },
  { time: 112, text: "Ты не сдала назад, не дрогнула в пути," },
  { time: 115, text: "Чтоб мы могли достойно в этот мир войти." },

  { time: 121, text: "Сынам ты подарила надёжный, светлый дом," },
  { time: 124, text: "Фундамент жизни, созданный твоим большим трудом." },
  { time: 127, text: "Цена была высокой, но ты не отступила," },
  { time: 131, text: "Ты будущее наше спиной своей купила." },
  { time: 133, text: "Ты, всем ветрам назло, себя не предала," },
  { time: 137, text: "И чувство красоты сквозь годы пронесла." },
  { time: 140, text: "Ты собирать коллекцию с любовью начала," },
  { time: 143, text: "Хранишь фарфор эпохи, что давно ушла." },

  { time: 149, text: "И рядом Алексей — надёжная стена," },
  { time: 156, text: "Любимый человек и верный твой супруг." },
  { time: 162, text: "Ты у нас такая на весь мир одна," },
  { time: 168, text: "Пусть сердце отдыхает от жизненных всех вьюг." },
  { time: 173, text: "Живи и расцветай, ты это заслужила!" },

  { time: 204, text: "Мама, ты — наш самый верный свет," },
  { time: 207, text: "В имени твоём — вся суть и сила." },
  { time: 210, text: "Шестьдесят прекрасных, ярких лет," },
  { time: 212, text: "Сколько ты на плечах своих выносила." },
  { time: 216, text: "Характер твой — кремень, он твёрже, чем металл," },
  { time: 219, text: "Ты выстояла там, где слабый бы упал." },
  { time: 222, text: "Ты защитила нас от горя и невзгод," },
  { time: 225, text: "Светлана Алексеевна — ты наш стальной оплот." },

  { time: 233, text: "Спасибо за всё, родная." },
  { time: 239, text: "Мы тебя любим." }
];

export default function LyricsPlayer() {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const resetScroll = () => {
      window.scrollTo(0, 0);
    };
    requestAnimationFrame(resetScroll);
    requestAnimationFrame(resetScroll);
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
        setHasPlayed(true);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const activeIndex = lyrics.reduce((acc, line, idx) => {
    if (currentTime >= line.time) return idx;
    return acc;
  }, 0);

  useEffect(() => {
    if (hasPlayed && activeIndex > 0 && containerRef.current) {
      const containerCenter = containerRef.current.offsetHeight / 2;
      const activeEl = document.getElementById(`lyric-${activeIndex}`);
      if (activeEl) {
        const elTop = activeEl.offsetTop;
        const elHeight = activeEl.offsetHeight;
        containerRef.current.scrollTo({
          top: elTop - containerCenter + elHeight / 2,
          behavior: 'smooth'
        });
      }
    }
  }, [activeIndex, hasPlayed]);

  return (
    <div className="flex flex-col h-[100dvh] pt-10 pb-24 overflow-hidden relative bg-ivory">
      <audio
        ref={audioRef}
        src="/song.mp3"
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="text-center z-10 px-6 py-4 bg-ivory/90 backdrop-blur-md sticky top-0 max-w-3xl mx-auto w-full">
        <h1 className="text-3xl text-gold-dark font-bold font-serif mb-2">Песня для Мамы</h1>
        <p className="text-sage font-medium text-sm">От Гены и Анжелы с любовью</p>
      </div>

      <div
        ref={containerRef}
        className="flex-grow overflow-y-auto px-6 hide-scrollbar relative no-scrollbar pb-10"
      >
        <div className="py-[15vh] flex flex-col gap-6 items-center text-center max-w-2xl mx-auto">
          {lyrics.map((line, idx) => {
            const isActive = hasPlayed && idx === activeIndex;
            return (
              <div
                key={idx}
                id={`lyric-${idx}`}
                className={`text-2xl md:text-3xl font-serif leading-relaxed transition-all duration-500 w-full px-4 ${
                  hasPlayed 
                    ? (idx === activeIndex ? "text-gold-dark scale-110 opacity-100" : "text-text-muted opacity-30 scale-100")
                    : "text-text-muted opacity-30"
                }`}
              >
                {line.text}
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-24 left-0 w-full flex justify-center z-20">
        <button
          onClick={togglePlay}
          className="bg-gold hover:bg-gold-dark transition-colors text-ivory rounded-full px-10 py-4 font-semibold shadow-xl active:scale-95 text-lg"
        >
          {isPlaying ? "Пауза" : "Слушать песню"}
        </button>
      </div>
    </div>
  );
}