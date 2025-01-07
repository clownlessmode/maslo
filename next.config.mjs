import createMDX from "@next/mdx"

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["mdx", "ts", "tsx"],
  reactStrictMode: false,
  experimental: {
    mdxRs: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

const withMDX = createMDX({})

export default withMDX(nextConfig)
