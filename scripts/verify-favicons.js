const fs = require('fs');
const path = require('path');

// List of favicon files that should be present
const requiredFiles = [
  'favicon.ico',
  'favicon-16x16.png',
  'favicon-32x32.png',
  'apple-touch-icon.png',
  'android-chrome-192x192.png',
  'android-chrome-512x512.png',
  'mstile-150x150.png',
  'safari-pinned-tab.svg',
  'browserconfig.xml'
];

// Check if all files exist
const publicDir = path.join(__dirname, '../public');
let allFilesExist = true;

console.log('Verifying favicon files...');
console.log('-------------------------');

requiredFiles.forEach(file => {
  const filePath = path.join(publicDir, file);
  const exists = fs.existsSync(filePath);
  
  console.log(`${file}: ${exists ? '✓ Found' : '✗ Missing'}`);
  
  if (!exists) {
    allFilesExist = false;
  }
});

console.log('-------------------------');
if (allFilesExist) {
  console.log('All favicon files are present! Your app is ready to use the custom favicon.');
} else {
  console.log('Some favicon files are missing. Please run the generate-favicons.js script again.');
}

// Verify site.webmanifest
const webmanifestPath = path.join(__dirname, '../site.webmanifest');
if (fs.existsSync(webmanifestPath)) {
  console.log('site.webmanifest: ✓ Found');
} else {
  console.log('site.webmanifest: ✗ Missing');
  allFilesExist = false;
} 