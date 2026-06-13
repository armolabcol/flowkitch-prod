import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Single-process bundle — reduces threads on shared hosting (Hostinger) */
  output: "standalone",
  compress: true,
  poweredByHeader: false,
  /** Avoid image optimizer worker threads on limited hosting */
  images: {
    unoptimized: true,
  },
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
