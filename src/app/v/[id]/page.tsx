import { Metadata } from 'next'
import { getVideoData, trackVideoView } from '@/actions/share'
import { FullscreenViewer } from '@/components/fullscreen-viewer'
import { BrandingBadge } from '@/components/branding-badge'
import { notFound } from 'next/navigation'

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
      url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/v/${id}`,
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
    agenda: data.agenda || "",
    callToAction: data.callToAction || "",
    calendlyUrl: data.calendlyUrl || "",
    videoUrl: data.videoUrl,
    trimStart: data.trimStart || 0,
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

      {/* Top Floating Branding Badge for Virality */}
      <BrandingBadge />
    </div>
  )
}
