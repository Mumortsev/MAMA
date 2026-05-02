"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Music, MessageCircleHeart } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", icon: Home, label: "Тебе" },
    { href: "/lyrics", icon: Music, label: "Мелодия" },
    { href: "/chat", icon: MessageCircleHeart, label: "Память" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-ivory/90 backdrop-blur-md border-t border-sage/20 z-50 px-6 py-3 pb-safe">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 transition-colors duration-300 w-16 ${isActive ? "text-gold-dark" : "text-sage"
                }`}
            >
              <Icon size={26} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium tracking-wide uppercase mt-1">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
