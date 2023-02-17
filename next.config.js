/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "bafybeieqevmswsepaxqgmy4i7ho7yby4xanb3w4lrckjzb7j7yyolmtuxa.ipfs.nftstorage.link",
      "ipfs.io",
      "arweave.net"
    ]
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(md|mdx)?$/,
      use: [
        {
          loader: '@mdx-js/loader',
          /** @type {import('@mdx-js/loader').Options} */
          options: {},
        },
      ],
    })
    return config
  },
}

module.exports = nextConfig
