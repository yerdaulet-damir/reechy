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

  // Landing Page - High-converting Fast Pitch Video structure
  if (step === 'landing') {
    return (
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] font-sans selection:bg-[#0066FF]/20 selection:text-[#0066FF] relative overflow-hidden flex flex-col">
        {/* Extreme soft misty glowing background blobs */}
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
              <span className="text-2xl font-black tracking-tight text-[#111] dark:text-[#F3F3F3] leading-none">
                Reechy
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://github.com/yerdaulet/fast-pitch" target="_blank" rel="noreferrer" className="hidden sm:flex items-center gap-2 text-[14px] font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              Star on GitHub
            </a>
            <Button
              onClick={handleStartRecording}
              className="bg-[#0066FF] text-white hover:bg-[#0052CC] rounded-[24px] px-6 py-5 h-auto text-[14px] font-bold transition-all shadow-[0_4px_12px_rgba(0,102,255,0.25)]"
            >
              Start Recording
            </Button>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="relative z-10 flex-1 w-full flex flex-col items-center max-w-[1200px] mx-auto px-6 md:px-12 pb-24 pt-12 md:pt-20 text-center">
          
          {/* Main Copy */}
          <div className="space-y-6 max-w-4xl mx-auto flex flex-col items-center">
            <h1 className="text-[3.5rem] sm:text-[4.5rem] lg:text-[5rem] leading-[1.05] font-black tracking-tight text-[#111] dark:text-[#F3F3F3]">
              Record a pitch video in <span className="text-[#0066FF]">60 seconds.</span> Send it in one link.
            </h1>
            <p className="text-[1.25rem] sm:text-[1.5rem] leading-[1.5] text-zinc-500 dark:text-zinc-400 max-w-2xl font-medium">
              Built-in teleprompter. Instant pitch page with Calendly booking. No bloated share screens.
            </p>
          </div>

          {/* Primary CTA */}
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
            <Button
              onClick={handleStartRecording}
              className="bg-[#111] text-white hover:bg-black dark:bg-[#F3F3F3] dark:text-[#111] dark:hover:bg-white rounded-full px-8 h-16 text-[17px] font-bold transition-all shadow-[0_8px_30px_rgba(0,0,0,0.12)] inline-flex items-center gap-3 group"
            >
              Record your first pitch <span className="font-sans ml-1 text-xl leading-none transform transition-transform group-hover:translate-x-1">→</span>
            </Button>
            <span className="text-[13px] font-medium text-zinc-400">Takes 2 clicks. No account required.</span>
          </div>

          {/* Social Proof / Trusted By */}
          <div className="mt-16 sm:mt-24 pt-10 border-t border-black/5 dark:border-white/5 w-full flex flex-col items-center gap-6">
            <p className="text-[12px] uppercase tracking-widest font-bold text-zinc-400">The Ultimate Loom Alternative</p>
            <div className="flex flex-wrap justify-center gap-8 sm:gap-16 opacity-60 mix-blend-luminosity dark:mix-blend-normal">
               {/* 100% Client-side React Open Source */}
               <div className="flex items-center gap-2 text-xl font-bold text-zinc-600 dark:text-zinc-400">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  100% Open Source
               </div>
               <div className="flex items-center gap-2 text-xl font-bold text-zinc-600 dark:text-zinc-400">
                  ⚡ Client-Side Editing
               </div>
               <div className="flex items-center gap-2 text-xl font-bold text-zinc-600 dark:text-zinc-400">
                  🔒 Private by Default
               </div>
            </div>
          </div>

        </main>

        {/* The Problem & Features Section */}
        <section className="relative z-10 w-full bg-white dark:bg-[#111] py-24 sm:py-32 border-y border-black/5 dark:border-white/5">
           <div className="max-w-[1200px] mx-auto px-6 md:px-12">
              
              <div className="grid md:grid-cols-3 gap-12 sm:gap-8">
                {/* Loom Pain */}
                <div className="flex flex-col gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500 mb-2">
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#111] dark:text-[#F3F3F3]">Not Loom.</h3>
                  <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                    Loom pages are heavy, loaded with transcriptions, comments, and noise. Reechy gives you a clean, dedicated pitch page.
                  </p>
                </div>

                {/* CapCut Pain */}
                <div className="flex flex-col gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-500 mb-2">
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#111] dark:text-[#F3F3F3]">Not CapCut.</h3>
                  <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                    Stop downloading videos just to trim bad takes. Our frictionless in-browser editor lets you polish videos instantly.
                  </p>
                </div>

                {/* VEED Pain */}
                <div className="flex flex-col gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-600 mb-2">
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#111] dark:text-[#F3F3F3]">Not VEED.</h3>
                  <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                    Generic video tools aren't built for sales. Reechy generates an instant share page with your Calendly link appended.
                  </p>
                </div>
              </div>

              {/* The "Features" visually represented */}
              <div className="mt-24 grid md:grid-cols-2 gap-16 items-center">
                 <div className="space-y-8">
                    <h2 className="text-[2.5rem] leading-tight font-black tracking-tight text-[#111] dark:text-[#F3F3F3]">
                       Everything you need to shoot the perfect take.
                    </h2>
                    <ul className="space-y-6">
                       <li className="flex gap-4">
                          <div className="w-8 h-8 rounded-full bg-[#0066FF]/10 text-[#0066FF] flex items-center justify-center shrink-0 mt-1">📝</div>
                          <div>
                            <strong className="text-lg font-bold text-[#111] dark:text-white block">Beast Teleprompter</strong>
                            <span className="text-zinc-600 dark:text-zinc-400 font-medium">A floating, controllable teleprompter paired with accurate timecodes so you never forget your script.</span>
                          </div>
                       </li>
                       <li className="flex gap-4">
                          <div className="w-8 h-8 rounded-full bg-[#0066FF]/10 text-[#0066FF] flex items-center justify-center shrink-0 mt-1">✂️</div>
                          <div>
                            <strong className="text-lg font-bold text-[#111] dark:text-white block">Trim in Browser</strong>
                            <span className="text-zinc-600 dark:text-zinc-400 font-medium">Instantly cut out the awkward start and end of your video without leaving the page.</span>
                          </div>
                       </li>
                       <li className="flex gap-4">
                          <div className="w-8 h-8 rounded-full bg-[#0066FF]/10 text-[#0066FF] flex items-center justify-center shrink-0 mt-1">🔗</div>
                          <div>
                            <strong className="text-lg font-bold text-[#111] dark:text-white block">Instant Booking Page</strong>
                            <span className="text-zinc-600 dark:text-zinc-400 font-medium">Generate a sleek URL with your custom headline, agenda points, and a built-in calendar.</span>
                          </div>
                       </li>
                    </ul>
                 </div>

                 {/* Demo Placeholder (Use GIF) */}
                 <div className="rounded-[2.5rem] bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 aspect-square relative overflow-hidden shadow-2xl flex items-center justify-center">
                    {/* The fallback visual if the GIF from docs folder is missing */}
                    <img src="docs/cover-image.gif" alt="Reechy Recording Demo" className="w-full h-full object-cover z-10" onError={(e) => {
                      // Fallback if image isn't available yet in the public folder
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}/>
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-zinc-400 z-0">
                       <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-4 opacity-50"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /></svg>
                       <span className="text-lg font-bold text-zinc-500">Record. Trim. Send.</span>
                       <span>(Add docs/cover-image.gif to public folder for live preview)</span>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Footer CTA */}
        <section className="relative z-10 w-full bg-[#FAFAFA] dark:bg-[#0A0A0A] py-32 border-t border-black/5 dark:border-white/5 text-center">
           <div className="max-w-3xl mx-auto px-6 space-y-8">
              <h2 className="text-[3rem] font-black tracking-tight text-[#111] dark:text-[#F3F3F3]">
                Self-host it. Fork it. <br/><span className="text-[#0066FF]">Own your data.</span>
              </h2>
              <p className="text-[1.25rem] text-zinc-500 dark:text-zinc-400 font-medium">
                Reechy is 100% open-source. Build your own video infrastructure.
              </p>
              <div className="flex justify-center pt-4">
                <a href="https://github.com/yerdaulet/fast-pitch" target="_blank" rel="noreferrer">
                  <Button className="bg-[#111] text-white hover:bg-black dark:bg-[#F3F3F3] dark:text-[#111] dark:hover:bg-white rounded-full px-8 h-14 text-[15px] font-bold transition-all shadow-xl inline-flex items-center gap-3 group">
                    View on GitHub
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  </Button>
                </a>
              </div>
           </div>
        </section>
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
