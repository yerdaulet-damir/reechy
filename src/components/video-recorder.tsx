"use client"

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Video, VideoOff, Mic, MicOff, Square, Play, Pause, RotateCcw } from 'lucide-react'
import posthog from 'posthog-js'
import { VideoFilters, FilterSettings } from './video-filters'

interface VideoRecorderProps {
  onVideoComplete: (blob: Blob, duration: number, filters: FilterSettings) => void
}

export function VideoRecorder({ onVideoComplete }: VideoRecorderProps) {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [filters, setFilters] = useState<FilterSettings>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    grayscale: false,
    sepia: false,
    invert: false,
    blur: 0,
    hueRotate: 0,
    beauty: false
  })

  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const playPromiseRef = useRef<Promise<void> | null>(null)

  // Initialize camera
  useEffect(() => {
    async function initCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720, facingMode: 'user' },
          audio: true
        })
        setStream(mediaStream)
        if (videoRef.current && !recordedBlob) {
          videoRef.current.srcObject = mediaStream
        }
      } catch (err) {
        console.error('Error accessing camera:', err)
      }
    }
    initCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  // Timer for recording
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 100)
      }, 100)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isRecording, isPaused])

  const startRecording = () => {
    if (!stream) return

    chunksRef.current = []
    const recorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9,opus'
    })

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data)
      }
    }

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' })
      setRecordedBlob(blob)
      const url = URL.createObjectURL(blob)
      setVideoUrl(url)
      onVideoComplete(blob, recordingTime, filters)
    }

    mediaRecorderRef.current = recorder
    recorder.start()
    setIsRecording(true)
    setRecordingTime(0)
    posthog?.capture('recording_started')
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) clearInterval(timerRef.current)
      posthog?.capture('recording_stopped')
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause()
      setIsPaused(true)
    }
  }

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.resume()
      setIsPaused(false)
    }
  }

  const resetRecording = () => {
    setRecordedBlob(null)
    setVideoUrl(null)
    setRecordingTime(0)
    setIsPaused(false)
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
      videoRef.current.style.filter = ''
    }
    setFilters({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      grayscale: false,
      sepia: false,
      invert: false,
      blur: 0,
      hueRotate: 0,
      beauty: false
    })
  }

  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setAudioEnabled(audioTrack.enabled)
      }
    }
  }

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setVideoEnabled(videoTrack.enabled)
      }
    }
  }

  // Safe play function that handles the play/pause race condition
  const safePlay = useCallback(async () => {
    if (videoRef.current) {
      try {
        // Cancel any pending play operation
        if (playPromiseRef.current) {
          await playPromiseRef.current.catch(() => {})
        }

        // Ensure video is paused before playing
        videoRef.current.pause()

        // Start new play operation
        playPromiseRef.current = videoRef.current.play()
        await playPromiseRef.current
      } catch (err) {
        // Ignore play interruption errors
        if ((err as Error).name !== 'AbortError') {
          console.warn('Play error:', err)
        }
      }
    }
  }, [])

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Video Preview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Запись видео</span>
              {isRecording && (
                <Badge variant={isPaused ? "secondary" : "destructive"}>
                  {isPaused ? 'ПАУЗА' : 'ЗАПИСЬ'}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Video Preview */}
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>

            {/* Recording Controls */}
            <div className="flex flex-col gap-4">
              {/* Timer & Progress */}
              {isRecording && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Длительность: {formatTime(recordingTime)}</span>
                    <span>{isPaused ? 'Пауза' : 'Идёт запись...'}</span>
                  </div>
                  <Progress value={(recordingTime % 10000) / 100} className="h-2" />
                </div>
              )}

              {/* Control Buttons */}
              <div className="flex flex-wrap justify-center gap-2">
                {!isRecording ? (
                  <>
                    {recordedBlob ? (
                      <>
                        <Button onClick={resetRecording} variant="outline" size="lg">
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Переснять
                        </Button>
                        <Button onClick={() => window.open(videoUrl!, '_blank')} variant="secondary" size="lg">
                          <Play className="w-4 h-4 mr-2" />
                          Скачать
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button onClick={toggleAudio} variant={audioEnabled ? "default" : "outline"} size="icon">
                          {audioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                        </Button>
                        <Button onClick={toggleVideo} variant={videoEnabled ? "default" : "outline"} size="icon">
                          {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                        </Button>
                        <Button onClick={startRecording} size="lg" className="min-w-[140px]">
                          <Square className="w-4 h-4 mr-2 fill-red-500" />
                          Начать запись
                        </Button>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <Button onClick={stopRecording} variant="destructive" size="lg">
                      <Square className="w-4 h-4 mr-2" />
                      Стоп
                    </Button>
                    <Button
                      onClick={isPaused ? resumeRecording : pauseRecording}
                      variant="secondary"
                      size="lg"
                    >
                      {isPaused ? (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Продолжить
                        </>
                      ) : (
                        <>
                          <Pause className="w-4 h-4 mr-2" />
                          Пауза
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Instructions */}
            {!recordedBlob && !isRecording && (
              <div className="text-center text-sm text-muted-foreground">
                <p>Нажмите <strong>Начать запись</strong> чтобы снять видеовизитку</p>
                <p className="mt-1">Максимальная рекомендуемая длина: 2-3 минуты</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Filters Panel */}
        <div className="lg:col-span-1">
          <VideoFilters
            filters={filters}
            onChange={setFilters}
            videoRef={videoRef}
            disabled={isRecording}
          />
        </div>
      </div>
    </div>
  )
}
