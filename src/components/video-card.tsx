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

  // Apply filters and flip to video
  useEffect(() => {
    if (videoRef.current && filters) {
      const video = videoRef.current

      let filterString = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%)`
      if (filters.grayscale) filterString += ' grayscale(100%)'
      if (filters.sepia) filterString += ' sepia(100%)'
      if (filters.invert) filterString += ' invert(100%)'
      if (filters.blur > 0) filterString += ` blur(${filters.blur}px)`
      if (filters.hueRotate > 0) filterString += ` hue-rotate(${filters.hueRotate}deg)`
      if (filters.beauty) filterString = `brightness(105%) contrast(95%) saturate(95%)`

      video.style.filter = filterString

      // Apply flip effect
      if (filters.flipHorizontal) {
        video.style.transform = 'scaleX(-1)'
      } else {
        video.style.transform = 'scaleX(1)'
      }
    }
  }, [filters])

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

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 px-2 max-w-[1000px] mx-auto">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-[#111] dark:text-[#F3F3F3]">
              Your Pitch Page is Ready
            </h2>
            <p className="text-zinc-500 text-[15px] mt-2 font-medium">Send this link to your prospect.</p>
          </div>
          <div className="flex gap-3 items-center">
            {filters?.flipHorizontal && (
              <Badge variant="secondary" className="hidden sm:inline-flex bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-0 px-3 py-1 text-[13px] font-semibold">
                <FlipHorizontal className="w-3.5 h-3.5 mr-1.5" />
                Mirror Match
              </Badge>
            )}
            <Button 
              onClick={copyLink} 
              className="rounded-full bg-white dark:bg-[#111] text-[#111] dark:text-white border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 shadow-[0_4px_12px_rgba(0,0,0,0.06)] h-11 px-6 transition-all text-[14px] font-bold group"
            >
              {copied ? (
                <><Check className="w-4 h-4 mr-2 text-green-500 group-hover:scale-110 transition-transform" />Copied!</>
              ) : (
                <><Copy className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />Copy Link</>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Main Card Container */}
      <div className="bg-white dark:bg-[#0A0A0A] rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.08)] border border-black/5 dark:border-white/5 overflow-hidden ring-1 ring-black/5 dark:ring-white/10 flex flex-col md:flex-row max-w-[1050px] mx-auto relative isolate">
        
        {/* Decorative subtle gradient */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/80 dark:bg-blue-900/10 rounded-full blur-[100px] -z-10 pointer-events-none transform translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-50/50 dark:bg-purple-900/10 rounded-full blur-[80px] -z-10 pointer-events-none transform -translate-x-1/2 translate-y-1/2" />

        {/* Left: Video Side */}
        <div className="w-full md:w-[45%] lg:w-[40%] relative bg-zinc-100 dark:bg-zinc-900 aspect-[4/5] object-cover md:aspect-auto cursor-pointer group isolation-auto" onClick={togglePlay}>
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            playsInline
          />
          
          {/* Play/Pause Overlay */}
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-out ${isPlaying ? 'bg-black/0 opacity-0 group-hover:opacity-100' : 'bg-black/20 opacity-100 backdrop-blur-[2px]'}`}>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all duration-300 ease-out ${isPlaying ? 'bg-white/30 dark:bg-black/40 backdrop-blur-md text-white scale-90 group-hover:scale-100' : 'bg-white dark:bg-[#111] text-black dark:text-white scale-100 hover:scale-110'}`}>
              {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1.5" />}
            </div>
          </div>
        </div>

        {/* Right: Content Side */}
        <div className="w-full md:w-[55%] lg:w-[60%] p-8 sm:p-12 lg:p-16 flex flex-col relative bg-white/40 dark:bg-black/40 backdrop-blur-sm z-10 border-l border-zinc-100 dark:border-zinc-800/50">
          <div className="flex-1 flex flex-col gap-10">
            {/* Header Area */}
            <div className="space-y-5">
              <Badge variant="secondary" className="bg-[#0066FF]/10 text-[#0066FF] hover:bg-[#0066FF]/20 border-0 font-bold tracking-widest uppercase text-[11px] px-3 py-1.5 inline-flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF] animate-pulse" />
                Video Pitch
              </Badge>
              <h1 className="text-[2.25rem] sm:text-[2.75rem] leading-[1.1] font-bold tracking-tight text-[#111] dark:text-[#F3F3F3]">
                {title}
              </h1>
            </div>

            {/* Agenda Area */}
            {agenda && (
              <div className="space-y-5 flex-1">
                <p className="text-[13px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                  Discussion Points
                </p>
                <ul className="space-y-4">
                  {formatAgenda(agenda)}
                </ul>
              </div>
            )}

            {/* Call to Action Note */}
            {callToAction && (
              <div className="bg-blue-50/80 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/20 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-5 h-5 text-[#0066FF] dark:text-[#3388FF]" />
                </div>
                <p className="text-[16px] text-zinc-800 dark:text-zinc-200 font-semibold leading-relaxed">
                  {callToAction}
                </p>
              </div>
            )}

            {/* Booking Button (Sticks to bottom) */}
            {calendlyUrl && (
              <div className="pt-2">
                <Button 
                  asChild 
                  className="w-full h-16 bg-[#111] text-white hover:bg-black dark:bg-[#F3F3F3] dark:text-[#111] dark:hover:bg-white rounded-full text-[17px] font-bold shadow-[0_12px_30px_rgba(0,0,0,0.15)] transition-all hover:scale-[1.02] group"
                >
                  <a href={calendlyUrl.startsWith('http') ? calendlyUrl : `https://${calendlyUrl}`} target="_blank" rel="noopener noreferrer">
                    <Calendar className="w-6 h-6 mr-3 opacity-90" />
                    Secure a Time
                    <ExternalLink className="w-5 h-5 ml-3 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                  </a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
