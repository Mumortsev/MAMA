"use client";

import { useState, useRef, useEffect } from "react";

const textLines = [
  "Снега седой Сибири остались в прошлом сне,",
  "Ты выбрала маршрут, наперекор зиме.",
  "Мы все живём в тепле, мы все живём в весне,",
  "И этим счастьем мы обязаны тебе.",
  "Собрать детей, родителей — и изменить судьбу,",
  "Сорваться с места, к югу, где солнце и тепло.",
  "Не каждый бы решился на эту борьбу,",
  "Но нам с такой мамой безумно повезло.",
  "Мама, ты — наш самый верный свет,",
  "В имени твоём — вся суть и сила.",
  "Шестьдесят прекрасных, ярких лет,",
  "Сколько ты на плечах своих выносила.",
  "Характер твой — кремень, он твёрже, чем металл,",
  "Ты выстояла там, где слабый бы упал.",
  "Ты защитила нас от горя и невзгод,",
  "Светлана Алексеевна — ты наш стальной оплот.",
  "Сняла халат, пошла сквозь беды напролом,",
  "Когда страна ломалась, ты держала дом.",
  "Москва, Черкизовский, плацкарт и Лужники,",
  "Таскала ты баулы, надрываясь, по-мужски.",
  "Одела сотни женщин, чтоб нас с колен поднять,",
  "Здоровье там оставила... и как же не обнять?",
  "Ты не сдала назад, не дрогнула в пути,",
  "Чтоб мы могли достойно в этот мир войти.",
  "Сынам ты подарила надёжный, светлый дом,",
  "Фундамент жизни, созданный твоим большим трудом.",
  "Цена была высокой, но ты не отступила,",
  "Ты будущее наше спиной своей купила.",
  "Ты, всем ветрам назло, себя не предала,",
  "И чувство красоты сквозь годы пронесла.",
  "Ты собирать коллекцию с любовью начала,",
  "Хранишь фарфор эпохи, что давно ушла.",
  "И рядом Алексей — надёжная стена,",
  "Любимый человек и верный твой супруг.",
  "Ты у нас такая на весь мир одна,",
  "Пусть сердце отдыхает от жизненных всех вьюг.",
  "Живи и расцветай, ты это заслужила!",
  "Мама, ты — наш самый верный свет,",
  "В имени твоём — вся суть и сила.",
  "Шестьдесят прекрасных, ярких лет,",
  "Сколько ты на плечах своих выносила.",
  "Характер твой — кремень, он твёрже, чем металл,",
  "Ты выстояла там, где слабый бы упал.",
  "Ты защитила нас от горя и невзгод,",
  "Светлана Алексеевна — ты наш стальной оплот.",
  "Спасибо за всё, родная.",
  "Мы тебя любим."
];

export default function SyncTool() {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [syncedLyrics, setSyncedLyrics] = useState<{time: number, text: string}[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleSync = () => {
    if (audioRef.current && currentLineIndex < textLines.length) {
      const time = Number(audioRef.current.currentTime.toFixed(1));
      setSyncedLyrics(prev => [...prev, { time, text: textLines[currentLineIndex] }]);
      setCurrentLineIndex(prev => prev + 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleSync();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentLineIndex]);

  const outputCode = `const lyrics = [\n${syncedLyrics.map(l => `  { time: ${l.time}, text: "${l.text}" }`).join(',\n')}\n];`;

  return (
    <div className="min-h-screen bg-ivory text-text-main p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Инструмент синхронизации текста</h1>
      <p className="mb-6 opacity-80">
        1. Включите песню.<br/>
        2. Нажимайте <b>Пробел</b> ровно в тот момент, когда начинает петься следующая строчка.<br/>
        3. Когда закончите, скопируйте код снизу и отправьте мне или вставьте в <code>src/app/lyrics/page.tsx</code>.
      </p>

      <audio ref={audioRef} src="/song.mp3" controls className="mb-8 w-full" />

      <div className="flex flex-col gap-4 mb-8">
        <h2 className="text-xl font-bold">Следующая строка:</h2>
        <div className="text-2xl text-gold-dark font-serif border p-4 rounded-xl bg-white shadow-sm">
          {currentLineIndex < textLines.length ? textLines[currentLineIndex] : "Все строки синхронизированы!"}
        </div>
        <button 
          onClick={handleSync}
          disabled={currentLineIndex >= textLines.length}
          className="bg-sage text-white py-3 rounded-xl active:scale-95 disabled:opacity-50"
        >
          Нажми меня (или Пробел)
        </button>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Результат:</h2>
        <textarea 
          className="w-full h-96 p-4 font-mono text-sm border border-sage/30 rounded-xl"
          value={outputCode}
          readOnly
        />
      </div>
    </div>
  );
}
