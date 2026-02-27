"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Play, Pause, SkipBack, SkipForward, Download, Link as LinkIcon, Calendar, FlipHorizontal, Sparkles } from 'lucide-react'
import { FilterSettings, FrameType } from './camera-interface'

interface VideoEditorProps {
  videoBlob: Blob
  duration: number
  filters: FilterSettings
  onSave: (data: VideoCardData) => void
}

export interface VideoCardData {
  title: string
  agenda: string
  callToAction: string
  calendlyUrl: string
  videoUrl: string
  trimStart: number
  trimEnd: number
  filters: FilterSettings
  frame: FrameType
  flipHorizontal?: boolean
}

export function VideoEditor({ videoBlob, duration, filters, onSave }: VideoEditorProps) {
  const [title, setTitle] = useState('')
  const [agenda, setAgenda] = useState('')
  const [callToAction, setCallToAction] = useState('')
  const [calendlyUrl, setCalendlyUrl] = useState('')
  const [trimStart, setTrimStart] = useState([0])
  const [trimEnd, setTrimEnd] = useState([duration])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)

  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoUrl] = useState(() => URL.createObjectURL(videoBlob))
  const playPromiseRef = useRef<Promise<void> | null>(null)

  // The filters and mirror effect are already burned into the WebM blob from the canvas recording.
  // There is no need to apply CSS scaleX or CSS filters here, doing so would double-apply them!

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = trimStart[0] / 1000
    }
  }, [trimStart])

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const togglePlay = async () => {
    if (videoRef.current) {
      try {
        if (playPromiseRef.current) {
          await playPromiseRef.current.catch(() => {})
        }
        videoRef.current.pause()
        videoRef.current.currentTime = trimStart[0] / 1000
        if (!isPlaying) {
          playPromiseRef.current = videoRef.current.play()
          await playPromiseRef.current
        }
        setIsPlaying(!isPlaying)
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.warn('Play error:', err)
        }
      }
    }
  }

  const skip = (amount: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        trimStart[0] / 1000,
        Math.min(trimEnd[0] / 1000, videoRef.current.currentTime + amount)
      )
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime * 1000
      setCurrentTime(time)
      if (time >= trimEnd[0]) {
        videoRef.current.pause()
        videoRef.current.currentTime = trimStart[0] / 1000
        setIsPlaying(false)
      }
    }
  }

  const handleSave = () => {
    const data: VideoCardData = {
      title,
      agenda,
      callToAction,
      calendlyUrl,
      videoUrl,
      trimStart: trimStart[0],
      trimEnd: trimEnd[0],
      filters,
      frame: 'none',
      flipHorizontal: filters.flipHorizontal,
    }
    onSave(data)
  }

  const handleDownload = () => {
    const a = document.createElement('a')
    a.href = videoUrl
    a.download = `video-${Date.now()}.webm`
    a.click()
  }

  return (
    <div className="grid lg:grid-cols-[1fr_400px] gap-8 w-full max-w-6xl mx-auto items-start fade-in duration-700 mt-8">
      
      {/* Left: Video Player Area */}
      <div className="flex flex-col gap-6 w-full lg:max-w-[700px] mx-auto">
        <div className="relative w-full aspect-[9/16] sm:aspect-[4/5] bg-zinc-100 dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.12)] ring-1 ring-black/5 dark:ring-white/10 group isolation-auto">
          {/* Top floating badges */}
          {filters.flipHorizontal && (
            <div className="absolute top-6 left-6 z-10 pointer-events-none">
              <Badge variant="secondary" className="bg-white/80 dark:bg-black/60 text-zinc-900 dark:text-white backdrop-blur-xl border-white/20 dark:border-white/10 px-3.5 py-1.5 font-semibold tracking-wide shadow-sm">
                <FlipHorizontal className="w-3.5 h-3.5 mr-1.5 opacity-80" />
                Mirror Match
              </Badge>
            </div>
          )}

          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-contain transition-transform duration-700"
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
          />

          {/* Floating Player Controls (appears on hover or when paused) */}
          <div className={`absolute bottom-6 inset-x-6 z-10 transition-all duration-500 ease-out ${isPlaying ? 'opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0' : 'opacity-100 translate-y-0'}`}>
            <div className="bg-white/90 dark:bg-black/80 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-3xl p-4 flex flex-col gap-4 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
              <div className="flex items-center justify-between gap-4">
                <Button onClick={togglePlay} size="icon" className="w-[52px] h-[52px] rounded-full bg-black text-white dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-transform hover:scale-105 shrink-0 shadow-lg border-2 border-white/5 dark:border-black/5">
                  {isPlaying ? <Pause className="w-[22px] h-[22px]" /> : <Play className="w-[22px] h-[22px] ml-1" />}
                </Button>

                <div className="flex items-center gap-1.5">
                  <Button onClick={() => skip(-5)} variant="ghost" size="icon" className="text-zinc-700 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/10 rounded-full h-11 w-11 transition-colors">
                    <SkipBack className="w-5 h-5" />
                  </Button>
                  <Button onClick={() => skip(5)} variant="ghost" size="icon" className="text-zinc-700 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/10 rounded-full h-11 w-11 transition-colors">
                    <SkipForward className="w-5 h-5" />
                  </Button>
                </div>

                <div className="ml-auto text-[14px] font-bold tracking-wide text-zinc-900 dark:text-white tabular-nums">
                  {formatTime(currentTime)} <span className="text-zinc-400 dark:text-zinc-500 font-medium mx-1">/</span> {formatTime(trimEnd[0] - trimStart[0])}
                </div>
                
                <Button onClick={handleDownload} variant="ghost" size="icon" className="text-zinc-700 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/10 rounded-full h-11 w-11 ml-2 transition-colors" title="Download Source Video">
                  <Download className="w-[18px] h-[18px]" />
                </Button>
              </div>

              {/* Minimalist Trimmer */}
              <div className="pt-2 px-3 pb-3 space-y-5">
                <div className="relative h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full w-full overflow-hidden">
                  <div 
                    className="absolute h-full bg-[#0066FF] rounded-full shadow-[0_0_10px_rgba(0,102,255,0.4)]" 
                    style={{ 
                      left: `${(trimStart[0] / duration) * 100}%`, 
                      right: `${100 - (trimEnd[0] / duration) * 100}%` 
                    }} 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label className="text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-bold ml-1">Trim Start</Label>
                    <Slider
                      value={trimStart}
                      onValueChange={setTrimStart}
                      max={Math.min(duration, trimEnd[0] - 100)}
                      step={100}
                      className="cursor-w-resize active:cursor-move [&_[role=slider]]:bg-white dark:[&_[role=slider]]:bg-zinc-200 [&_[role=slider]]:border-[4px] [&_[role=slider]]:border-[#0066FF] [&_[role=slider]]:shadow-[0_4px_12px_rgba(0,0,0,0.15)] [&_[role=slider]]:w-[22px] [&_[role=slider]]:h-[22px] [&_[role=slider]]:ring-offset-0 [&_[role=slider]]:ring-0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-bold ml-1">Trim End</Label>
                    <Slider
                      value={trimEnd}
                      onValueChange={setTrimEnd}
                      min={Math.max(0, trimStart[0] + 100)}
                      max={duration}
                      step={100}
                      className="cursor-e-resize active:cursor-move [&_[role=slider]]:bg-white dark:[&_[role=slider]]:bg-zinc-200 [&_[role=slider]]:border-[4px] [&_[role=slider]]:border-[#0066FF] [&_[role=slider]]:shadow-[0_4px_12px_rgba(0,0,0,0.15)] [&_[role=slider]]:w-[22px] [&_[role=slider]]:h-[22px] [&_[role=slider]]:ring-offset-0 [&_[role=slider]]:ring-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-2.5 px-4 py-2 text-[14px] text-zinc-500 font-medium">
          <Sparkles className="w-4 h-4 text-[#0066FF]" />
          Review your video. Drag the sliders to trim out bad takes.
        </div>
      </div>

      {/* Right: Settings / Details Pane */}
      <div className="bg-white/60 dark:bg-[#111]/80 backdrop-blur-3xl rounded-[2.5rem] p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-black/5 dark:border-white/5 flex flex-col h-full ring-1 ring-black/5 dark:ring-white/10 relative overflow-hidden">
        {/* Subtle decorative blob */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/5 dark:bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 mb-10">
          <h2 className="text-[1.75rem] font-bold tracking-tight text-[#111] dark:text-[#F3F3F3] leading-tight">
            Video Settings
          </h2>
          <p className="text-[15px] text-zinc-500 mt-2 font-medium">
            Customize the pitch page where clients view this video.
          </p>
        </div>

        <div className="space-y-8 flex-1 relative z-10">
          <div className="space-y-2.5 group">
            <Label htmlFor="title" className="text-[12px] uppercase tracking-wider text-zinc-400 font-bold group-focus-within:text-[#0066FF] transition-colors ml-1">Page Headline</Label>
            <Input
              id="title"
              placeholder="e.g. Exclusive partnership for Acme Corp"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-[16px] bg-zinc-100/50 dark:bg-zinc-900/50 border-0 border-b-2 border-zinc-200 dark:border-zinc-800 rounded-t-xl rounded-b-none px-4 focus-visible:ring-0 focus-visible:border-[#0066FF] focus-visible:bg-zinc-100 dark:focus-visible:bg-zinc-900 transition-all h-14 font-semibold text-zinc-900 dark:text-zinc-100 placeholder:font-medium placeholder:text-zinc-400"
            />
          </div>

          <div className="space-y-2.5 group">
            <Label htmlFor="agenda" className="text-[12px] uppercase tracking-wider text-zinc-400 font-bold group-focus-within:text-[#0066FF] transition-colors ml-1">Agenda Points</Label>
            <div className="relative">
              <Textarea
                id="agenda"
                placeholder="• Introduction&#10;• Why we match&#10;• Next Steps"
                value={agenda}
                onChange={(e) => setAgenda(e.target.value)}
                rows={4}
                className="resize-none text-[15px] bg-zinc-100/50 dark:bg-zinc-900/50 border-0 border-b-2 border-zinc-200 dark:border-zinc-800 rounded-t-xl rounded-b-none px-4 focus-visible:ring-0 focus-visible:border-[#0066FF] focus-visible:bg-zinc-100 dark:focus-visible:bg-zinc-900 transition-all py-3.5 font-medium leading-relaxed text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 placeholder:whitespace-pre-wrap"
              />
            </div>
            <p className="text-[13px] text-zinc-400 font-medium ml-1 pt-1">
              Used to summarize the video points.
            </p>
          </div>

          <div className="space-y-2.5 group">
            <Label htmlFor="calendly" className="text-[12px] uppercase tracking-wider text-zinc-400 font-bold group-focus-within:text-[#0066FF] transition-colors ml-1">Booking Link (Optional)</Label>
            <div className="relative flex items-center bg-zinc-100/50 dark:bg-zinc-900/50 border-b-2 border-zinc-200 dark:border-zinc-800 rounded-t-xl focus-within:border-[#0066FF] focus-within:bg-zinc-100 dark:focus-within:bg-zinc-900 transition-all pl-4">
              <LinkIcon className="w-5 h-5 text-zinc-400 shrink-0 group-focus-within:text-[#0066FF] transition-colors" />
              <Input
                id="calendly"
                placeholder="cal.com/your-name"
                value={calendlyUrl}
                onChange={(e) => setCalendlyUrl(e.target.value)}
                className="text-[15px] border-0 bg-transparent px-3 focus-visible:ring-0 h-14 font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
              />
            </div>
          </div>

          <div className="space-y-2.5 group">
            <Label htmlFor="cta" className="text-[12px] uppercase tracking-wider text-zinc-400 font-bold group-focus-within:text-[#0066FF] transition-colors ml-1">Call to Action text</Label>
            <Input
              id="cta"
              placeholder="Book a Strategy Call"
              value={callToAction}
              onChange={(e) => setCallToAction(e.target.value)}
              className="text-[15px] bg-zinc-100/50 dark:bg-zinc-900/50 border-0 border-b-2 border-zinc-200 dark:border-zinc-800 rounded-t-xl rounded-b-none px-4 focus-visible:ring-0 focus-visible:border-[#0066FF] focus-visible:bg-zinc-100 dark:focus-visible:bg-zinc-900 transition-all h-14 font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
            />
          </div>
        </div>

        <div className="pt-8 relative z-10 w-full mt-auto">
          <Button
            onClick={handleSave}
            disabled={!title || !agenda}
            className="w-full bg-[#111] dark:bg-white text-white dark:text-[#111] hover:bg-black dark:hover:bg-zinc-200 rounded-[1.25rem] h-[60px] text-[16px] font-bold shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition-all hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100 disabled:shadow-none"
          >
            Generate Pitch Page
            <Sparkles className="w-[18px] h-[18px] ml-2 opacity-50" />
          </Button>
        </div>
      </div>
    </div>
  )
}
