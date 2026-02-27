import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { HeroCamera } from '@/components/hero-camera'

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

      {/* The Problem Section */}
      <section className="relative z-10 w-full bg-white dark:bg-[#111] py-24 sm:py-32 border-y border-black/5 dark:border-white/5">
         <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
            
            <div className="grid lg:grid-cols-3 gap-12 sm:gap-8 max-w-6xl mx-auto">
              {/* Loom Pain */}
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-[14px] bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center text-zinc-900 dark:text-zinc-100 mb-2 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                  <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </div>
                <h3 className="text-xl font-black tracking-tight text-[#111] dark:text-[#F3F3F3]">Not Loom.</h3>
                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                  Loom pages are heavy, loaded with transcriptions, comments, and noise. Reechy gives you a clean, dedicated pitch page.
                </p>
              </div>

              {/* CapCut Pain */}
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-[14px] bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center text-zinc-900 dark:text-zinc-100 mb-2 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                  <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                </div>
                <h3 className="text-xl font-black tracking-tight text-[#111] dark:text-[#F3F3F3]">Not CapCut.</h3>
                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                  Stop downloading videos just to trim bad takes. Our frictionless in-browser editor lets you polish videos instantly.
                </p>
              </div>

              {/* VEED Pain */}
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-[14px] bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center text-zinc-900 dark:text-zinc-100 mb-2 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                  <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className="text-xl font-black tracking-tight text-[#111] dark:text-[#F3F3F3]">Not VEED.</h3>
                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                  Generic video tools aren't built for sales. Reechy generates an instant share page with your Calendly link appended.
                </p>
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
