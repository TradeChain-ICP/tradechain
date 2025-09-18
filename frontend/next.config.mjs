/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Enable static export for ICP deployment
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,

  // Handle asset prefix for ICP canisters
  assetPrefix: process.env.NODE_ENV === 'production' ? './' : undefined,

  // Disable server-side features for static export
  trailingSlash: true,

  // Optimize for static hosting
  poweredByHeader: false,

  // Handle routing for ICP
  distDir: 'out',

  // Environment variables that will be available at build time
  env: {
    NEXT_PUBLIC_DFX_NETWORK: process.env.NEXT_PUBLIC_DFX_NETWORK,
    NEXT_PUBLIC_IC_HOST: process.env.NEXT_PUBLIC_IC_HOST,
    NEXT_PUBLIC_USER_MANAGEMENT_CANISTER_ID: process.env.NEXT_PUBLIC_USER_MANAGEMENT_CANISTER_ID,
  },

  // Configure webpack for ICP compatibility
  webpack: (config, { dev, isServer }) => {
    // Handle .mjs files
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    });

    // Fallback for Node.js modules in browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }

    return config;
  },

  // Handle redirects and rewrites for SPA behavior on ICP
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [
        {
          source: '/:path*',
          destination: '/:path*',
        },
      ],
      fallback: [
        {
          source: '/:path*',
          destination: '/index.html',
        },
      ],
    };
  },
};

export default nextConfig;
