"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CameraInterface } from '@/components/camera-interface'
import { VideoEditor, VideoCardData } from '@/components/video-editor'
import { VideoCard } from '@/components/video-card'
import { FilterSettings, FrameType } from '@/components/camera-interface'

export default function Home() {
  const [step, setStep] = useState<'landing' | 'record' | 'edit' | 'preview'>('landing')
  const [videoData, setVideoData] = useState<{
    blob: Blob
    duration: number
    filters: FilterSettings
    frame: FrameType
  } | null>(null)
  const [cardData, setCardData] = useState<VideoCardData | null>(null)

  const handleStartRecording = () => {
    setStep('record')
  }

  const handleVideoComplete = (blob: Blob, duration: number, filters: FilterSettings, frame: FrameType) => {
    setVideoData({ blob, duration, filters, frame })
    setStep('edit')
  }

  const handleSave = (data: VideoCardData) => {
    setCardData(data)
    setStep('preview')
  }

  const handleNewRecording = () => {
    setStep('record')
    setVideoData(null)
    setCardData(null)
  }

  // Landing Page - Premium, Smooth, Cal.com / Paysponge style
  if (step === 'landing') {
    return (
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] font-sans selection:bg-[#0066FF]/20 selection:text-[#0066FF] relative overflow-hidden flex flex-col">
        {/* Extreme soft misty glowing background blobs similar to Paysponge */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden z-0">
          <div className="absolute top-[5%] -left-[10%] w-[60%] h-[70%] rounded-[100%] bg-blue-100/60 dark:bg-blue-900/10 blur-[130px]" />
          <div className="absolute top-[20%] -right-[15%] w-[50%] h-[80%] rounded-[100%] bg-slate-200/60 dark:bg-slate-800/20 blur-[150px]" />
        </div>

        {/* Navigation */}
        <nav className="relative z-10 w-full px-6 py-6 md:px-12 md:py-8 lg:px-24 mx-auto max-w-[1440px] flex items-center justify-between">
          <div className="flex items-center gap-12">
            {/* Logo area */}
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-[30px] h-[30px] bg-[#111] dark:bg-white rounded-[6px] flex items-center justify-center shadow-sm">
                <div className="w-[12px] h-[12px] bg-white dark:bg-[#111] rounded-[2px]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#111] dark:text-[#F3F3F3] leading-none">
                outrache
              </span>
              <span className="hidden sm:inline-flex items-center text-[10px] uppercase tracking-widest font-semibold text-zinc-400 dark:text-zinc-500 ml-4 pt-1">
                BACKED BY <span className="w-4 h-4 rounded-sm bg-[#FF6600] text-white flex items-center justify-center ml-2 leading-none font-bold">Y</span>
              </span>
            </div>

            {/* Links */}
            <div className="hidden lg:flex items-center gap-8 text-[14px] font-medium text-zinc-500 dark:text-zinc-400">
              <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Tools</a>
              <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Integration</a>
              <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Developer API</a>
              <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Docs</a>
            </div>
          </div>
          <div>
            <Button
              onClick={handleStartRecording}
              className="bg-[#111] text-white hover:bg-black dark:bg-[#F3F3F3] dark:text-[#111] dark:hover:bg-white rounded-[24px] px-6 py-5 h-auto text-[14px] font-semibold transition-all shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
            >
              Contact
            </Button>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="relative z-10 flex-1 w-full flex items-center max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 pb-20 pt-10">
          <div className="flex flex-col xl:flex-row items-center xl:items-start justify-between w-full gap-16 xl:gap-8">
            {/* Left: Hero Content */}
            <div className="w-full xl:w-[50%] flex flex-col justify-center space-y-12 shrink-0 pt-0 xl:pt-16 max-w-2xl mx-auto xl:mx-0">
              <div className="space-y-6 md:space-y-8">
                <h1 className="text-[3.5rem] sm:text-[4.5rem] lg:text-[5.5rem] leading-[1.05] font-bold tracking-tight text-[#111] dark:text-[#F3F3F3]">
                  Video infrastructure for the <span className="text-[#0066FF]">outreach economy</span>.
                </h1>
                <p className="text-[1.125rem] sm:text-[1.25rem] leading-[1.6] text-zinc-500 dark:text-zinc-400 max-w-xl font-medium">
                  The <span className="font-bold text-zinc-800 dark:text-zinc-200 italic">easiest</span> way for professionals to record, edit, and share pitch videos, and for clients to book a time directly with them.
                </p>
              </div>

              {/* Call to Action area like paysponge */}
              <div className="flex flex-col gap-6 w-full max-w-lg">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="space-y-4">
                    <h2 className="text-[2rem] leading-tight font-bold tracking-tight text-[#111] dark:text-[#F3F3F3]">
                      Supercharge your meetings.
                    </h2>
                    <p className="text-[15px] leading-relaxed text-zinc-500 font-medium">
                      Agents can connect, pitch, and convert leads using seamless inline video flows.
                    </p>
                    <div className="pt-2">
                      <Button
                        onClick={handleStartRecording}
                        className="bg-[#111] text-white hover:bg-black dark:bg-[#F3F3F3] dark:text-[#111] dark:hover:bg-white rounded-full px-7 h-12 text-[15px] font-semibold transition-all shadow-[0_8px_20px_rgba(0,0,0,0.12)] inline-flex items-center gap-2 group"
                      >
                        Launch Camera <span className="font-sans ml-1 text-lg leading-none transform transition-transform group-hover:translate-x-1">→</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Camera Inline as Cal.com / Instagram smooth widget */}
            <div className="w-full xl:w-[45%] flex justify-center xl:justify-end shrink-0 perspective-[1200px]">
              <div className="relative w-full max-w-[500px] aspect-[4/5] sm:aspect-square xl:aspect-auto xl:h-[640px] transform-gpu transition-all duration-[800ms] hover:-translate-y-2 hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] rounded-[32px] md:rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.06)] bg-white/60 dark:bg-[#111]/80 backdrop-blur-2xl ring-1 ring-black/5 dark:ring-white/10 p-2 md:p-3 flex flex-col">
                <div className="w-full h-full relative rounded-[24px] md:rounded-[32px] overflow-hidden bg-black isolation-auto will-change-transform">
                  <CameraInterface onVideoComplete={handleVideoComplete} inline />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Record step - fullscreen camera
  if (step === 'record') {
    return <CameraInterface onVideoComplete={handleVideoComplete} inline={false} />
  }

  // Edit & Preview steps
  return (
    <main className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] py-8 px-4 font-sans text-[#111] dark:text-[#F3F3F3]">
      <div className="max-w-[1440px] mx-auto space-y-12 pt-8">
        <header className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleNewRecording}>
            <div className="w-[30px] h-[30px] bg-[#111] dark:bg-white rounded-[6px] flex items-center justify-center shadow-sm">
              <div className="w-[12px] h-[12px] bg-white dark:bg-[#111] rounded-[2px]" />
            </div>
            <span className="text-xl font-bold tracking-tight leading-none">
              outrache
            </span>
          </div>
          <button
            onClick={handleNewRecording}
            className="text-[13px] font-semibold tracking-wide uppercase text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors inline-flex items-center gap-2 mt-4"
          >
            <span className="font-sans text-lg leading-none transform transition-transform group-hover:-translate-x-1 pt-[1px]">←</span> Start over
          </button>
        </header>

        <div className="flex justify-center gap-3 items-center">
          <div className={`h-[4px] w-12 rounded-full transition-all duration-500 ${
            step === 'edit' || step === 'preview' ? 'bg-[#0066FF] w-16' : 'bg-zinc-200 dark:bg-zinc-800'
          }`} />
          <div className={`h-[4px] w-12 rounded-full transition-all duration-500 ${
            step === 'preview' ? 'bg-[#0066FF] w-16' : 'bg-zinc-200 dark:bg-zinc-800'
          }`} />
        </div>

        {step === 'edit' && videoData && (
          <VideoEditor
            videoBlob={videoData.blob}
            duration={videoData.duration}
            filters={videoData.filters}
            onSave={handleSave}
          />
        )}

        {step === 'preview' && cardData && (
          <div className="fade-in duration-500">
            <VideoCard data={cardData} isPreview={false} />
            <div className="flex justify-center mt-12 pb-12">
              <button
                onClick={handleNewRecording}
                className="text-[15px] font-semibold text-[#0066FF] hover:text-[#0052CC] transition-colors inline-flex items-center gap-2 bg-[#0066FF]/5 hover:bg-[#0066FF]/10 px-6 py-3 rounded-full"
              >
                Create Another Project <span className="font-sans text-lg leading-none">→</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
