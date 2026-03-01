import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { HeroCamera } from '@/components/camera/hero-camera'

export default function Home() {
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
          <Link href="/" className="flex items-center gap-3 cursor-pointer group">
            <div className="w-[32px] h-[32px] bg-[#0066FF] rounded-[10px] flex items-center justify-center shadow-md transition-transform group-hover:scale-105">
               <div className="w-[12px] h-[12px] bg-white rounded-full animate-pulse shadow-sm" />
            </div>
            <span className="text-[22px] font-black tracking-tight text-[#111] dark:text-[#F3F3F3] leading-none">
              Reechy
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <a href="https://github.com/yerdaulet-damir/reechy" target="_blank" rel="noreferrer" className="hidden sm:flex items-center gap-2 text-[14px] font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
            Star on GitHub
          </a>
          <Link href="/record">
            <Button className="bg-[#0066FF] text-white hover:bg-[#0052CC] rounded-full px-6 py-5 h-auto text-[14px] font-bold transition-all shadow-[0_4px_12px_rgba(0,102,255,0.25)]">
              Contact Sales
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 w-full flex items-center max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 pb-20 pt-8">
        <div className="flex flex-col xl:flex-row items-center xl:items-start justify-between w-full gap-16 xl:gap-12">
          
          {/* Left: Hero Content */}
          <div className="w-full xl:w-[50%] flex flex-col justify-center space-y-10 shrink-0 pt-0 xl:pt-12 max-w-2xl mx-auto xl:mx-0 text-center xl:text-left">
            <div className="space-y-6 md:space-y-8">
              <h1 className="text-[3.5rem] sm:text-[4.5rem] lg:text-[5rem] leading-[1.05] font-black tracking-tight text-[#111] dark:text-[#F3F3F3]">
                Record a pitch in <span className="text-[#0066FF] inline-block">60 seconds.</span> Send it in one link.
              </h1>
              <p className="text-[1.25rem] sm:text-[1.5rem] leading-[1.5] text-zinc-500 dark:text-zinc-400 font-medium">
                Built-in teleprompter. Instant pitch page with Calendly booking. No bloated share screens.
              </p>
            </div>

            {/* Primary CTA */}
            <div className="mt-8 flex flex-col sm:flex-row items-center xl:items-start gap-4 mx-auto xl:mx-0">
              <Link href="/record">
                <Button className="bg-[#111] text-white hover:bg-black dark:bg-[#F3F3F3] dark:text-[#111] dark:hover:bg-white rounded-full px-8 h-16 text-[17px] font-bold transition-all shadow-[0_8px_30px_rgba(0,0,0,0.12)] inline-flex items-center gap-3 group">
                  Record your first pitch <span className="font-sans ml-1 text-xl leading-none transform transition-transform group-hover:translate-x-1">→</span>
                </Button>
              </Link>
              <div className="flex h-16 items-center px-2">
                <span className="text-[14px] font-semibold text-zinc-400">Launch now. No account required.</span>
              </div>
            </div>

            {/* Verified Trust Badges */}
            <div className="pt-6 flex flex-wrap justify-center xl:justify-start gap-6 sm:gap-10 opacity-60 mix-blend-luminosity dark:mix-blend-normal">
               <div className="flex items-center gap-2 text-[15px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  100% Open Source
               </div>
               <div className="flex items-center gap-2 text-[15px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                  <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
                  Client-Side Editing
               </div>
               <div className="flex items-center gap-2 text-[15px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                  <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                  Private by Default
               </div>
            </div>
          </div>

          {/* Right: Interactive Camera Inline */}
          <div className="w-full xl:w-[45%] flex justify-center xl:justify-end shrink-0 perspective-[1200px]">
            <HeroCamera />
          </div>

        </div>
      </main>

      {/* Video Demo / Cinematic Showcase Section */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-12 mt-12 sm:mt-24 mb-24 md:mb-32">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-10 w-full flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-500 text-sm font-bold uppercase tracking-wider mb-2">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
            Instant Share
          </div>
          <h2 className="text-[2.5rem] sm:text-[3rem] leading-[1.1] font-black tracking-tight text-[#111] dark:text-[#F3F3F3]">
            Share your pitch instantly
          </h2>
          <p className="text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl font-medium">
            Hit record, stop, and share. Your video is live with an AI-generated title, summary, and your Calendly booking link.
          </p>
        </div>

        {/* Cinematic TikTok-Style Viewer Card */}
        <div className="relative w-full aspect-[9/16] md:aspect-video rounded-3xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] bg-black group font-sans border border-white/10 mx-auto max-w-[1000px]">
          
          {/* Edge-to-edge Video */}
          <video 
            src="/Animated_Sales_Pitch_Video_Generation.mp4" 
            autoPlay 
            loop 
            muted // Defaulting to muted for standard autoplay rules on landing pages, but adding a volume toggle
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Cinematic Gradients for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent pointer-events-none hidden md:block" />

          {/* Floating Audio Toggle (Top Right) */}
          <div className="absolute top-6 right-6 z-30">
            <button className="w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all shadow-lg hover:scale-105">
               <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></svg>
            </button>
          </div>

          {/* Overlay UI (Bottom controls) */}
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 z-20 flex flex-col md:flex-row items-end md:items-center justify-between pointer-events-none">
             
            {/* Left: Title & Agenda */}
            <div className="w-full md:w-[65%] flex flex-col gap-3 pointer-events-auto">
               <div className="flex items-center gap-3 mb-1">
                 <div className="w-8 h-8 rounded-full bg-[#0066FF] flex items-center justify-center text-white font-bold shadow-sm text-xs">
                    YD
                 </div>
                 <span className="text-sm font-bold text-white shadow-sm">Yerdaulet Damir</span>
                 <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-[10px] uppercase font-bold text-white tracking-wider">
                   reechy.com/pitch
                 </span>
               </div>
               
               <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                 Reechy Partnership Proposal
               </h1>

               <ul className="space-y-1.5 mt-2 hidden sm:block">
                 <li className="flex items-start gap-3 text-white/90 drop-shadow-md">
                   <span className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0 shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                   <span className="text-sm md:text-base font-medium">Why Reechy beats generic screen recorders</span>
                 </li>
                 <li className="flex items-start gap-3 text-white/90 drop-shadow-md">
                   <span className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0 shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                   <span className="text-sm md:text-base font-medium">Walkthrough of the immersive cinematic viewer</span>
                 </li>
                 <li className="flex items-start gap-3 text-white/90 drop-shadow-md">
                   <span className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0 shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                   <span className="text-sm md:text-base font-medium">Next steps and Calendly integration</span>
                 </li>
               </ul>
            </div>

            {/* Right: Call to Action (Booking Widget overlay) */}
            <div className="w-full md:w-auto mt-6 md:mt-0 pointer-events-auto shrink-0 flex flex-col items-start md:items-end">
               <Button className="w-full md:w-auto bg-white hover:bg-zinc-200 text-black rounded-2xl md:rounded-full px-6 md:px-8 py-6 md:py-7 text-base md:text-[17px] font-bold shadow-[0_8px_30px_rgba(255,255,255,0.2)] transition-all hover:scale-[1.03] active:scale-[0.98] group flex items-center justify-center">
                  <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 mr-3 text-[#0066FF] opacity-90"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                  Book a Discovery Call
                  <svg fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 ml-3 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
               </Button>
            </div>
             
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="relative z-10 w-full bg-white dark:bg-[#111] py-24 sm:py-32 border-y border-black/5 dark:border-white/5">
         <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
            
            <div className="grid lg:grid-cols-3 gap-12 sm:gap-8 max-w-7xl mx-auto">
              
              {/* Feature 1: Clean Pages */}
              <div className="flex flex-col gap-6 group cursor-default">
                <div className="relative h-48 md:h-56 rounded-2xl bg-zinc-100 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 overflow-hidden flex items-center justify-center p-4">
                  {/* Abstract UI: Noisy vs Clean */}
                  <div className="w-full h-full flex gap-4 transition-transform duration-500 group-hover:scale-[1.03]">
                    {/* Noisy Page */}
                    <div className="w-1/2 h-full bg-white dark:bg-[#1A1A1A] rounded-lg shadow-sm border border-black/5 dark:border-white/5 opacity-50 flex flex-col p-3 gap-2 blur-[1px]">
                       <div className="w-full h-1/2 bg-zinc-200 dark:bg-zinc-800 rounded flex-shrink-0" />
                       <div className="flex gap-2">
                         <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 flex-shrink-0" />
                         <div className="w-full h-3 bg-zinc-200 dark:bg-zinc-800 rounded mt-1.5" />
                       </div>
                       <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded" />
                       <div className="w-3/4 h-2 bg-zinc-200 dark:bg-zinc-800 rounded" />
                       <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    </div>
                    {/* Reechy Page */}
                    <div className="w-1/2 h-full bg-white dark:bg-[#1A1A1A] rounded-lg shadow-lg border border-[#0066FF]/20 flex flex-col p-3 gap-3 relative z-10 transform translate-y-2 -translate-x-2">
                       <div className="w-full h-3/5 bg-zinc-100 dark:bg-zinc-800 rounded flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-[#0066FF] flex items-center justify-center">
                             <div className="w-0 h-0 border-t-4 border-b-4 border-l-[6px] border-transparent border-l-white ml-1" />
                          </div>
                       </div>
                       <div className="w-1/2 h-3 bg-zinc-200 dark:bg-zinc-700 rounded mx-auto" />
                       <div className="w-full h-8 bg-[#0066FF] rounded-md mt-auto" />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-[#111] dark:text-[#F3F3F3] mb-2">No Cluttered Pages.</h3>
                  <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                    Other tools are heavy with transcriptions and comments. Reechy gives you a beautiful, dedicated pitch page.
                  </p>
                </div>
              </div>

              {/* Feature 2: In Browser */}
              <div className="flex flex-col gap-6 group cursor-default">
                <div className="relative h-48 md:h-56 rounded-2xl bg-zinc-100 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 overflow-hidden flex items-center justify-center p-4">
                  <div className="w-full h-full relative transition-transform duration-500 group-hover:scale-[1.03]">
                     {/* Desktop App */}
                     <div className="absolute top-2 left-2 right-6 bottom-6 bg-zinc-200 dark:bg-zinc-800 rounded-lg opacity-40 blur-[1px] border border-zinc-300 dark:border-zinc-700 flex flex-col pt-1">
                        <div className="h-4 border-b border-zinc-300 dark:border-zinc-700 flex items-center px-2 gap-1">
                           <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                           <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                           <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                        </div>
                        <div className="flex-1 p-2 flex gap-2">
                           <div className="w-1/4 h-full bg-zinc-300 dark:bg-zinc-700 rounded-sm" />
                           <div className="w-3/4 h-full bg-zinc-300 dark:bg-zinc-700 rounded-sm" />
                        </div>
                     </div>
                     {/* Web App */}
                     <div className="absolute top-6 left-6 right-2 bottom-2 bg-white dark:bg-[#1A1A1A] rounded-lg shadow-lg border border-[#0066FF]/20 flex flex-col">
                        <div className="h-6 border-b border-black/5 dark:border-white/5 flex items-center px-2 gap-2">
                           <div className="flex gap-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-400/80" />
                              <div className="w-1.5 h-1.5 rounded-full bg-amber-400/80" />
                              <div className="w-1.5 h-1.5 rounded-full bg-green-400/80" />
                           </div>
                           <div className="flex-1 h-3 bg-zinc-100 dark:bg-zinc-800 rounded-sm mx-4" />
                        </div>
                        <div className="flex-1 p-3 flex flex-col gap-2">
                           <div className="w-full flex-1 bg-zinc-100 dark:bg-zinc-800 rounded flex items-center justify-center">
                              <span className="text-[10px] font-bold text-zinc-400">Trim Instantly</span>
                           </div>
                           <div className="h-4 bg-[#0066FF]/10 rounded flex items-center px-1 gap-1">
                              <div className="w-2 h-full bg-[#0066FF] rounded-r-sm opacity-50" />
                              <div className="flex-1 h-1 bg-[#0066FF] rounded-full" />
                              <div className="w-2 h-full bg-[#0066FF] rounded-l-sm opacity-50" />
                           </div>
                        </div>
                     </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-[#111] dark:text-[#F3F3F3] mb-2">In-Browser, No Downloads.</h3>
                  <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                    Stop downloading massive desktop apps just to trim bad takes. Our frictionless editor works instantly.
                  </p>
                </div>
              </div>

              {/* Feature 3: Built for Sales */}
              <div className="flex flex-col gap-6 group cursor-default">
                <div className="relative h-48 md:h-56 rounded-2xl bg-zinc-100 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 overflow-hidden flex items-center justify-center p-4">
                  <div className="w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:scale-[1.03]">
                    <div className="w-[85%] h-[85%] bg-white dark:bg-[#1A1A1A] rounded-xl shadow-lg border border-[#0066FF]/20 overflow-hidden flex flex-col">
                       {/* Header */}
                       <div className="h-10 border-b border-black/5 dark:border-white/5 flex items-center px-3 justify-between">
                          <div className="w-1/3 h-3 bg-zinc-200 dark:bg-zinc-800 rounded" />
                          <div className="w-6 h-6 rounded-full bg-[#0066FF]/10 text-[#0066FF] flex items-center justify-center">
                             <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>
                          </div>
                       </div>
                       {/* Body */}
                       <div className="flex-1 flex p-2 gap-2">
                          <div className="w-1/2 h-full bg-zinc-100 dark:bg-zinc-800 rounded flex flex-col p-2 gap-2 justify-center items-center">
                             <div className="w-full h-1/2 bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
                             <div className="w-3/4 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
                          </div>
                          {/* Calendar widget abstraction */}
                          <div className="w-1/2 h-full bg-[#0066FF]/5 dark:bg-[#0066FF]/10 border border-[#0066FF]/20 rounded p-1.5 flex flex-col gap-1.5">
                             <div className="w-1/2 h-2 bg-[#0066FF]/50 rounded-sm mb-1" />
                             <div className="grid grid-cols-4 gap-1">
                                {[...Array(12)].map((_, i) => (
                                   <div key={i} className={`h-2 rounded-[2px] ${i === 5 ? 'bg-[#0066FF]' : 'bg-black/5 dark:bg-white/10'}`} />
                                ))}
                             </div>
                             <div className="mt-auto w-full h-4 bg-[#0066FF] rounded-sm flex items-center justify-center">
                                <div className="w-1/2 h-1 bg-white/50 rounded-full" />
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-[#111] dark:text-[#F3F3F3] mb-2">Built for Sales, Not Just Video.</h3>
                  <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                    Generic video tools aren't built to convert. We generate an instant share page with your Calendly link appended.
                  </p>
                </div>
              </div>

            </div>

            {/* Advanced Features Representation */}
            <div className="mt-24 max-w-5xl mx-auto space-y-16">
               <div className="text-center space-y-6">
                  <h2 className="text-[2.5rem] sm:text-[3rem] leading-tight font-black tracking-tight text-[#111] dark:text-[#F3F3F3]">
                     Everything you need to shoot the perfect take.
                  </h2>
                  <p className="text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto font-medium">
                    Equipped with advanced in-browser capabilities that feel native to your desktop.
                  </p>
               </div>

               <div className="grid sm:grid-cols-3 gap-12">
                   <div className="flex flex-col items-center text-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-white dark:bg-[#111] text-[#111] dark:text-[#F3F3F3] flex items-center justify-center shadow-sm border border-black/5 dark:border-white/10">
                         <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                      </div>
                      <h4 className="text-xl font-bold text-[#111] dark:text-white">Beast Teleprompter</h4>
                      <p className="text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">A floating, controllable teleprompter paired with accurate timecodes so you never forget your script.</p>
                   </div>

                   <div className="flex flex-col items-center text-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-white dark:bg-[#111] text-[#111] dark:text-[#F3F3F3] flex items-center justify-center shadow-sm border border-black/5 dark:border-white/10">
                         <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>
                      </div>
                      <h4 className="text-xl font-bold text-[#111] dark:text-white">Trim in Browser</h4>
                      <p className="text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">Instantly cut out the awkward start and end of your video without leaving the page.</p>
                   </div>

                   <div className="flex flex-col items-center text-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-white dark:bg-[#111] text-[#111] dark:text-[#F3F3F3] flex items-center justify-center shadow-sm border border-black/5 dark:border-white/10">
                         <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>
                      </div>
                      <h4 className="text-xl font-bold text-[#111] dark:text-white">Instant Booking Page</h4>
                      <p className="text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">Generate a sleek URL with your custom headline, agenda points, and a built-in calendar.</p>
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
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 items-center">
              <Link href="/record">
                <Button className="bg-[#0066FF] text-white hover:bg-[#0052CC] rounded-full px-8 h-14 text-[15px] font-bold transition-all shadow-[0_4px_12px_rgba(0,102,255,0.25)]">
                  Start Recording
                </Button>
              </Link>
              <a href="https://github.com/yerdaulet-damir/reechy" target="_blank" rel="noreferrer">
                <Button className="bg-transparent border-2 border-[#111] text-[#111] hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-[#111] rounded-full px-8 h-14 text-[15px] font-bold transition-all inline-flex items-center gap-3">
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
