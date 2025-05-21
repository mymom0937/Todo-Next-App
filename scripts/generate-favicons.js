const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const toIco = require('to-ico');

// Create directories if they don't exist
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Base icon path - we'll use a placeholder for now
// You should replace this with your own icon from Iconfinder
const sourceIconPath = path.join(__dirname, 'source-icon.png');

// Generate different sizes
async function generateFavicons() {
  try {
    console.log('Generating favicons...');

    // Create PNG favicons
    await sharp(sourceIconPath)
      .resize(16, 16)
      .toFile(path.join(publicDir, 'favicon-16x16.png'));

    await sharp(sourceIconPath)
      .resize(32, 32)
      .toFile(path.join(publicDir, 'favicon-32x32.png'));

    await sharp(sourceIconPath)
      .resize(180, 180)
      .toFile(path.join(publicDir, 'apple-touch-icon.png'));

    await sharp(sourceIconPath)
      .resize(192, 192)
      .toFile(path.join(publicDir, 'android-chrome-192x192.png'));

    await sharp(sourceIconPath)
      .resize(512, 512)
      .toFile(path.join(publicDir, 'android-chrome-512x512.png'));
      
    // Microsoft tile icon
    await sharp(sourceIconPath)
      .resize(150, 150)
      .toFile(path.join(publicDir, 'mstile-150x150.png'));

    // Create favicon.ico
    const favicon16 = fs.readFileSync(path.join(publicDir, 'favicon-16x16.png'));
    const favicon32 = fs.readFileSync(path.join(publicDir, 'favicon-32x32.png'));
    
    const icoBuffer = await toIco([favicon16, favicon32]);
    fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);

    console.log('Favicons generated successfully!');
  } catch (error) {
    console.error('Error generating favicons:', error);
  }
}

// Run the function
generateFavicons(); 