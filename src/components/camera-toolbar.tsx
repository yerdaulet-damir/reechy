"use client";

import React from "react";
import { FILTERS, FRAMES, FrameType } from "./camera-interface";

interface CameraToolbarProps {
  activeMode: "filters" | "frames";
  setActiveMode: (mode: "filters" | "frames") => void;
  selectedFilter: number;
  setSelectedFilter: (index: number) => void;
  frame: FrameType;
  setFrame: (frame: FrameType) => void;
}

export function CameraToolbar({
  activeMode,
  setActiveMode,
  selectedFilter,
  setSelectedFilter,
  frame,
  setFrame,
}: CameraToolbarProps) {
  return (
    <div className="w-full relative mb-8 flex flex-col items-center pointer-events-none fade-in slide-in-from-bottom-4 duration-500">
      {/* Mode Selector */}
      <div className="flex gap-2 mb-6 bg-white/40 dark:bg-black/40 backdrop-blur-xl p-1 rounded-full pointer-events-auto ring-1 ring-black/5 dark:ring-white/10 shadow-sm">
        <button
          onClick={() => setActiveMode('filters')}
          className={`text-[13px] font-semibold px-4 py-1.5 rounded-full transition-all duration-300 ${activeMode === 'filters' ? 'bg-white dark:bg-[#111] text-black dark:text-white shadow-sm' : 'text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white'}`}
        >
          Looks
        </button>
        <button
          onClick={() => setActiveMode('frames')}
          className={`text-[13px] font-semibold px-4 py-1.5 rounded-full transition-all duration-300 ${activeMode === 'frames' ? 'bg-white dark:bg-[#111] text-black dark:text-white shadow-sm' : 'text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white'}`}
        >
          Layout
        </button>
      </div>

      {/* List of Filters/Frames - Scrollable */}
      {/* Added pt-4 to give space for the ring-offset and scale transforms so it won't clip vertically */}
      <div className="w-full max-w-sm overflow-x-auto scrollbar-hide flex items-center justify-start sm:justify-center gap-4 px-6 pt-4 pb-4 pointer-events-auto snap-x">
        {activeMode === 'filters' ? FILTERS.map((f, i) => (
          <button
            key={f.name}
            onClick={() => setSelectedFilter(i)}
            className={`flex flex-col items-center gap-2 snap-center shrink-0 transition-all duration-300 group ${selectedFilter === i ? 'scale-105' : 'opacity-80 hover:opacity-100 hover:scale-100'}`}
          >
            <div className={`w-12 h-12 rounded-full ${f.bgClass} flex items-center justify-center ring-2 ring-offset-[3px] ring-offset-[#F5F5F7] dark:ring-offset-[#1A1A1A] transition-all shadow-sm ${selectedFilter === i ? 'ring-[#0066FF]' : 'ring-black/5 dark:ring-white/10'}`} />
            <span className={`text-[11px] font-semibold tracking-wide transition-colors ${selectedFilter === i ? 'text-[#0066FF] dark:text-[#3388FF]' : 'text-zinc-700 dark:text-zinc-300'}`}>{f.name}</span>
          </button>
        )) : FRAMES.map((f, i) => (
          <button
            key={f.name}
            onClick={() => setFrame(f.type)}
            className={`flex flex-col items-center gap-2 snap-center shrink-0 transition-all duration-300 group ${frame === f.type ? 'scale-105' : 'opacity-80 hover:opacity-100 hover:scale-100'}`}
          >
            <div className={`w-12 h-12 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur flex items-center justify-center ring-2 ring-offset-[3px] ring-offset-[#F5F5F7] dark:ring-offset-[#1A1A1A] transition-all shadow-sm ${frame === f.type ? 'ring-[#0066FF]' : 'ring-black/5 dark:ring-white/10 group-hover:bg-white dark:group-hover:bg-zinc-700'}`}>
              <f.icon className={`w-[18px] h-[18px] ${frame === f.type ? 'text-[#0066FF] dark:text-[#3388FF]' : 'text-zinc-700 dark:text-zinc-300'}`} />
            </div>
            <span className={`text-[11px] font-semibold tracking-wide transition-colors ${frame === f.type ? 'text-[#0066FF] dark:text-[#3388FF]' : 'text-zinc-700 dark:text-zinc-300'}`}>{f.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
