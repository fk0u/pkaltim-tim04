import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" }
    ],
  },
  /* experimental: {
    // @ts-ignore
    allowedDevOrigins: ["100.79.40.44", "localhost:3000"]
  } */
};

export default nextConfig;
