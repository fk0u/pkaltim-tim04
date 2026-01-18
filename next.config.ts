import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "jadesta.kemenparekraf.go.id" },
      { protocol: "https", hostname: "wonderfulindonesia.co.id" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "selasar.co" },
      { protocol: "https", hostname: "infobenua.com" },
      { protocol: "https", hostname: "space-kd.sgp1.cdn.digitaloceanspaces.com" },
      { protocol: "https", hostname: "asset.kompas.com" },
      { protocol: "https", hostname: "www.niaga.asia" },
      { protocol: "https", hostname: "ik.imagekit.io" },
      { protocol: "https", hostname: "hutanlindungwehea.id" },
      { protocol: "https", hostname: "i.pravatar.cc" }
    ],
  },
};

export default nextConfig;
