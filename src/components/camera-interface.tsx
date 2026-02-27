"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  RotateCcw,
  Square as SquareIcon,
  Circle,
  Frame,
  FlipHorizontal,
  Play,
  Pause,
  Check,
  RefreshCcw,
  ScrollText
} from "lucide-react";
import { Teleprompter } from "@/components/teleprompter";
import { CameraToolbar } from "@/components/camera-toolbar";

export interface FilterSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  grayscale: boolean;
  sepia: boolean;
  invert: boolean;
  blur: number;
  hueRotate: number;
  beauty: boolean;
  flipHorizontal: boolean; // Kept for compatibility with video-editor
}

export type FrameType = "none" | "circle" | "square" | "rounded" | "film";

const DEFAULT_FILTERS: FilterSettings = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  grayscale: false,
  sepia: false,
  invert: false,
  blur: 0,
  hueRotate: 0,
  beauty: false,
  flipHorizontal: true, // Default to true! How users see themselves in the mirror
};

export const FILTERS = [
  { name: "Original", filters: DEFAULT_FILTERS, bgClass: "bg-gradient-to-br from-zinc-200 to-zinc-300" },
  { name: "Studio", filters: { ...DEFAULT_FILTERS, brightness: 108, contrast: 105 }, bgClass: "bg-gradient-to-br from-blue-100 to-blue-200" },
  { name: "B&W", filters: { ...DEFAULT_FILTERS, grayscale: true, contrast: 110 }, bgClass: "bg-gradient-to-br from-zinc-400 to-zinc-600" },
  { name: "Cinematic", filters: { ...DEFAULT_FILTERS, brightness: 90, contrast: 120, saturation: 80 }, bgClass: "bg-gradient-to-br from-slate-400 to-slate-500" },
  { name: "Soft", filters: { ...DEFAULT_FILTERS, beauty: true, brightness: 105, contrast: 95 }, bgClass: "bg-gradient-to-br from-rose-100 to-teal-100" },
  { name: "Warm", filters: { ...DEFAULT_FILTERS, sepia: true, saturation: 110, brightness: 105 }, bgClass: "bg-gradient-to-br from-amber-200 to-orange-200" },
];

export const FRAMES = [
  { type: "none" as FrameType, name: "Full", icon: Frame },
  { type: "square" as FrameType, name: "Square", icon: SquareIcon },
  { type: "circle" as FrameType, name: "Circle", icon: Circle },
  { type: "rounded" as FrameType, name: "Rounded", icon: Frame },
];

interface CameraInterfaceProps {
  onVideoComplete: (
    blob: Blob,
    duration: number,
    filters: FilterSettings,
    frame: FrameType,
    reverse: boolean
  ) => void;
  inline?: boolean;
}

