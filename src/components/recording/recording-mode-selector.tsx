"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Video, Monitor, User } from "lucide-react";
import { RecordingMode } from "@/lib/recording-state";

interface RecordingModeSelectorProps {
  currentMode: RecordingMode;
  onModeChange: (mode: RecordingMode) => void;
  disabled?: boolean;
  isRecording?: boolean;
}

export function RecordingModeSelector({
  currentMode,
  onModeChange,
  disabled = false,
  isRecording = false,
}: RecordingModeSelectorProps) {
  return (
    <div className="flex items-center gap-3 p-1 bg-zinc-100 dark:bg-zinc-800/50 rounded-2xl backdrop-blur-sm">
      <Button
        type="button"
        variant="ghost"
        onClick={() => onModeChange(RecordingMode.CAMERA_ONLY)}
        disabled={disabled}
        className={`
          flex-1 gap-2 h-12 rounded-xl transition-all duration-300
          ${currentMode === RecordingMode.CAMERA_ONLY
            ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-md"
            : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <div className="flex items-center justify-center gap-2">
          <div className="relative">
            <Video className="w-5 h-5" />
            <User className="w-3 h-3 absolute -bottom-1 -right-1 bg-zinc-100 dark:bg-zinc-800 rounded-full p-0.5" />
          </div>
          <span className="font-medium text-sm">Camera</span>
        </div>
      </Button>

      <Button
        type="button"
        variant="ghost"
        onClick={() => onModeChange(RecordingMode.SCREEN_WITH_PIP)}
        disabled={disabled}
        className={`
          flex-1 gap-2 h-12 rounded-xl transition-all duration-300
          ${currentMode === RecordingMode.SCREEN_WITH_PIP
            ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-md"
            : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <div className="flex items-center justify-center gap-2">
          <div className="relative">
            <Monitor className="w-5 h-5" />
            <User className="w-3 h-3 absolute -bottom-1 -right-1 bg-zinc-100 dark:bg-zinc-800 rounded-full p-0.5" />
          </div>
          <span className="font-medium text-sm">Screen + Camera</span>
        </div>
      </Button>
    </div>
  );
}

/**
 * Compact badge showing current recording mode
 * Used during recording when mode switching is disabled
 */
interface RecordingModeBadgeProps {
  mode: RecordingMode;
  className?: string;
}

export function RecordingModeBadge({ mode, className = "" }: RecordingModeBadgeProps) {
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 ${className}`}>
      {mode === RecordingMode.CAMERA_ONLY ? (
        <>
          <Video className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">Camera Only</span>
        </>
      ) : (
        <>
          <Monitor className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">Screen + Camera PIP</span>
        </>
      )}
    </div>
  );
}
