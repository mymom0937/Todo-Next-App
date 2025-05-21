# Favicon Guide for Todo Next App

This guide explains how to update the favicon for your Todo Next App.

## Current Favicon Setup

The app is currently set up with a complete favicon system that includes:

- `favicon.ico` - The classic favicon displayed in browser tabs
- `favicon-16x16.png` and `favicon-32x32.png` - PNG versions for modern browsers
- `apple-touch-icon.png` - Icon for iOS devices when added to home screen
- `android-chrome-192x192.png` and `android-chrome-512x512.png` - Icons for Android devices
- `mstile-150x150.png` - Icon for Windows tiles
- `safari-pinned-tab.svg` - Monochrome icon for Safari pinned tabs
- `browserconfig.xml` - Configuration for Microsoft browsers
- `site.webmanifest` - Web app manifest for PWA support

## How to Update the Favicon

To update the favicon with a new icon from Iconfinder or any other source:

1. Download your new icon (preferably in SVG or high-resolution PNG format)
2. Replace the file at `scripts/source-icon.png` with your new icon
3. Run the favicon generation script:
   ```
   node scripts/generate-favicons.js
   ```
4. Verify that all favicon files were generated correctly:
   ```
   node scripts/verify-favicons.js
   ```

## Custom Colors

If you want to customize the theme colors:

1. Edit `site.webmanifest` to change `theme_color` and `background_color`
2. Edit `browserconfig.xml` to change the `TileColor`
3. Update the `metadata.config.js` file to match these colors

## Manual Customization

For more advanced customization:

1. Edit the `scripts/generate-favicons.js` file to change sizes or add new formats
2. Modify `app/head.jsx` to update the metadata tags
3. Update `app/metadata.config.js` to change the metadata configuration

## Testing Your Favicon

To test your favicon across different devices and browsers:

1. Run your Next.js app in development mode
2. Check the favicon in different browsers
3. Test on mobile devices by adding to home screen
4. Use browser developer tools to simulate different devices 