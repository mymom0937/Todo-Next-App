/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Increase chunk loading timeout
  experimental: {
    // Increase timeout for chunk loading
    timeoutChunkLoad: 30000, // 30 seconds
  },
  
  // Optimize webpack configuration
  webpack: (config, { dev, isServer }) => {
    // Optimize chunk size
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 70000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        automaticNameDelimiter: '~',
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      };
    }
    
    return config;
  },
  
  // Ensure favicon files are properly handled
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
