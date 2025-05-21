import { metadata } from './metadata.config';

export default function Head() {
  return (
    <>
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      
      {/* Apple Touch Icon */}
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      
      {/* Web Manifest */}
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Safari Pinned Tab */}
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
      
      {/* Microsoft Tile */}
      <meta name="msapplication-TileColor" content="#da532c" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      
      {/* Theme Color */}
      <meta name="theme-color" content="#ffffff" />
    </>
  );
} 