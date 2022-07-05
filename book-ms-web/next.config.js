/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    emotion: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/book',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
