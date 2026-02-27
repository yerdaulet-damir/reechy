"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Palette, RotateCcw, Sparkles, Sun, Moon } from 'lucide-react'

export interface FilterSettings {
  brightness: number
  contrast: number
  saturation: number
  grayscale: boolean
  sepia: boolean
  invert: boolean
  blur: number
  hueRotate: number
  beauty: boolean
}

const DEFAULT_FILTERS: FilterSettings = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  grayscale: false,
  sepia: false,
  invert: false,
  blur: 0,
  hueRotate: 0,
  beauty: false
}

const PRESETS = [
  { name: 'Оригинал', filters: DEFAULT_FILTERS, icon: '🎬' },
  { name: 'Ч/Б', filters: { ...DEFAULT_FILTERS, grayscale: true, contrast: 115 }, icon: '⚫' },
  { name: 'Сепия', filters: { ...DEFAULT_FILTERS, sepia: true, saturation: 80 }, icon: '🟤' },
  { name: 'Vivid', filters: { ...DEFAULT_FILTERS, saturation: 150, contrast: 110 }, icon: '🌈' },
  { name: 'Moody', filters: { ...DEFAULT_FILTERS, brightness: 90, contrast: 120, saturation: 70 }, icon: '🌙' },
  { name: 'Инверсия', filters: { ...DEFAULT_FILTERS, invert: true }, icon: '🔄' },
  { name: 'Красивый', filters: { ...DEFAULT_FILTERS, beauty: true, brightness: 105, contrast: 95 }, icon: '✨' },
  { name: 'Тёплый', filters: { ...DEFAULT_FILTERS, sepia: true, saturation: 110, brightness: 105 }, icon: '☀️' },
]

interface VideoFiltersProps {
  filters: FilterSettings
  onChange: (filters: FilterSettings) => void
  videoRef: React.RefObject<HTMLVideoElement>
  disabled?: boolean
}

export function VideoFilters({ filters, onChange, videoRef, disabled = false }: VideoFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Apply CSS filters to video element
  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current

      let filterString = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%)`

      if (filters.grayscale) filterString += ' grayscale(100%)'
      if (filters.sepia) filterString += ' sepia(100%)'
      if (filters.invert) filterString += ' invert(100%)'
      if (filters.blur > 0) filterString += ` blur(${filters.blur}px)`
      if (filters.hueRotate > 0) filterString += ` hue-rotate(${filters.hueRotate}deg)`

      // Beauty filter - soft blur + brightness
      if (filters.beauty) {
        filterString = `brightness(105%) contrast(95%) saturate(95%)`
      }

      video.style.filter = filterString
    }
  }, [filters, videoRef])

  const applyPreset = (preset: typeof PRESETS[0]) => {
    onChange(preset.filters)
  }

  const updateFilter = (key: keyof FilterSettings, value: number | boolean) => {
    onChange({ ...filters, [key]: value })
  }

  const resetFilters = () => {
    onChange(DEFAULT_FILTERS)
  }

  return (
    <Card className={disabled ? 'opacity-50 pointer-events-none' : ''}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Фильтры
          </span>
          <Button onClick={resetFilters} variant="ghost" size="sm">
            <RotateCcw className="w-4 h-4 mr-1" />
            Сброс
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Presets */}
        <div>
          <p className="text-sm font-medium mb-3">Быстрые пресеты</p>
          <div className="grid grid-cols-4 gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset)}
                className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                  JSON.stringify(filters) === JSON.stringify(preset.filters)
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <span className="text-2xl">{preset.icon}</span>
                <span className="text-xs text-center">{preset.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Controls */}
        <div>
          <Button
            onClick={() => setShowAdvanced(!showAdvanced)}
            variant="outline"
            size="sm"
            className="w-full"
          >
            {showAdvanced ? 'Скрыть' : 'Показать'} расширенные настройки
          </Button>

          {showAdvanced && (
            <div className="mt-4 space-y-4">
              {/* Brightness */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <label>Яркость</label>
                  <span className="text-muted-foreground">{filters.brightness}%</span>
                </div>
                <Slider
                  value={[filters.brightness]}
                  onValueChange={(v) => updateFilter('brightness', v[0])}
                  min={50}
                  max={150}
                  step={5}
                />
              </div>

              {/* Contrast */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <label>Контраст</label>
                  <span className="text-muted-foreground">{filters.contrast}%</span>
                </div>
                <Slider
                  value={[filters.contrast]}
                  onValueChange={(v) => updateFilter('contrast', v[0])}
                  min={50}
                  max={150}
                  step={5}
                />
              </div>

              {/* Saturation */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <label>Насыщенность</label>
                  <span className="text-muted-foreground">{filters.saturation}%</span>
                </div>
                <Slider
                  value={[filters.saturation]}
                  onValueChange={(v) => updateFilter('saturation', v[0])}
                  min={0}
                  max={200}
                  step={5}
                />
              </div>

              {/* Hue Rotate */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <label>Оттенок</label>
                  <span className="text-muted-foreground">{filters.hueRotate}°</span>
                </div>
                <Slider
                  value={[filters.hueRotate]}
                  onValueChange={(v) => updateFilter('hueRotate', v[0])}
                  min={0}
                  max={360}
                  step={15}
                />
              </div>

              {/* Blur */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <label>Размытие</label>
                  <span className="text-muted-foreground">{filters.blur}px</span>
                </div>
                <Slider
                  value={[filters.blur]}
                  onValueChange={(v) => updateFilter('blur', v[0])}
                  min={0}
                  max={10}
                  step={0.5}
                />
              </div>

              {/* Toggle Filters */}
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => updateFilter('grayscale', !filters.grayscale)}
                  variant={filters.grayscale ? 'default' : 'outline'}
                  size="sm"
                >
                  Ч/Б
                </Button>
                <Button
                  onClick={() => updateFilter('sepia', !filters.sepia)}
                  variant={filters.sepia ? 'default' : 'outline'}
                  size="sm"
                >
                  Сепия
                </Button>
                <Button
                  onClick={() => updateFilter('invert', !filters.invert)}
                  variant={filters.invert ? 'default' : 'outline'}
                  size="sm"
                >
                  Инверсия
                </Button>
                <Button
                  onClick={() => updateFilter('beauty', !filters.beauty)}
                  variant={filters.beauty ? 'default' : 'outline'}
                  size="sm"
                >
                  <Sparkles className="w-4 h-4 mr-1" />
                  Красивый
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Active Filters Badge */}
        {(filters.grayscale || filters.sepia || filters.invert || filters.beauty) && (
          <div className="flex flex-wrap gap-2">
            {filters.grayscale && <Badge>Ч/Б</Badge>}
            {filters.sepia && <Badge>Сепия</Badge>}
            {filters.invert && <Badge>Инверсия</Badge>}
            {filters.beauty && <Badge variant="secondary"><Sparkles className="w-3 h-3 mr-1" />Красивый</Badge>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
