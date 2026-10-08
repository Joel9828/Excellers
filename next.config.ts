import path from "node:path";
import type { NextConfig } from "next";

/**
 * This site is static, always. There is no API route, no server component
 * that needs a runtime, and every deploy target (Hostinger, Vercel) serves
 * plain files — so `output: "export"` is unconditional rather than hidden
 * behind an env var.
 *
 * It used to be gated on EXPORT_STATIC=1, which failed on Hostinger: the
 * variable did not reach the `next build` child process, Next quietly made
 * a server build into `.next` instead, and the deploy died later with a
 * bare `ENOENT: out/.htaccess`. A build config that can silently become a
 * different kind of build is not worth the flexibility it buys here.
 */
const nextConfig: NextConfig = {
  // Pin the workspace root: a stray package-lock.json lives above this folder
  // and the bundler otherwise warns about inferring the wrong root.
  turbopack: { root: path.resolve(__dirname) },

  output: "export",

  // no server, so next/image cannot optimise on the fly
  images: { unoptimized: true },

  /**
   * Relative asset URLs, for serving from a SUB-FOLDER rather than a domain
   * root. Off by default: root deploys want absolute paths, and `next/font`
   * rejects a relative `assetPrefix` outright when building with webpack, so
   * this path is Turbopack-only.
   */
  ...(process.env.EXPORT_RELATIVE === "1" ? { assetPrefix: "./" } : {}),
};

export default nextConfig;
