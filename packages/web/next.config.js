/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  async rewrites() {
    return [
      {
        source: '/ipfs/:path*',
        destination: 'https://open-lake.infura-ipfs.io/ipfs/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
