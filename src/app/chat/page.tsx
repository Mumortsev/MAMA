"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { useMemory } from "@/hooks/useMemory";
import { sendMessageToGigaChat, ChatMessage } from "@/actions/chat";

const QUICK_REPLIES: string[] = [];

export default function ChatPage() {
  const { memories, processMessageForMemory } = useMemory();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Здравствуйте! Меня зовут Хранитель. Я здесь, чтобы слушать и запоминать ваши воспоминания.' }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];

    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGigaChat(newMessages, memories);

      const cleanText = responseText.replace(/\[UPDATE_MEMORY:.*?\]/g, '').trim();

      setMessages(prev => [...prev, { role: 'assistant', content: cleanText }]);
      processMessageForMemory(responseText);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Простите, я немного задумался. Можете повторить?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] pt-6 pb-20 bg-ivory">
      <div className="text-center z-10 px-6 py-2 bg-ivory/90 backdrop-blur-md sticky top-0 border-b border-sage/20">
        <h1 className="text-2xl text-gold-dark font-bold font-serif">Хранитель</h1>
      </div>

      <div className="flex-grow overflow-y-auto px-4 py-6 flex flex-col gap-4 no-scrollbar">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-4 rounded-2xl shadow-sm text-[17px] leading-relaxed ${msg.role === 'user'
                  ? 'bg-sage/20 text-text-main rounded-tr-sm border border-sage/30'
                  : 'bg-white text-text-main rounded-tl-sm border border-gold/20 shadow-md font-serif'
                }`}
              style={{
                backgroundImage: msg.role === 'assistant' ? 'linear-gradient(to bottom, #ffffff, #FDFCF8)' : 'none'
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex w-full justify-start">
            <div className="max-w-[85%] p-4 rounded-2xl bg-white border border-gold/20 rounded-tl-sm shadow-md flex gap-2 items-center">
              <div className="w-2 h-2 rounded-full bg-gold/60 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-gold/60 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 rounded-full bg-gold/60 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      <div className="px-4 py-2 bg-ivory/95 border-t border-sage/20 flex flex-col gap-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {QUICK_REPLIES.map((reply, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(reply)}
              disabled={isLoading}
              className="whitespace-nowrap px-4 py-2 bg-white border border-sage/40 rounded-full text-sm text-sage active:scale-95 transition-transform shadow-sm"
            >
              {reply}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="Написать сообщение..."
            className="flex-grow bg-white border border-sage/40 rounded-full px-5 py-3 focus:outline-none focus:border-gold/60 transition-colors shadow-inner"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSend(input)}
            disabled={isLoading || !input.trim()}
            className="bg-gold hover:bg-gold-dark text-white rounded-full p-3 flex items-center justify-center transition-colors shadow-md active:scale-95 disabled:opacity-50 disabled:active:scale-100"
          >
            <Send size={20} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
