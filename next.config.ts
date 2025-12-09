import type { NextConfig } from "next";
import "./lib/env";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
    domains: ["unisouk-dev.s3.ap-south-1.amazonaws.com"], // add your S3 bucket hostname
  },
};

export default nextConfig;
