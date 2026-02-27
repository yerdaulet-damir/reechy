import { Metadata } from 'next'
import { getVideoData, trackVideoView } from '@/actions/share'
import { FullscreenViewer } from '@/components/fullscreen-viewer'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  // read route params
  const { id } = await params
 
  // fetch data
  const data = await getVideoData(id)
 
  if (!data) {
    return {
      title: 'Video Not Found | Reechy',
    }
  }

  return {
    title: `${data.title} | Reechy Pitch`,
    description: 'Watch this Pitch Video generated with Reechy.',
    openGraph: {
      title: data.title,
      description: 'Watch this Pitch Video generated with Reechy.',
      type: 'video.other',
      url: `https://reechy.live/v/${id}`,
    },
    twitter: {
      card: 'player',
      title: data.title,
      description: 'Watch this Pitch Video generated with Reechy.',
    }
  }
}
 
export default async function ViewerPage({ params }: Props) {
  const { id } = await params
  const data = await getVideoData(id)

  if (!data) {
    notFound()
  }

  // Increment view count since someone just loaded the page
  await trackVideoView(id)

  // Construct the legacy VideoCardData format for the existing component
  const cardData = {
    title: data.title,
    agenda: "• Watch the video message\n• Book a time below",
    callToAction: "Book a Strategy Call",
    calendlyUrl: "", // Assuming the creator didn't put one, we can make it optional
    videoUrl: data.videoUrl,
    trimStart: 0,
    trimEnd: 999999, // The video served from R2 is theoretically already trimmed by the time it uploads if we implement real trimming later
    filters: {
        filter: 'none' as const,
        intensity: 0,
        flipHorizontal: false,
        brightness: 100,
        contrast: 100,
        saturation: 100,
        grayscale: false,
        sepia: false,
        hueRotate: 0,
        blur: 0,
        noise: 0,
        invert: false,
        beauty: false
    },
    frame: 'none' as const,
  }

  return (
    <div className="w-full h-screen bg-black relative">
      <FullscreenViewer data={cardData} />

      {/* Top Floating "Powered By" Badge for Virality */}
      <div className="fixed top-6 left-6 z-50 pointer-events-none fade-in slide-down">
        <Link href="/" className="pointer-events-auto">
          <div className="bg-black/40 backdrop-blur-md border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.5)] rounded-full px-4 py-2 flex items-center gap-2.5 transition-all hover:scale-105 hover:bg-black/60 group">
            <div className="w-[16px] h-[16px] bg-[#0066FF] rounded-[4px] flex items-center justify-center shrink-0">
              <div className="w-[6px] h-[6px] bg-white rounded-full shadow-sm" />
            </div>
            <span className="text-[12px] font-bold text-white/90 flex items-center gap-1.5">
              Powered by Reechy
              <Sparkles className="w-3 h-3 text-[#0066FF] group-hover:rotate-12 transition-transform duration-500" />
            </span>
          </div>
        </Link>
      </div>
    </div>
  )
}
