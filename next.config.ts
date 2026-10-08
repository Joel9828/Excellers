import path from "node:path";
import type { NextConfig } from "next";

/**
 * `npm run export` emits a fully static `out/` folder that can be dropped on
 * any plain web host. The normal dev/`npm run build` path is untouched.
 */
const isStaticExport = process.env.EXPORT_STATIC === "1";

/**
 * Relative asset URLs, for serving the export from a SUB-FOLDER rather than a
 * domain root. Off by default: root deploys (Hostinger public_html, Vercel)
 * want absolute paths, and `next/font` rejects a relative `assetPrefix`
 * outright when building with webpack.
 */
const isRelative = process.env.EXPORT_RELATIVE === "1";

const nextConfig: NextConfig = {
  // Pin the workspace root: a stray package-lock.json lives above this folder
  // and the bundler otherwise warns about inferring the wrong root.
  turbopack: { root: path.resolve(__dirname) },

  ...(isStaticExport
    ? {
        output: "export" as const,
        // no server, so next/image cannot optimise on the fly
        images: { unoptimized: true },
        ...(isRelative ? { assetPrefix: "./" } : {}),
      }
    : {}),
};

export default nextConfig;
