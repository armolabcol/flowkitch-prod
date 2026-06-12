import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/favicon.ico",
        destination: "/brand/favicon-kitch.webp",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
