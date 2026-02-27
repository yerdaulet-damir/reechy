"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Play, Pause, Calendar, ExternalLink, Copy, Check, FlipHorizontal, ArrowRight, Link as LinkIcon, Linkedin, Mail, Send } from 'lucide-react'
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
        <div className="flex flex-col mb-12 max-w-[1000px] mx-auto bg-white dark:bg-[#111] border border-black/5 dark:border-white/10 p-8 sm:p-10 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.06)] relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center shrink-0 border border-green-500/20 shadow-sm">
                  <Check className="w-7 h-7 text-green-600 dark:text-green-500" />
              </div>
              <div>
                  <h2 className="text-3xl font-black tracking-tight text-[#111] dark:text-[#F3F3F3]">
                    Video Delivered to Edge
                  </h2>
                  <p className="text-zinc-600 dark:text-zinc-400 text-[16px] mt-1 font-medium">
                    Your cinematic pitch page is live. Copy the link below to send to your prospect.
                  </p>
              </div>
            </div>
            
            {filters?.flipHorizontal && (
              <Badge variant="secondary" className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-0 px-4 py-1.5 text-[14px] font-bold shadow-sm hidden sm:inline-flex">
                <FlipHorizontal className="w-4 h-4 mr-2" />
                Mirror Match
              </Badge>
            )}
          </div>

          {/* Big Link Copy Box */}
          <div className="flex flex-col sm:flex-row items-center w-full bg-zinc-50 dark:bg-zinc-900/50 p-2.5 pl-6 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 shadow-inner group transition-all focus-within:border-[#0066FF]/50 hover:border-zinc-300 dark:hover:border-zinc-700">
              <LinkIcon className="w-5 h-5 text-zinc-400 shrink-0 mr-3" />
              <input 
                readOnly
                value={shareUrl}
                className="flex-1 bg-transparent border-0 outline-none text-[16px] sm:text-[18px] font-mono font-medium text-[#111] dark:text-white truncate w-full cursor-text"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <Button 
                onClick={copyLink} 
                className="w-full sm:w-auto mt-4 sm:mt-0 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white shadow-[0_8px_20px_rgba(0,102,255,0.25)] h-14 px-8 transition-all text-[16px] font-bold shrink-0 hover:scale-[1.02]"
              >
                {copied ? (
                  <><Check className="w-5 h-5 mr-2" />Copied!</>
                ) : (
                  <><Copy className="w-5 h-5 mr-2" />Copy Link</>
                )}
              </Button>
          </div>

          {/* Social Shares */}
          <div className="mt-8 pt-8 border-t border-zinc-100 dark:border-zinc-800/50">
             <p className="text-[12px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4 ml-1">Share directly via</p>
             <div className="flex flex-wrap gap-3">
                <Button variant="outline" className="h-12 w-12 sm:w-auto sm:px-6 rounded-xl border-zinc-200 dark:border-zinc-800 hover:bg-[#25D366]/10 hover:text-[#25D366] hover:border-[#25D366]/30 transition-all text-zinc-600 dark:text-zinc-400 group shadow-sm bg-white dark:bg-black" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent('Here is my video message: ' + shareUrl)}`)}>
                  <svg className="w-5 h-5 fill-current sm:mr-2" viewBox="0 0 24 24"><path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.645.836 5.176 2.428 7.27L.81 24l4.904-1.579c2.015 1.444 4.417 2.21 6.94 2.21 6.646 0 12.03-5.385 12.03-12.031C24.685 5.385 19.3 0 12.031 0zm6.57 17.203c-.279.791-1.614 1.436-2.228 1.487-.552.046-1.25.109-3.951-1.009-3.257-1.35-5.328-4.664-5.487-4.88-.158-.216-1.309-1.748-1.309-3.333 0-1.586.827-2.378 1.121-2.695.295-.315.64-.393.856-.393.216 0 .432.003.626.012.204.01.48-.077.747.57.275.666.938 2.296 1.025 2.469.086.174.143.376.028.601-.115.226-.172.368-.344.571-.173.203-.362.438-.518.571-.173.146-.356.326-.143.688.216.362.955 1.57 2.053 2.553 1.417 1.267 2.597 1.657 2.956 1.83.361.173.576.146.793-.114.215-.259.932-1.087 1.189-1.46.257-.373.514-.312.836-.188.322.126 2.037.958 2.384 1.13.344.172.574.258.658.4.084.143.084.825-.194 1.616z"/></svg>
                  <span className="hidden sm:inline font-bold">WhatsApp</span>
                </Button>
                <Button variant="outline" className="h-12 w-12 sm:w-auto sm:px-6 rounded-xl border-zinc-200 dark:border-zinc-800 hover:bg-[#0088cc]/10 hover:text-[#0088cc] hover:border-[#0088cc]/30 transition-all text-zinc-600 dark:text-zinc-400 group shadow-sm bg-white dark:bg-black" onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent('Here is my video message!')}`)}>
                  <Send className="w-5 h-5 sm:mr-2" />
                  <span className="hidden sm:inline font-bold">Telegram</span>
                </Button>
                <Button variant="outline" className="h-12 w-12 sm:w-auto sm:px-6 rounded-xl border-zinc-200 dark:border-zinc-800 hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] hover:border-[#0A66C2]/30 transition-all text-zinc-600 dark:text-zinc-400 group shadow-sm bg-white dark:bg-black" onClick={() => window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent('Check out my video pitch: ' + shareUrl)}`)}>
                  <Linkedin className="w-5 h-5 sm:mr-2" />
                  <span className="hidden sm:inline font-bold">LinkedIn</span>
                </Button>
                <Button variant="outline" className="h-12 w-12 sm:w-auto sm:px-6 rounded-xl border-zinc-200 dark:border-zinc-800 hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] hover:border-[#1DA1F2]/30 transition-all text-zinc-600 dark:text-zinc-400 group shadow-sm bg-white dark:bg-black" onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent('Check out my video pitch: ')}&url=${encodeURIComponent(shareUrl)}`)}>
                  <svg className="w-4 h-4 fill-current sm:mr-2" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  <span className="hidden sm:inline font-bold">X (Twitter)</span>
                </Button>
                <Button variant="outline" className="h-12 w-12 sm:w-auto sm:px-6 rounded-xl border-zinc-200 dark:border-zinc-800 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-all text-zinc-600 dark:text-zinc-400 group shadow-sm bg-white dark:bg-black" onClick={() => window.open(`mailto:?subject=I recorded a video for you!&body=Watch it here: ${shareUrl}`)}>
                  <Mail className="w-5 h-5 sm:mr-2" />
                  <span className="hidden sm:inline font-bold">Email</span>
                </Button>
             </div>
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
                
                {/* Descriptive Text - Only shown if there is NO link */}
                {callToAction && !calendlyUrl && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#0066FF] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,102,255,0.4)]">
                      <ArrowRight className="w-5 h-5 text-white" />
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
                    <Button 
                      asChild 
                      className="w-full h-16 bg-white dark:bg-[#111] border-2 border-zinc-200 dark:border-zinc-800 hover:border-[#0066FF] hover:bg-zinc-50 dark:hover:bg-black text-[#111] dark:text-white rounded-2xl text-[17px] font-bold shadow-sm transition-all hover:scale-[1.02] hover:-translate-y-0.5 group"
                    >
                      <a href={calendlyUrl.startsWith('http') ? calendlyUrl : `https://${calendlyUrl}`} target="_blank" rel="noopener noreferrer">
                        {calendlyUrl.toLowerCase().includes('cal') || calendlyUrl.toLowerCase().includes('meet') ? (
                           <Calendar className="w-5 h-5 mr-3 text-[#0066FF]" />
                        ) : (
                           <LinkIcon className="w-5 h-5 mr-3 text-[#0066FF]" />
                        )}
                        {callToAction || 'Secure your time'}
                        <ExternalLink className="w-4 h-4 ml-3 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                      </a>
                    </Button>
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
