import React from 'react';
import { Home, Compass, CalendarCheck, Heart, User } from 'lucide-react';

export default function MobileBottomNav({ activeTab, onSelectTab, onOpenBookingModal, wishlistCount, theme = 'light' }) {
  const isLight = theme === 'light';

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'destinations', label: 'Dives', icon: Compass },
    { id: 'bookings', label: 'Bookings', icon: CalendarCheck },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, badge: wishlistCount },
    { id: 'about', label: 'Profile', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 px-3 pb-3 pt-1 pointer-events-none">
      <div className={`pointer-events-auto max-w-md mx-auto rounded-2xl backdrop-blur-2xl border shadow-2xl px-3 py-2 flex items-center justify-around ${
        isLight
          ? 'bg-white/90 border-sky-200/90 shadow-[0_8px_30px_rgba(14,165,233,0.15)] text-slate-700'
          : 'bg-abyss-950/85 border-cyan-500/25 shadow-[0_10px_35px_rgba(0,0,0,0.8)] text-slate-400'
      }`}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 ${
                isActive 
                  ? isLight ? 'text-sky-600 font-bold scale-105' : 'text-cyan-300 scale-105' 
                  : isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${
                  isActive 
                    ? isLight ? 'stroke-[2.5px] text-sky-600' : 'stroke-[2.5px] text-cyan-300 drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]' 
                    : 'stroke-[1.8px]'
                }`} />
                {tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-rose-500 text-[9px] font-bold text-white w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-md">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 font-sans ${isActive ? 'font-semibold' : 'font-normal'}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className={`absolute bottom-0 w-3 h-0.5 rounded-full ${
                  isLight ? 'bg-sky-500' : 'bg-cyan-400 shadow-[0_0_6px_rgba(0,240,255,0.8)]'
                }`} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
