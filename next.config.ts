import type { NextConfig } from "next";
import { env } from "./lib/env";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com`,
        port: "",
      },
    ],
  },
};

export default nextConfig;
