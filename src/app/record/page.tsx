"use client"

import { useState } from 'react'
import { CameraInterface, FilterSettings, FrameType } from '@/components/camera-interface'
import { VideoEditor, VideoCardData } from '@/components/video-editor'
import { VideoCard } from '@/components/video-card'
import Link from 'next/link'

export default function RecordPage() {
  const [step, setStep] = useState<'record' | 'edit' | 'preview'>('record')
  const [videoData, setVideoData] = useState<{
    blob: Blob
    duration: number
    filters: FilterSettings
    frame: FrameType
  } | null>(null)
  const [cardData, setCardData] = useState<VideoCardData | null>(null)

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

  if (step === 'record') {
    return <CameraInterface onVideoComplete={handleVideoComplete} inline={false} />
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] py-8 px-4 font-sans text-[#111] dark:text-[#F3F3F3]">
      <div className="max-w-[1440px] mx-auto space-y-12 pt-8">
        <header className="flex flex-col items-center justify-center space-y-4">
          <Link href="/" className="flex items-center gap-3 cursor-pointer group">
            <div className="w-[32px] h-[32px] bg-[#0066FF] rounded-[10px] flex items-center justify-center shadow-md transition-transform group-hover:scale-105">
               <div className="w-[12px] h-[12px] bg-white rounded-full animate-pulse shadow-sm" />
            </div>
            <span className="text-[22px] font-black tracking-tight leading-none text-[#111] dark:text-[#F3F3F3]">
              Reechy
            </span>
          </Link>
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
