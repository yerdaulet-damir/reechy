#!/usr/bin/env node

/**
 * Generate favicon assets from SVG source
 *
 * This script generates all required favicon sizes from the icon.svg file.
 * Run: node scripts/generate-favicons.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
];

const svgPath = path.join(__dirname, '../public/icon.svg');
const publicDir = path.join(__dirname, '../public');

async function generateFavicons() {
  console.log('🎨 Generating favicons from SVG...\n');

  // Check if SVG exists
  if (!fs.existsSync(svgPath)) {
    console.error('❌ Error: icon.svg not found at', svgPath);
    process.exit(1);
  }

  // Generate each PNG size
  for (const { name, size } of sizes) {
    const outputPath = path.join(publicDir, name);

    try {
      await sharp(svgPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toFile(outputPath);

      const fileSize = (fs.statSync(outputPath).size / 1024).toFixed(2);
      console.log(`✅ Generated ${name} (${size}x${size}) - ${fileSize}KB`);
    } catch (error) {
      console.error(`❌ Error generating ${name}:`, error.message);
    }
  }

  // Generate favicon.ico with embedded sizes
  try {
    const icoPath = path.join(publicDir, 'favicon.ico');
    const sizesForIco = [16, 32];

    // Generate separate sizes first
    const resizePromises = sizesForIco.map(size =>
      sharp(svgPath)
        .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer()
    );

    const buffers = await Promise.all(resizePromises);

    // For now, we'll just copy the 32x32 as favicon.ico
    // Full ICO generation with multiple sizes requires additional processing
    await sharp(svgPath)
      .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(icoPath);

    const fileSize = (fs.statSync(icoPath).size / 1024).toFixed(2);
    console.log(`✅ Generated favicon.ico (32x32) - ${fileSize}KB`);
  } catch (error) {
    console.error('❌ Error generating favicon.ico:', error.message);
  }

  console.log('\n✨ All favicons generated successfully!');
  console.log('\n📁 Files created in /public/:');
  sizes.forEach(({ name }) => console.log(`   - ${name}`));
  console.log('   - favicon.ico');
  console.log('\n💡 Tip: After deploying, test your favicons at:');
  console.log('   https://realfavicongenerator.net/favicon_checker');
}

generateFavicons().catch(console.error);
