"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Play, Pause, Calendar, ExternalLink, ArrowRight, Volume2, VolumeX, Link as LinkIcon } from 'lucide-react'
import { VideoCardData } from './video-editor'

interface FullscreenViewerProps {
  data: VideoCardData
}

export function FullscreenViewer({ data }: FullscreenViewerProps) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  
  const { title, agenda, callToAction, calendlyUrl, videoUrl, trimStart } = data

  // Auto-play the video when the link is opened
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = trimStart / 1000
      videoRef.current.muted = false
      videoRef.current.play().catch(e => {
        console.log("Autoplay prevented:", e)
        // If autoplay is prevented because it is unmuted, we could try muting it and playing again, but user requested volume by default
      })
    }
  }, [trimStart])

  // Hide UI controls when mouse is still for a cinematic feel
  useEffect(() => {
    let timeout: NodeJS.Timeout
    const handleMouseMove = () => {
      setShowControls(true)
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        if (isPlaying) setShowControls(false)
      }, 3000)
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      clearTimeout(timeout)
    }
  }, [isPlaying])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const formatAgenda = (text: string) => {
    return text.split('\n').filter(line => line.trim()).map((line, i) => {
      const content = line.replace(/^[•\-\*]\s*/, '').trim()
      if (!content) return null
      return (
        <li key={i} className="flex items-start gap-3 text-white/90 drop-shadow-md">
          <span className="w-1.5 h-1.5 rounded-full bg-white mt-2 shrink-0 shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
          <span className="text-[15px] md:text-[16px] leading-relaxed font-medium">{content}</span>
        </li>
      )
    })
  }

  return (
    <div className="fixed inset-0 bg-black w-full h-full flex items-center justify-center overflow-hidden font-sans">
      
      {/* 1. HUGE FULLSCREEN VIDEO */}
      <div 
        className="absolute inset-0 w-full h-full cursor-pointer z-0"
        onClick={togglePlay}
      >
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-contain"
          playsInline
          loop={true}
        />
        
        {/* Cinematic Gradient Overlays to make text readable */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 pointer-events-none transition-opacity duration-700 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80 pointer-events-none transition-opacity duration-700 hidden lg:block ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`} />
      </div>

      {/* 2. CENTER PLAY BUTTON (Only visible when paused) */}
      <div 
        className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-300 z-10 ${isPlaying ? 'opacity-0 scale-150' : 'opacity-100 scale-100'}`}
      >
        <div className="w-24 h-24 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <Play className="w-12 h-12 ml-2" />
        </div>
      </div>

      {/* 3. HOVER CONTROLS & INFO LAYOUT (Bottom/Sides) */}
      <div 
        className={`absolute inset-x-0 bottom-0 p-6 md:p-12 z-20 transition-all duration-700 flex flex-col lg:flex-row items-end lg:items-center justify-between pointer-events-none ${showControls || !isPlaying ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
      >
        {/* Left Side: Title & Agenda */}
        <div className="w-full lg:w-[60%] flex flex-col gap-4 lg:gap-6 pointer-events-auto max-w-[800px]">
          {/* Unmute Prompt (if muted) */}
          {isMuted && (
            <button 
              onClick={toggleMute}
              className="group self-start inline-flex items-center gap-2 bg-white/20 hover:bg-white text-white hover:text-black backdrop-blur-md border border-white/30 rounded-full px-4 py-2 text-sm font-bold tracking-wide transition-all shadow-lg animate-bounce"
            >
              <VolumeX className="w-4 h-4" />
              Tap to Unmute
            </button>
          )}

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
            {title}
          </h1>

          {agenda && (
            <div className="pt-2 md:pt-4">
              <ul className="space-y-2 md:space-y-3">
                {formatAgenda(agenda)}
              </ul>
            </div>
          )}
        </div>

        {/* Right Side: Heavy Call to Action (Booking) */}
        {(callToAction || calendlyUrl) && (
          <div className="w-full lg:w-[400px] mt-8 lg:mt-0 pointer-events-auto shrink-0 flex flex-col gap-4 animate-in slide-in-from-right-8 duration-700">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.4)] flex flex-col gap-5">
              
              {/* Text instruction is only shown if there is no URL to click */}
              {callToAction && !calendlyUrl && (
                <div className="flex items-center gap-4 text-white">
                  <div className="w-10 h-10 rounded-full bg-[#0066FF] flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(0,102,255,0.4)]">
                    <ArrowRight className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/60 mb-1">
                      Next Step
                    </h3>
                    <p className="text-[16px] md:text-[18px] font-bold leading-snug drop-shadow-md">
                      {callToAction}
                    </p>
                  </div>
                </div>
              )}

              {calendlyUrl && (
                <Button 
                  asChild 
                  className="w-full h-14 md:h-16 bg-white hover:bg-zinc-200 text-black rounded-2xl text-[16px] md:text-[17px] font-bold shadow-[0_8px_30px_rgba(255,255,255,0.2)] transition-all hover:scale-[1.03] active:scale-[0.98] group"
                >
                  <a href={calendlyUrl.startsWith('http') ? calendlyUrl : `https://${calendlyUrl}`} target="_blank" rel="noopener noreferrer">
                    {calendlyUrl.toLowerCase().includes('cal') || calendlyUrl.toLowerCase().includes('meet') ? (
                       <Calendar className="w-5 h-5 md:w-6 md:h-6 mr-3 opacity-90 text-[#0066FF]" />
                    ) : (
                       <LinkIcon className="w-5 h-5 md:w-6 md:h-6 mr-3 opacity-90 text-[#0066FF]" />
                    )}
                    {callToAction || 'Secure your time'}
                    <ExternalLink className="w-4 h-4 md:w-5 md:h-5 ml-3 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Floating Audio Control (Top Right) */}
      <div className={`absolute top-6 right-6 z-30 transition-opacity duration-700 pointer-events-auto ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
        <button 
          onClick={toggleMute}
          className="w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all shadow-lg hover:scale-105"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-[#0066FF]" />}
        </button>
      </div>

    </div>
  )
}