export function CameraInterface({
  onVideoComplete,
  inline = false,
}: CameraInterfaceProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState(0);
  const [frame, setFrame] = useState<FrameType>("none");
  const [activeMode, setActiveMode] = useState<'filters' | 'frames'>('filters');
  const [isMirrored, setIsMirrored] = useState(true);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showTeleprompter, setShowTeleprompter] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function initCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720, facingMode: "user" },
          audio: true,
        });
        setStream(mediaStream);
        if (videoRef.current && !recordedBlob) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    }
    initCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 100);
      }, 100);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, isPaused]);

  // Apply filters and flip to video
  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      const f = FILTERS[selectedFilter].filters;

      let filterString = `brightness(${f.brightness}%) contrast(${f.contrast}%) saturate(${f.saturation}%)`;
      if (f.grayscale) filterString += " grayscale(100%)";
      if (f.sepia) filterString += " sepia(100%)";
      if (f.invert) filterString += " invert(100%)";
      if (f.blur > 0) filterString += ` blur(${f.blur}px)`;
      if (f.hueRotate > 0) filterString += ` hue-rotate(${f.hueRotate}deg)`;
      if (f.beauty) filterString = `brightness(105%) contrast(95%) saturate(95%)`;

      video.style.filter = filterString;

      // Apply flip (mirror effect)
      if (isMirrored) {
        video.style.transform = "scaleX(-1)";
      } else {
        video.style.transform = "scaleX(1)";
      }
    }
  }, [selectedFilter, isMirrored]);

  const startCanvasRecording = () => {
    if (!videoRef.current || !canvasRef.current || !stream) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas size to match video
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    // Capture stream from canvas
    const canvasStream = canvas.captureStream(30);

    // Add audio track from original stream
    const audioTrack = stream.getAudioTracks()[0];
    if (audioTrack && audioEnabled) {
      canvasStream.addTrack(audioTrack);
    }

    chunksRef.current = [];
    
    // Choose best supported mimeType for cross-browser
    let mimeType = 'video/webm';
    if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')) {
      mimeType = 'video/webm;codecs=vp9,opus';
    } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')) {
      mimeType = 'video/webm;codecs=vp8,opus';
    } else if (MediaRecorder.isTypeSupported('video/mp4')) {
      mimeType = 'video/mp4';
    }

    const recorder = new MediaRecorder(canvasStream, { mimeType });

    let animationId: number;

    // Draw frames to canvas with flip effect
    const drawFrame = () => {
      if (!ctx || !canvas) return;
      if (recorder.state === 'inactive') return; // Stop drawing when recorder stops

      // Apply filters
      const f = FILTERS[selectedFilter].filters;
      let filterString = `brightness(${f.brightness}%) contrast(${f.contrast}%) saturate(${f.saturation}%)`;
      if (f.grayscale) filterString += " grayscale(100%)";
      if (f.sepia) filterString += " sepia(100%)";
      if (f.invert) filterString += " invert(100%)";
      if (f.blur > 0) filterString += ` blur(${f.blur}px)`;
      if (f.hueRotate > 0) filterString += ` hue-rotate(${f.hueRotate}deg)`;
      if (f.beauty) filterString = `brightness(105%) contrast(95%) saturate(95%)`;

      ctx.filter = filterString;

      // Draw video flipped horizontally or normally
      ctx.save();
      if (isMirrored) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      ctx.restore();

      if (recorder.state === 'recording') {
        animationId = requestAnimationFrame(drawFrame);
      } else if (recorder.state === 'paused') {
        // if paused, still request frame so it can check later, or we can just pause the loop. 
        // Better to keep loop running slowly or just resume later. For now, loop keeps spinning.
        animationId = requestAnimationFrame(drawFrame);
      }
    };

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    recorder.onstop = () => {
      cancelAnimationFrame(animationId);
      const blob = new Blob(chunksRef.current, { type: chunksRef.current[0]?.type || mimeType });
      setRecordedBlob(blob);
    };

    mediaRecorderRef.current = recorder;
    recorder.start();
    setIsRecording(true);
    setRecordingTime(0);
    
    // Start drawing frame loop
    animationId = requestAnimationFrame(drawFrame);
  };

  const startRecording = () => {
    if (!stream || countdown !== null) return;
    
    // Start 3-second countdown
    setCountdown(3);
    
    let currentCount = 3;
    const countInterval = setInterval(() => {
      currentCount -= 1;
      if (currentCount > 0) {
        setCountdown(currentCount);
      } else {
        clearInterval(countInterval);
        setCountdown(null);
        // We always use Canvas recording to embed filters/mirror state easily
        startCanvasRecording();
      }
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  const resetRecording = () => {
    setRecordedBlob(null);
    setRecordingTime(0);
    setIsPaused(false);
  };

  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={
        inline
          ? "relative flex flex-col w-full h-full min-h-[500px] sm:min-h-[600px] bg-[#F5F5F7] dark:bg-[#0A0A0A] rounded-[2.5rem] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.08)] ring-1 ring-black/5 dark:ring-white/10"
          : "fixed inset-0 bg-[#F5F5F7] dark:bg-[#0A0A0A] flex flex-col z-50 selection:bg-transparent"
      }
    >
      <canvas ref={canvasRef} className="hidden" />

      {/* Main Camera / Video Output */}
      <div className="absolute inset-0 flex items-center justify-center bg-zinc-200 dark:bg-zinc-900 pointer-events-none overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className={`
            transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] object-cover
            ${frame === 'none' ? 'w-full h-full' : ''}
            ${frame === 'circle' ? 'aspect-square w-[80vmin] h-[80vmin] rounded-full shadow-[0_30px_60px_rgba(0,0,0,0.15)] ring-4 ring-white/20' : ''}
            ${frame === 'square' ? 'aspect-square w-[85vmin] h-[85vmin] rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.12)]' : ''}
            ${frame === 'rounded' ? 'w-[92%] h-[92%] rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.1)]' : ''}
          `}
        />
        
        {/* Dim overlay when recorded blob is present for better UI contrast */}
        {recordedBlob && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-all" />
        )}
      </div>

      {/* Top Floating Controls */}
      <div className="absolute top-6 inset-x-0 flex justify-center z-20 pointer-events-none">
        <div className="flex items-center gap-1.5 bg-white/70 dark:bg-black/60 backdrop-blur-xl px-4 py-2 rounded-full shadow-sm ring-1 ring-black/5 dark:ring-white/10 pointer-events-auto transition-transform hover:scale-[1.02]">
          <Button
            onClick={toggleAudio}
            variant="ghost"
            size="icon"
            className={`w-10 h-10 rounded-full transition-all ${!audioEnabled ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'hover:bg-black/5 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-200'}`}
          >
            {audioEnabled ? <Mic className="w-[18px] h-[18px]" /> : <MicOff className="w-[18px] h-[18px]" />}
          </Button>
          <Button
            onClick={toggleVideo}
            variant="ghost"
            size="icon"
            className={`w-10 h-10 rounded-full transition-all ${!videoEnabled ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'hover:bg-black/5 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-200'}`}
          >
            {videoEnabled ? <Video className="w-[18px] h-[18px]" /> : <VideoOff className="w-[18px] h-[18px]" />}
          </Button>
          <div className="w-[1px] h-4 bg-zinc-300 dark:bg-zinc-700 mx-1" />
          <Button
            onClick={() => setIsMirrored(!isMirrored)}
            variant="ghost"
            size="icon"
            className={`w-10 h-10 rounded-full transition-colors ${
              isMirrored
                ? "bg-[#0066FF]/10 text-[#0066FF] hover:bg-[#0066FF]/20"
                : "hover:bg-black/5 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-200"
            }`}
            title="Mirror Camera"
          >
            <FlipHorizontal className="w-[18px] h-[18px]" />
          </Button>
          <div className="w-[1px] h-4 bg-zinc-300 dark:bg-zinc-700 mx-1" />
          <Button
            onClick={() => setShowTeleprompter(!showTeleprompter)}
            variant="ghost"
            size="icon"
            className={`w-10 h-10 rounded-full transition-colors ${
              showTeleprompter
                ? "bg-[#0066FF]/10 text-[#0066FF] hover:bg-[#0066FF]/20"
                : "hover:bg-black/5 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-200"
            }`}
            title="Teleprompter"
          >
            <ScrollText className="w-[18px] h-[18px]" />
          </Button>
        </div>
      </div>

      {/* Recording Timer */}
      {isRecording && !recordedBlob && (
        <div className="absolute top-[88px] left-1/2 -translate-x-1/2 flex items-center gap-2.5 bg-red-500/15 backdrop-blur-md px-3.5 py-1.5 rounded-full ring-1 ring-red-500/20 z-20">
          <div className={`w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)] ${isPaused ? '' : 'animate-pulse'}`} />
          <span className="text-red-500 font-semibold text-sm tabular-nums tracking-wider leading-none">
            {formatTime(recordingTime)}
          </span>
        </div>
      )}

      {/* Teleprompter Panel */}
      {!recordedBlob && (
        <Teleprompter
          isRecording={isRecording}
          isPaused={isPaused}
          recordingTime={recordingTime}
          isVisible={showTeleprompter}
          onToggleVisibility={() => setShowTeleprompter(false)}
        />
      )}

      {/* Bottom Controls */}
      <div className="absolute bottom-0 inset-x-0 pt-32 pb-10 px-6 z-20 flex flex-col items-center bg-gradient-to-t from-black/20 via-black/5 to-transparent">
        
        {/* Settings Carousel - Only show when not recording/previewing */}
        {!isRecording && !recordedBlob && (
          <CameraToolbar
            activeMode={activeMode}
            setActiveMode={setActiveMode}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            frame={frame}
            setFrame={setFrame}
          />
        )}

        {/* Countdown Overlay */}
        {countdown !== null && (
          <div className="absolute inset-0 flex items-center justify-center z-40 bg-black/20 backdrop-blur-[2px]">
            <span key={countdown} className="text-[120px] font-bold text-white drop-shadow-[0_0_40px_rgba(0,0,0,0.3)] animate-in zoom-in-50 duration-300">
              {countdown}
            </span>
          </div>
        )}

        {/* Record/Action Area */}
        <div className="flex items-center justify-center h-24 pointer-events-auto w-full max-w-md relative z-30">
          {!isRecording ? (
            recordedBlob ? (
              // Actions after recording
              <div className="flex justify-center gap-6 items-center w-full fade-in flex-row duration-500">
                <Button
                  onClick={resetRecording}
                  className="w-14 h-14 rounded-full bg-white/30 dark:bg-black/40 backdrop-blur-xl hover:bg-white dark:hover:bg-zinc-800 text-zinc-900 dark:text-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center justify-center transition-all hover:-rotate-12 hover:scale-105"
                >
                  <RefreshCcw className="w-5 h-5 opacity-80" />
                </Button>
                <Button
                  onClick={() => {
                      if (onVideoComplete) {
                          onVideoComplete(
                              recordedBlob,
                              recordingTime,
                              { ...FILTERS[selectedFilter].filters, flipHorizontal: isMirrored },
                              frame,
                              false
                          );
                      }
                  }}
                  className="h-14 px-8 rounded-full bg-black text-white dark:bg-white dark:text-black font-semibold text-[15px] shadow-[0_12px_30px_rgba(0,0,0,0.15)] transition-all hover:scale-105 hover:bg-zinc-900 dark:hover:bg-zinc-100 group"
                >
                  Finish Editing
                  <div className="w-6 h-6 rounded-full bg-white/20 dark:bg-black/10 flex items-center justify-center ml-2 group-hover:bg-white/30 dark:group-hover:bg-black/20 transition-colors">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                </Button>
              </div>
            ) : (
              // Apple-style record button
              <button
                onClick={startRecording}
                className="relative flex items-center justify-center group z-50 pointer-events-auto"
              >
                <div className="w-[72px] h-[72px] rounded-full border-[3px] border-white/90 dark:border-zinc-300/90 shadow-[0_4px_24px_rgba(0,0,0,0.1)] transition-transform duration-300 group-hover:scale-[1.03]" />
                <div className="absolute w-[60px] h-[60px] rounded-full bg-[#FF3B30] transition-all duration-300 group-hover:bg-[#FF453A] group-active:scale-95 shadow-inner" />
              </button>
            )
          ) : (
            // Active recording state controls
            <div className="flex items-center justify-center gap-8 fade-in duration-300 w-full z-50">
              <button
                onClick={stopRecording}
                className="relative flex items-center justify-center group pointer-events-auto"
              >
                <div className="w-[72px] h-[72px] rounded-full border-[3px] border-white/80 dark:border-zinc-300/80 shadow-[0_4px_24px_rgba(0,0,0,0.1)] transition-transform duration-300 group-hover:scale-[1.03]" />
                <div className="absolute w-[32px] h-[32px] rounded-lg bg-[#FF3B30] transition-all duration-300 group-hover:bg-[#FF453A] group-active:scale-95 shadow-inner" />
              </button>
              
              <Button
                onClick={isPaused ? resumeRecording : pauseRecording}
                className="absolute right-8 sm:right-12 w-14 h-14 rounded-full bg-white/30 dark:bg-black/40 backdrop-blur-xl hover:bg-white dark:hover:bg-zinc-800 text-zinc-900 dark:text-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center justify-center transition-all hover:scale-105 pointer-events-auto"
              >
                {isPaused ? <Play className="w-5 h-5 opacity-90 ml-1" /> : <Pause className="w-5 h-5 opacity-90" />}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
