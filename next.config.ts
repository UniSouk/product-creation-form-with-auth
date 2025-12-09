import type { NextConfig } from "next";
import "./lib/env";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
    domains: ["unisouk-dev.s3.ap-south-1.amazonaws.com"],
  },
};

export default nextConfig;
