"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Minus,
  Plus,
  ScrollText,
  X,
  Eye,
  EyeOff,
} from "lucide-react";

interface TeleprompterProps {
  isRecording: boolean;
  isPaused: boolean;
  recordingTime: number;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export function Teleprompter({
  isRecording,
  isPaused,
  recordingTime,
  isVisible,
  onToggleVisibility,
}: TeleprompterProps) {
  const [scriptText, setScriptText] = useState("");
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(2); // 1-5
  const [fontSize, setFontSize] = useState(28);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isEditMode, setIsEditMode] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Draggable state
  const [position, setPosition] = useState({ x: -1, y: -1 }); // -1 means use default
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollAnimationRef = useRef<number | null>(null);
  const lastScrollTime = useRef<number>(0);

  // Initialize default position
  useEffect(() => {
    if (position.x === -1 && panelRef.current) {
      const parentRect =
        panelRef.current.parentElement?.getBoundingClientRect();
      if (parentRect) {
        setPosition({
          x: parentRect.width - 380,
          y: 80,
        });
      }
    }
  }, [position.x]);

  // Format time for timecode display
  const formatTimecode = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`;
  };

  // Auto-scroll logic
  const doScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    // Speed: pixels per frame at 60fps, scaled by speed setting
    const pixelsPerFrame = 0.5 + scrollSpeed * 0.6;
    container.scrollTop += pixelsPerFrame;

    // Calculate progress
    const maxScroll = container.scrollHeight - container.clientHeight;
    if (maxScroll > 0) {
      setScrollProgress(Math.min(container.scrollTop / maxScroll, 1));
    }

    // Stop at the end
    if (container.scrollTop >= container.scrollHeight - container.clientHeight) {
      setIsScrolling(false);
      return;
    }

    scrollAnimationRef.current = requestAnimationFrame(doScroll);
  }, [scrollSpeed]);

  useEffect(() => {
    if (isScrolling && !isPaused) {
      scrollAnimationRef.current = requestAnimationFrame(doScroll);
    } else {
      if (scrollAnimationRef.current) {
        cancelAnimationFrame(scrollAnimationRef.current);
        scrollAnimationRef.current = null;
      }
    }
    return () => {
      if (scrollAnimationRef.current) {
        cancelAnimationFrame(scrollAnimationRef.current);
      }
    };
  }, [isScrolling, isPaused, doScroll]);

  // Pause auto-scroll when recording is paused
  useEffect(() => {
    if (isPaused && scrollAnimationRef.current) {
      cancelAnimationFrame(scrollAnimationRef.current);
      scrollAnimationRef.current = null;
    }
  }, [isPaused]);

  // Handle manual scroll (pause auto-scroll briefly)
  const handleManualScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const maxScroll = container.scrollHeight - container.clientHeight;
    if (maxScroll > 0) {
      setScrollProgress(Math.min(container.scrollTop / maxScroll, 1));
    }
  };

  // Toggle scroll
  const toggleScroll = () => {
    if (!isScrolling && scrollContainerRef.current) {
      // Reset to top if at the bottom
      const container = scrollContainerRef.current;
      if (
        container.scrollTop >=
        container.scrollHeight - container.clientHeight - 10
      ) {
        container.scrollTop = 0;
        setScrollProgress(0);
      }
    }
    setIsScrolling(!isScrolling);
    if (isEditMode) setIsEditMode(false);
  };

  // Switch to read mode
  const switchToReadMode = () => {
    if (scriptText.trim()) {
      setIsEditMode(false);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
        setScrollProgress(0);
      }
    }
  };

  // Dragging handlers
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!panelRef.current) return;
    setIsDragging(true);

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    dragOffset.current = {
      x: clientX - position.x,
      y: clientY - position.y,
    };

    e.preventDefault();
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientX =
        "touches" in e
          ? (e as TouchEvent).touches[0].clientX
          : (e as MouseEvent).clientX;
      const clientY =
        "touches" in e
          ? (e as TouchEvent).touches[0].clientY
          : (e as MouseEvent).clientY;

      const parentRect =
        panelRef.current?.parentElement?.getBoundingClientRect();
      if (!parentRect) return;

      const newX = Math.max(
        0,
        Math.min(clientX - dragOffset.current.x, parentRect.width - 100)
      );
      const newY = Math.max(
        0,
        Math.min(clientY - dragOffset.current.y, parentRect.height - 100)
      );

      setPosition({ x: newX, y: newY });
    };

    const handleUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchmove", handleMove);
    window.addEventListener("touchend", handleUp);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleUp);
    };
  }, [isDragging, position]);

  if (!isVisible) return null;

  // Collapsed state — small floating icon
  if (isCollapsed) {
    return (
      <div
        ref={panelRef}
        className="absolute z-30 pointer-events-auto"
        style={{
          left: position.x >= 0 ? `${position.x}px` : undefined,
          top: position.y >= 0 ? `${position.y}px` : undefined,
          right: position.x < 0 ? "16px" : undefined,
        }}
      >
        <button
          onClick={() => setIsCollapsed(false)}
          className="w-12 h-12 rounded-2xl bg-black/60 backdrop-blur-2xl text-white/80 hover:text-white hover:bg-black/80 flex items-center justify-center transition-all shadow-[0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 hover:scale-105 active:scale-95"
          title="Show Teleprompter"
        >
          <ScrollText className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div
      ref={panelRef}
      className="absolute z-30 pointer-events-auto"
      style={{
        left: position.x >= 0 ? `${position.x}px` : undefined,
        top: position.y >= 0 ? `${position.y}px` : undefined,
        right: position.x < 0 ? "16px" : undefined,
        width: "340px",
        maxHeight: "calc(100% - 120px)",
      }}
    >
      <div
        className={`flex flex-col rounded-2xl overflow-hidden shadow-[0_16px_64px_rgba(0,0,0,0.4)] ring-1 ring-white/[0.08] transition-all duration-500 ${
          isDragging ? "scale-[1.02] shadow-[0_20px_80px_rgba(0,0,0,0.5)]" : ""
        }`}
        style={{
          background:
            "linear-gradient(135deg, rgba(0,0,0,0.78) 0%, rgba(10,10,10,0.82) 100%)",
          backdropFilter: "blur(40px) saturate(180%)",
          WebkitBackdropFilter: "blur(40px) saturate(180%)",
        }}
      >
        {/* Header — Draggable */}
        <div
          className="flex items-center justify-between px-3 py-2.5 cursor-grab active:cursor-grabbing select-none border-b border-white/[0.06]"
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        >
          <div className="flex items-center gap-2">
            <GripVertical className="w-3.5 h-3.5 text-white/30" />
            <ScrollText className="w-3.5 h-3.5 text-white/50" />
            <span className="text-[11px] font-semibold text-white/50 uppercase tracking-widest">
              Teleprompter
            </span>
          </div>
          <div className="flex items-center gap-1">
            {/* Collapse */}
            <button
              onClick={() => setIsCollapsed(true)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/10 transition-all"
              title="Minimize"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            {/* Close */}
            <button
              onClick={onToggleVisibility}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-white/10 transition-all"
              title="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Timecode bar — shown when recording */}
        {isRecording && (
          <div className="px-3 py-1.5 flex items-center justify-between border-b border-white/[0.06] bg-red-500/5">
            <div className="flex items-center gap-2">
              <div
                className={`w-1.5 h-1.5 rounded-full bg-red-500 ${isPaused ? "" : "animate-pulse"}`}
              />
              <span className="text-[11px] font-mono text-red-400/90 tabular-nums tracking-wider">
                {formatTimecode(recordingTime)}
              </span>
            </div>
            {/* Progress */}
            <div className="flex items-center gap-2">
              <div className="w-16 h-1 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-red-500/60 rounded-full transition-all duration-300"
                  style={{ width: `${scrollProgress * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-white/30 tabular-nums">
                {Math.round(scrollProgress * 100)}%
              </span>
            </div>
          </div>
        )}

        {/* Edit / Read mode toggle */}
        {!isEditMode && scriptText.trim() && (
          <div className="px-3 py-1.5 flex items-center justify-between border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              {/* Play/Pause scroll */}
              <button
                onClick={toggleScroll}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  isScrolling
                    ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                    : "bg-white/10 text-white/70 hover:bg-white/15 hover:text-white"
                }`}
              >
                {isScrolling ? (
                  <Pause className="w-3 h-3" />
                ) : (
                  <Play className="w-3 h-3" />
                )}
                {isScrolling ? "Pause" : "Scroll"}
              </button>

              {/* Speed control */}
              <div className="flex items-center gap-1 ml-1">
                <button
                  onClick={() => setScrollSpeed(Math.max(1, scrollSpeed - 0.5))}
                  className="w-6 h-6 rounded-md flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/10 transition-all"
                >
                  <ChevronDown className="w-3 h-3" />
                </button>
                <span className="text-[10px] text-white/50 tabular-nums w-6 text-center font-mono">
                  {scrollSpeed.toFixed(1)}x
                </span>
                <button
                  onClick={() => setScrollSpeed(Math.min(5, scrollSpeed + 0.5))}
                  className="w-6 h-6 rounded-md flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/10 transition-all"
                >
                  <ChevronUp className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Font size & edit toggle */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setFontSize(Math.max(16, fontSize - 2))}
                className="w-6 h-6 rounded-md flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/10 transition-all text-[10px] font-bold"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize(Math.min(48, fontSize + 2))}
                className="w-6 h-6 rounded-md flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/10 transition-all text-[12px] font-bold"
              >
                A+
              </button>
              <div className="w-[1px] h-3 bg-white/10 mx-1" />
              <button
                onClick={() => {
                  setIsEditMode(true);
                  setIsScrolling(false);
                }}
                className="w-6 h-6 rounded-md flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/10 transition-all"
                title="Edit script"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Content area */}
        <div className="relative">
          {isEditMode ? (
            /* Edit mode — textarea */
            <div className="p-3">
              <textarea
                value={scriptText}
                onChange={(e) => setScriptText(e.target.value)}
                placeholder="Paste your script here...&#10;&#10;Type what you want to say on camera. The text will scroll at your chosen speed while you record."
                className="w-full h-[240px] bg-white/[0.04] rounded-xl px-4 py-3 text-[14px] text-white/80 placeholder:text-white/20 resize-none focus:outline-none focus:ring-1 focus:ring-white/20 border border-white/[0.06] transition-all font-sans leading-relaxed"
                style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}
              />
              <div className="flex items-center justify-between mt-2.5">
                <span className="text-[10px] text-white/25">
                  {scriptText.length > 0
                    ? `${scriptText.split(/\s+/).filter(Boolean).length} words`
                    : ""}
                </span>
                {scriptText.trim() && (
                  <button
                    onClick={switchToReadMode}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 text-[11px] font-semibold transition-all"
                  >
                    <Eye className="w-3 h-3" />
                    Start Reading
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Read mode — scrolling text */
            <>
              {/* Reading line highlight */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2em] pointer-events-none z-10"
                style={{
                  background: "linear-gradient(180deg, transparent 0%, rgba(59,130,246,0.06) 30%, rgba(59,130,246,0.08) 50%, rgba(59,130,246,0.06) 70%, transparent 100%)",
                  borderTop: "1px solid rgba(59,130,246,0.12)",
                  borderBottom: "1px solid rgba(59,130,246,0.12)",
                }}
              />

              {/* Fade gradients */}
              <div className="absolute inset-x-0 top-0 h-12 z-10 pointer-events-none"
                style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%)" }}
              />
              <div className="absolute inset-x-0 bottom-0 h-12 z-10 pointer-events-none"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)" }}
              />

              <div
                ref={scrollContainerRef}
                onScroll={handleManualScroll}
                className="overflow-y-auto px-5 py-10"
                style={{
                  height: "320px",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                {/* Top padding so first line starts at center */}
                <div style={{ height: "140px" }} />
                <p
                  className="text-white/90 leading-[1.7] whitespace-pre-wrap font-medium"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {scriptText}
                </p>
                {/* Bottom padding so last line can reach center */}
                <div style={{ height: "140px" }} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
