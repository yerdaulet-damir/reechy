"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Play, Pause, SkipBack, SkipForward, Download, Link as LinkIcon, Calendar, FlipHorizontal, Sparkles, Loader2, Check, Copy, Linkedin, Mail, Send } from 'lucide-react'
import { FilterSettings, FrameType } from './camera-interface'
import { toast } from 'sonner'
import { createShareableLink } from '@/actions/share'
import posthog from 'posthog-js'

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
  shareUrl?: string
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

  const [isUploading, setIsUploading] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [copied, setCopied] = useState(false)

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

  const handleSave = async () => {
    try {
      setIsUploading(true)
      posthog?.capture('pitch_generating')
      
      // 1. Get Presigned URL
      const res = await fetch('/api/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileType: 'video/webm' }),
      })
      
      const { uploadUrl, publicUrl } = await res.json()
      
      if (!uploadUrl) throw new Error('Failed to get upload URL')

      // 2. Upload directly to Cloudflare R2
      await fetch(uploadUrl, {
        method: 'PUT',
        body: videoBlob,
        headers: {
          'Content-Type': 'video/webm',
        },
      })

      // 3. Save to Upstash Redis with all user parameters
      const result = await createShareableLink({
        videoUrl: publicUrl,
        title,
        agenda,
        callToAction,
        calendlyUrl,
        trimStart: trimStart[0]
      })
      
      if (!result.success || !result.id) {
        throw new Error('Failed to create share link')
      }

      // 4. Generate the final shareable URL & copy it
      const finalUrl = `${window.location.origin}/v/${result.id}`
      setShareUrl(finalUrl)
      
      try {
        await navigator.clipboard.writeText(finalUrl)
        setCopied(true)
        toast.success('Link copied to clipboard!')
        setTimeout(() => setCopied(false), 3000)
      } catch (clipboardErr) {
        console.warn('Failed to copy to clipboard:', clipboardErr)
        // We do not throw here so that the upload flow completes successfully
      }

      const data: VideoCardData = {
        title,
        agenda,
        callToAction,
        calendlyUrl,
        videoUrl: publicUrl, // use the public R2 URL now
        trimStart: trimStart[0],
        trimEnd: trimEnd[0],
        filters,
        frame: 'none',
        flipHorizontal: filters.flipHorizontal,
        shareUrl: finalUrl,
      }
      onSave(data)
    } catch (error) {
      console.error('Upload Error:', error)
      toast.error('Failed to generate pitch page. Please try again.')
    } finally {
      setIsUploading(false)
    }
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

        <div className="pt-8 relative z-10 w-full mt-auto flex flex-col gap-3">
          {!shareUrl && (
            <Button
              onClick={handleSave}
              disabled={!title || isUploading}
              className="w-full bg-[#111] dark:bg-white text-white dark:text-[#111] hover:bg-black dark:hover:bg-zinc-200 rounded-[1.25rem] h-[60px] text-[16px] font-bold shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition-all hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100 disabled:shadow-none"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-[18px] h-[18px] mr-2 animate-spin" />
                  Uploading Serverless...
                </>
              ) : (
                <>
                  Create Shareable Link
                  <Sparkles className="w-[18px] h-[18px] ml-2 opacity-50" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Full-width Success State (Appears below everything when done) */}
      {shareUrl && (
        <div className="col-span-1 lg:col-span-2 mt-4 animate-in fade-in slide-in-from-bottom-8 duration-700 w-full">
            <div className="bg-white dark:bg-[#111] border border-black/5 dark:border-white/10 p-8 sm:p-10 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.06)] relative overflow-hidden flex flex-col">
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                  <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center shrink-0 border border-green-500/20 shadow-sm mx-auto sm:mx-0">
                      <Check className="w-7 h-7 text-green-600 dark:text-green-500" />
                  </div>
                  <div>
                      <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111] dark:text-[#F3F3F3]">
                        Pitch Delivered
                      </h2>
                      <p className="text-zinc-600 dark:text-zinc-400 text-[15px] sm:text-[16px] mt-1 font-medium max-w-md">
                        Your cinematic page is live. Copy the link or distribute directly to your prospect.
                      </p>
                  </div>
                </div>
              </div>

              {/* Big Link Copy Box */}
              <div className="flex flex-col sm:flex-row items-center w-full bg-zinc-50 dark:bg-zinc-900/50 p-2.5 pl-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-inner group transition-all focus-within:border-[#0066FF]/50 hover:border-zinc-300 dark:hover:border-zinc-700 mb-8 max-w-3xl">
                  <LinkIcon className="w-5 h-5 text-zinc-400 shrink-0 mr-3 hidden sm:block" />
                  <input 
                    readOnly
                    value={shareUrl}
                    className="flex-1 bg-transparent border-0 outline-none text-[15px] sm:text-[17px] font-mono font-medium text-[#111] dark:text-white truncate w-full cursor-text text-center sm:text-left py-2 sm:py-0"
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                  />
                  <Button 
                    onClick={() => {
                      navigator.clipboard.writeText(shareUrl)
                      setCopied(true)
                      toast.success('Link copied to clipboard!')
                      setTimeout(() => setCopied(false), 2000)
                    }}
                    className="w-full sm:w-auto mt-2 sm:mt-0 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white shadow-[0_8px_20px_rgba(0,102,255,0.25)] h-14 px-8 transition-all text-[15px] font-bold shrink-0 hover:scale-[1.02]"
                  >
                    {copied ? (
                      <><Check className="w-5 h-5 mr-2" />Copied!</>
                    ) : (
                      <><Copy className="w-5 h-5 mr-2" />Copy Link</>
                    )}
                  </Button>
              </div>

              {/* Social Shares */}
              <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800/50">
                 <p className="text-[12px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-5 ml-1 text-center sm:text-left">Distribute directly</p>
                 <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                    <Button variant="outline" className="h-12 w-12 sm:w-auto sm:px-6 rounded-xl border-zinc-200 dark:border-zinc-800 hover:bg-[#25D366]/10 hover:text-[#25D366] hover:border-[#25D366]/30 transition-all text-zinc-600 dark:text-zinc-400 group shadow-sm bg-white dark:bg-black" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent('Here is my video message: ' + shareUrl)}`)}>
                      <svg className="w-5 h-5 fill-current sm:mr-2 shrink-0" viewBox="0 0 24 24"><path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.645.836 5.176 2.428 7.27L.81 24l4.904-1.579c2.015 1.444 4.417 2.21 6.94 2.21 6.646 0 12.03-5.385 12.03-12.031C24.685 5.385 19.3 0 12.031 0zm6.57 17.203c-.279.791-1.614 1.436-2.228 1.487-.552.046-1.25.109-3.951-1.009-3.257-1.35-5.328-4.664-5.487-4.88-.158-.216-1.309-1.748-1.309-3.333 0-1.586.827-2.378 1.121-2.695.295-.315.64-.393.856-.393.216 0 .432.003.626.012.204.01.48-.077.747.57.275.666.938 2.296 1.025 2.469.086.174.143.376.028.601-.115.226-.172.368-.344.571-.173.203-.362.438-.518.571-.173.146-.356.326-.143.688.216.362.955 1.57 2.053 2.553 1.417 1.267 2.597 1.657 2.956 1.83.361.173.576.146.793-.114.215-.259.932-1.087 1.189-1.46.257-.373.514-.312.836-.188.322.126 2.037.958 2.384 1.13.344.172.574.258.658.4.084.143.084.825-.194 1.616z"/></svg>
                      <span className="hidden sm:inline font-bold text-[15px]">WhatsApp</span>
                    </Button>
                    <Button variant="outline" className="h-12 w-12 sm:w-auto sm:px-6 rounded-xl border-zinc-200 dark:border-zinc-800 hover:bg-[#0088cc]/10 hover:text-[#0088cc] hover:border-[#0088cc]/30 transition-all text-zinc-600 dark:text-zinc-400 group shadow-sm bg-white dark:bg-black" onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent('Here is my video message!')}`)}>
                      <Send className="w-5 h-5 sm:mr-2 shrink-0" />
                      <span className="hidden sm:inline font-bold text-[15px]">Telegram</span>
                    </Button>
                    <Button variant="outline" className="h-12 w-12 sm:w-auto sm:px-6 rounded-xl border-zinc-200 dark:border-zinc-800 hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] hover:border-[#0A66C2]/30 transition-all text-zinc-600 dark:text-zinc-400 group shadow-sm bg-white dark:bg-black" onClick={() => window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent('Check out my video pitch: ' + shareUrl)}`)}>
                      <Linkedin className="w-5 h-5 sm:mr-2 shrink-0" />
                      <span className="hidden sm:inline font-bold text-[15px]">LinkedIn</span>
                    </Button>
                    <Button variant="outline" className="h-12 w-12 sm:w-auto sm:px-6 rounded-xl border-zinc-200 dark:border-zinc-800 hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] hover:border-[#1DA1F2]/30 transition-all text-zinc-600 dark:text-zinc-400 group shadow-sm bg-white dark:bg-black" onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent('Check out my video pitch: ')}&url=${encodeURIComponent(shareUrl)}`)}>
                      <svg className="w-4 h-4 fill-current sm:mr-2 shrink-0" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                      <span className="hidden sm:inline font-bold text-[15px]">X (Twitter)</span>
                    </Button>
                    <Button variant="outline" className="h-12 w-12 sm:w-auto sm:px-6 rounded-xl border-zinc-200 dark:border-zinc-800 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-all text-zinc-600 dark:text-zinc-400 group shadow-sm bg-white dark:bg-black" onClick={() => window.open(`mailto:?subject=I recorded a video for you!&body=Watch it here: ${shareUrl}`)}>
                      <Mail className="w-5 h-5 sm:mr-2 shrink-0" />
                      <span className="hidden sm:inline font-bold text-[15px]">Email</span>
                    </Button>
                 </div>
              </div>
            </div>
        </div>
      )}
    </div>
  )
}
