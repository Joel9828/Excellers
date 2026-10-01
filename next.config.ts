import path from "node:path";
import type { NextConfig } from "next";

/**
 * `EXPORT_STATIC=1 npm run build` emits a fully static `out/` folder that can
 * be dropped on any static host. The normal build is untouched.
 */
const isStaticExport = process.env.EXPORT_STATIC === "1";

const nextConfig: NextConfig = {
  // Pin the workspace root: a stray package-lock.json lives above this folder
  // and Turbopack otherwise warns about inferring the wrong root.
  turbopack: { root: path.resolve(__dirname) },

  ...(isStaticExport
    ? {
        output: "export" as const,
        // no server, so next/image cannot optimise on the fly
        images: { unoptimized: true },
        // relative asset URLs, so the export works from any sub-path
        assetPrefix: "./",
      }
    : {}),
};

export default nextConfig;
