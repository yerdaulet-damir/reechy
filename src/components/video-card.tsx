"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Play, Pause, Calendar, ExternalLink, Copy, Check, FlipHorizontal, ArrowRight } from 'lucide-react'
import { VideoCardData } from './video-editor'

interface VideoCardProps {
  data: VideoCardData
  isPreview?: boolean
}

export function VideoCard({ data, isPreview = false }: VideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [copied, setCopied] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const playPromiseRef = useRef<Promise<void> | null>(null)

  const { title, agenda, callToAction, calendlyUrl, videoUrl, trimStart, trimEnd, filters } = data

  // Auto-play the video when the link is opened (if it's not the editor preview)
  useEffect(() => {
    if (!isPreview && videoRef.current) {
      const attemptPlay = async () => {
        try {
          // Reset to start time
          videoRef.current!.currentTime = trimStart / 1000
          // Browsers require muted for autoplay without interaction, so we try muted first if normal play fails
          videoRef.current!.muted = true
          await videoRef.current!.play()
          setIsPlaying(true)
          // Optionally, you might want to show a "Click to Unmute" button if we autoplay muted,
          // but for now, making it autoplay immediately is the priority for the cinematic feel.
        } catch (e) {
          console.log("Autoplay prevented:", e)
        }
      }
      attemptPlay()
    }
  }, [isPreview, trimStart])

  // The filters and mirror effect are already burned into the WebM blob from the canvas recording.
  // There is no need to apply CSS scaleX or CSS filters here, doing so would double-apply them!

  useEffect(() => {
    if (videoRef.current && isPlaying) {
      const endTime = trimEnd / 1000
      const checkEnd = () => {
        if (videoRef.current && videoRef.current.currentTime >= endTime) {
          videoRef.current.pause()
          videoRef.current.currentTime = trimStart / 1000
          setIsPlaying(false)
        }
      }
      videoRef.current.addEventListener('timeupdate', checkEnd)
      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('timeupdate', checkEnd)
        }
      }
    }
  }, [isPlaying, trimEnd, trimStart])

  const togglePlay = async () => {
    if (videoRef.current) {
      try {
        if (playPromiseRef.current) {
          await playPromiseRef.current.catch(() => {})
        }
        
        if (isPlaying) {
          videoRef.current.pause()
        } else {
          // If we are at the end or starting fresh, reset to trimStart
          if (videoRef.current.currentTime >= trimEnd / 1000 || videoRef.current.currentTime === 0) {
            videoRef.current.currentTime = trimStart / 1000
          }
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

  const shareUrl = data.shareUrl || (typeof window !== 'undefined' ? window.location.href : '')

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatAgenda = (text: string) => {
    return text.split('\n').filter(line => line.trim()).map((line, i) => {
      const content = line.replace(/^[•\-\*]\s*/, '').trim()
      if (!content) return null
      
      return (
        <li key={i} className="flex items-start gap-4 text-zinc-600 dark:text-zinc-300">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF] mt-2 shrink-0 shadow-[0_0_8px_rgba(0,102,255,0.6)]" />
          <span className="text-[16px] leading-relaxed font-medium">{content}</span>
        </li>
      )
    })
  }

  return (
    <div className="w-full max-w-[1100px] mx-auto mt-8 fade-in duration-700">
      {!isPreview && (
        <div className="flex flex-col gap-6 mb-10 max-w-[1000px] mx-auto bg-green-500/5 dark:bg-green-500/10 border border-green-500/20 p-6 sm:p-8 rounded-[2rem]">
          <div className="flex items-start gap-4">
             <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
             </div>
             <div className="flex-1">
                <h2 className="text-2xl font-bold tracking-tight text-[#111] dark:text-[#F3F3F3]">
                  Your Video is Live
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 text-[15px] mt-1 font-medium">
                  Copy the link below and send it to your prospect. They will see the immersive fullscreen video view.
                </p>
             </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 items-center w-full bg-white dark:bg-[#0A0A0A] p-2 pl-4 rounded-full border border-zinc-200 dark:border-zinc-800 shadow-sm">
             <div className="flex-1 truncate text-[15px] font-medium text-zinc-600 dark:text-zinc-400 font-mono px-2">
                {shareUrl}
             </div>
             <Button 
                onClick={copyLink} 
                className="w-full sm:w-auto rounded-full bg-[#111] dark:bg-white text-white dark:text-[#111] hover:bg-black dark:hover:bg-zinc-200 shadow-md h-12 px-8 transition-all text-[15px] font-bold group shrink-0"
              >
                {copied ? (
                  <><Check className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />Copied!</>
                ) : (
                  <><Copy className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />Copy Link</>
                )}
              </Button>
          </div>
        </div>
      )}

      {/* Main Cinematic Card Container */}
      <div className="bg-white dark:bg-[#0A0A0A] rounded-[2rem] md:rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.12)] border border-black/5 dark:border-white/5 overflow-hidden ring-1 ring-black/5 dark:ring-white/10 flex flex-col md:flex-row max-w-[1200px] mx-auto min-h-[650px] relative isolate">
        
        {/* Dynamic Glowing Aura behind the video */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-[120px] -z-10 pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-[100px] -z-10 pointer-events-none mix-blend-screen" />

        {/* Left: Huge Cinematic Video Player */}
        <div 
          className="w-full md:w-[50%] lg:w-[55%] relative bg-black flex items-center justify-center cursor-pointer group isolation-auto border-r border-white/10" 
          onClick={togglePlay}
        >
          {/* Subtle vignette over the black background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none z-0" />
          
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full max-h-[85vh] md:max-h-full object-contain relative z-10 transition-transform duration-[1000ms] ease-out group-hover:scale-[1.01]"
            playsInline
            loop={false}
          />
          
          {/* Elegant Play/Pause Overlay */}
          <div className={`absolute inset-0 z-20 flex items-center justify-center transition-all duration-500 ease-out bg-black/40 backdrop-blur-[4px] ${isPlaying ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'}`}>
            <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(255,255,255,0.1)] border border-white/20 transition-all duration-500 ease-out bg-white/10 text-white backdrop-blur-md group-hover:scale-110 group-hover:bg-white/20`}>
              {isPlaying ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10 ml-2" />}
            </div>
            {!isPlaying && (
              <div className="absolute bottom-8 left-0 right-0 text-center animate-pulse">
                <p className="text-white/80 font-semibold tracking-widest uppercase text-sm drop-shadow-md">
                  {videoRef.current?.currentTime === 0 ? 'Click to Play Pitch' : 'Paused'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Focused Content & CTA Panel */}
        <div className="w-full md:w-[50%] lg:w-[45%] p-8 sm:p-10 lg:p-14 flex flex-col justify-center bg-white dark:bg-[#0A0A0A] z-10">
          <div className="flex-1 flex flex-col justify-center gap-10 max-w-[440px] mx-auto md:mx-0">
            
            {/* Context Badge */}
            <div className="space-y-6">
              <Badge variant="secondary" className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold tracking-widest uppercase text-[11px] px-3.5 py-1.5 inline-flex items-center gap-2 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0066FF] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0066FF]"></span>
                </span>
                Video Message
              </Badge>
              
              <h1 className="text-[2.5rem] lg:text-[2.75rem] xl:text-[3rem] leading-[1.05] font-black tracking-tight text-[#111] dark:text-[#F3F3F3]">
                {title}
              </h1>
            </div>

            {/* High-Contrast CTA Section */}
            {(callToAction || calendlyUrl) && (
              <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800/80 shadow-inner flex flex-col gap-6">
                
                {/* Descriptive Text - Only show if there's no Calendly, or if they wrote a long paragraph */}
                {callToAction && !calendlyUrl && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-black shadow-sm flex items-center justify-center shrink-0 border border-zinc-200 dark:border-zinc-800">
                      <ArrowRight className="w-5 h-5 text-[#111] dark:text-white" />
                    </div>
                    <div>
                      <h3 className="text-[12px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1">
                        Next Step
                      </h3>
                      <p className="text-[17px] text-zinc-900 dark:text-zinc-100 font-semibold leading-snug">
                        {callToAction}
                      </p>
                    </div>
                  </div>
                )}

                {/* Primary Booking Button */}
                {calendlyUrl && (
                  <div>
                    <h3 className="text-[12px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3 text-center">
                      Next Step
                    </h3>
                    <Button 
                      asChild 
                      className="w-full h-16 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-2xl text-[17px] font-bold shadow-[0_8px_20px_rgba(0,102,255,0.25)] transition-all hover:scale-[1.02] hover:-translate-y-0.5 group"
                    >
                      <a href={calendlyUrl.startsWith('http') ? calendlyUrl : `https://${calendlyUrl}`} target="_blank" rel="noopener noreferrer">
                        <Calendar className="w-5 h-5 mr-3 opacity-90" />
                        {callToAction || 'Secure your time'}
                        <ExternalLink className="w-4 h-4 ml-3 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Agenda (De-emphasized slightly to focus on video/CTA) */}
            {agenda && (
              <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
                <p className="text-[12px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                  Agenda Outline
                </p>
                <ul className="space-y-3">
                  {formatAgenda(agenda)}
                </ul>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
