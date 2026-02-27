"use client"

import { useRouter } from "next/navigation"
import { CameraInterface } from "./camera-interface"

export function HeroCamera() {
  const router = useRouter()
  return (
    <div 
       className="relative w-full max-w-[500px] aspect-[4/5] sm:aspect-square xl:aspect-auto xl:h-[640px] transform-gpu transition-all duration-[800ms] hover:-translate-y-2 hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] rounded-[32px] md:rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.06)] bg-white/60 dark:bg-[#111]/80 backdrop-blur-2xl ring-1 ring-black/5 dark:ring-white/10 p-2 md:p-3 flex flex-col group cursor-pointer"
       onClick={() => router.push('/record')}
    >
      <div className="pointer-events-none w-full h-full relative rounded-[24px] md:rounded-[32px] bg-black isolation-auto will-change-transform overflow-hidden">
        <CameraInterface onVideoComplete={() => {}} inline />
      </div>
      <div className="absolute inset-0 z-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-sm rounded-[32px] md:rounded-[40px]">
         <div className="bg-white text-black px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
            Click to begin session
         </div>
      </div>
    </div>
  )
}
