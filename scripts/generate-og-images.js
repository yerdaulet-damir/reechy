#!/usr/bin/env node

/**
 * Generate Open Graph images for social sharing
 *
 * This script generates OG images (1200x630) for social media sharing.
 * It creates a visually appealing card with the Reechy branding.
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');
const ogDir = path.join(publicDir, 'og-images');

async function generateOGImages() {
  console.log('🎨 Generating Open Graph images...\n');

  // Create og-images directory if it doesn't exist
  if (!fs.existsSync(ogDir)) {
    fs.mkdirSync(ogDir, { recursive: true });
  }

  const ogWidth = 1200;
  const ogHeight = 630;

  // Create a background gradient
  const background = sharp({
    create: {
      width: ogWidth,
      height: ogHeight,
      channels: 4,
      background: { r: 250, g: 250, b: 250, alpha: 1 }
    }
  });

  // For now, we'll create a simple OG image with the logo and text
  // In production, you might want to use a more sophisticated approach
  // with actual typography rendering

  try {
    // Load the logo SVG
    const logoSvg = path.join(__dirname, '../public/icon.svg');

    // Create a simple layout: logo on left, text on right
    // This is a simplified version - for production use, consider using:
    // - @vercel/og (recommended for Next.js)
    // - canvas or puppeteer for text rendering
    // - Figma/Sketch for perfect design control

    const logoBuffer = await sharp(logoSvg)
      .resize(200, 200)
      .toBuffer();

    // Create a composite image with logo and a simple background
    const ogImage = await sharp({
      create: {
        width: ogWidth,
        height: ogHeight,
        channels: 4,
        background: { r: 250, g: 250, b: 250, alpha: 1 }
      }
    })
    .composite([
      {
        input: logoBuffer,
        top: 215,
        left: 100
      }
    ])
    .png()
    .toBuffer();

    // Save the default OG image
    const ogPath = path.join(ogDir, 'og-image-default.png');
    fs.writeFileSync(ogPath, ogImage);

    const fileSize = (fs.statSync(ogPath).size / 1024).toFixed(2);
    console.log(`✅ Generated og-image-default.png (${ogWidth}x${ogHeight}) - ${fileSize}KB`);

    // Twitter uses the same image
    const twitterPath = path.join(ogDir, 'twitter-image.png');
    fs.writeFileSync(twitterPath, ogImage);
    console.log(`✅ Generated twitter-image.png (${ogWidth}x${ogHeight}) - ${fileSize}KB`);

    console.log('\n✨ OG images generated!');
    console.log('\n⚠️  Note: These are basic OG images with logo only.');
    console.log('   For production-quality OG images with typography, consider:');
    console.log('   1. Using @vercel/og for dynamic generation');
    console.log('   2. Creating designs in Canva/Figma');
    console.log('   3. Using the SVG prompts in public/og-images/README.md');

  } catch (error) {
    console.error('❌ Error generating OG images:', error.message);
    console.log('\n💡 Manual creation may be needed. See public/og-images/README.md for specs.');
  }
}

generateOGImages().catch(console.error);
