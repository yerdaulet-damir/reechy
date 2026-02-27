import Link from 'next/link'
import { Plus } from 'lucide-react'

export function BrandingBadge() {
  return (
    <div className="fixed top-6 left-6 z-50 pointer-events-auto fade-in slide-down">
      <Link href="/">
        <div className="group flex items-center bg-black/40 hover:bg-black/80 backdrop-blur-xl border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.5)] rounded-full p-1.5 pr-5 transition-all duration-300 hover:scale-[1.02]">
          {/* Logo Mark */}
          <div className="w-[32px] h-[32px] bg-[#0066FF] rounded-full flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,102,255,0.4)] mr-3">
             <div className="w-[10px] h-[10px] bg-white rounded-full animate-[pulse_3s_ease-in-out_infinite] shadow-sm" />
          </div>
          
          <div className="flex flex-col justify-center">
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest leading-none mb-0.5">
              Powered by
            </span>
            <span className="text-[14px] font-bold text-white leading-none flex items-center gap-1.5">
              Reechy
            </span>
          </div>
          
          {/* Create CTA Arrow */}
          <div className="ml-4 pl-4 border-l border-white/10 hidden sm:flex items-center gap-1.5">
             <span className="text-[12px] font-semibold text-white/70 group-hover:text-white transition-colors">Create yours</span>
             <Plus className="w-3.5 h-3.5 text-[#0066FF]" />
          </div>
        </div>
      </Link>
    </div>
  )
}
