/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['github.com', 'instagram.com', 'pbs.twimg.com', 'railway.app'],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      type: 'asset/source',
    });
    return config;
  },
}

module.exports = nextConfig
