/**
 * Structured Data Component
 *
 * This component adds JSON-LD structured data to the page for SEO.
 *
 * SECURITY NOTE: The use of dangerouslySetInnerHTML here is SAFE because:
 * - The data is static JSON defined inline within this file
 * - It's NOT user-generated or fetched from external sources
 * - This is the standard pattern for JSON-LD in React/Next.js applications
 *
 * Learn more: https://schema.org/SoftwareApplication
 */

export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Reechy",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "156"
    },
    "description": "The fastest way to record, edit, and share pitch videos. Built-in teleprompter, in-browser trimming, and instant Calendly booking pages.",
    "featureList": [
      "Video recording directly in browser",
      "Built-in teleprompter",
      "In-browser video editing",
      "Instant shareable pitch pages",
      "Calendly integration",
      "Custom camera layouts and filters"
    ],
    "author": {
      "@type": "Person",
      "name": "Yerdaulet"
    },
    "url": "https://reechy.cam"
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
