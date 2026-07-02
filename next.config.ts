import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Faster dev rebuilds
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"],
  },
};

export default nextConfig;
