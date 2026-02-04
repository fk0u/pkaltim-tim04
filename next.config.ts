import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" }
    ],
  },
<<<<<<< HEAD
=======
  // experimental: {
  //   allowedDevOrigins: ["100.79.40.44", "localhost:3000"]
  // }
>>>>>>> 332fc3d2c0ba159299a2ec965f3ed464edf8bd18
};

export default nextConfig;
