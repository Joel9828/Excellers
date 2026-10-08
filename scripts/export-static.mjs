/**
 * Builds the static `out/` folder for a plain web host — Hostinger, cPanel,
 * any "drop it in public_html" setup — and for the Vercel static deploy.
 *
 *   npm run export                    # domain root (the normal case)
 *   EXPORT_RELATIVE=1 npm run export  # serving from a sub-folder
 *
 * Built with webpack, not Turbopack, on purpose. Turbopack runs
 * @tailwindcss/postcss by spawning a Node worker, and on a constrained CI
 * container that worker dies with "node process exited before we could
 * connect to it", taking the whole build with it. webpack runs PostCSS
 * in-process, so the build does not depend on the host letting us fork.
 *
 * The Apache config is staged into `public/` BEFORE the build rather than
 * written into `out/` after it, so `next build` emits it as part of the
 * export. Nothing here depends on `out/` still being where we left it once
 * the build returns.
 */
import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";

const relative = process.env.EXPORT_RELATIVE === "1";
const run = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, { stdio: "inherit", shell: true, ...opts });

/* ── 1. stage the Apache config into public/ ──────────────────────────
   The source is kept at a NON-dot path on purpose: Hostinger's "Staging
   source files" step drops dotfiles when it copies the checkout into the
   build container, so a committed `.htaccess` arrives missing even though
   git tracks it. We write the dotfile ourselves, here, into public/ — and
   because it is created after staging and before the build, Next copies it
   into the export like any other public asset. */
console.log("\n→ staging .htaccess into public/");
const htaccessSrc = join("deploy", "hostinger", "htaccess.conf");
if (!existsSync(htaccessSrc)) {
  console.error(`✗ missing ${htaccessSrc}`);
  console.error("  Not skippable: without it the upload has no HTTPS");
  console.error("  redirect, no pretty URLs, no 404 page and no cache");
  console.error("  headers, and nothing would report that at runtime.");
  process.exit(1);
}
const htaccess = readFileSync(htaccessSrc);
// A BOM here makes Apache 500 the whole site, so it is worth re-checking at
// the point of copy and not only at the point of writing.
if (htaccess[0] === 0xef && htaccess[1] === 0xbb && htaccess[2] === 0xbf) {
  console.error("✗ htaccess.conf starts with a UTF-8 BOM — Apache will 500");
  process.exit(1);
}
mkdirSync("public", { recursive: true });
writeFileSync(join("public", ".htaccess"), htaccess);

/* ── 2. build ─────────────────────────────────────────────────────── */
console.log(`\n→ building static export (${relative ? "relative" : "root"})`);
try {
  run("npx", ["next", "build", "--webpack"]);
} finally {
  // never leave the generated dotfile behind in the working tree
  rmSync(join("public", ".htaccess"), { force: true });
}

/* ── 3. locate the export ─────────────────────────────────────────── */
if (!existsSync("out")) {
  console.error("\n✗ next build did not produce out/");
  console.error(`  cwd: ${process.cwd()}`);
  console.error(`  resolved: ${resolve("out")}`);
  const list = (d) => {
    try {
      return readdirSync(d, { withFileTypes: true })
        .map((e) => (e.isDirectory() ? e.name + "/" : e.name))
        .join(" ");
    } catch (e) {
      return `<${e.code}>`;
    }
  };
  console.error(`  cwd contains: ${list(".")}`);
  console.error(`  .next contains: ${list(".next")}`);
  console.error("\n  Either output: \"export\" was not active, or the host");
  console.error("  moved out/ before this step ran. The listings above say");
  console.error("  which.");
  process.exit(1);
}

if (relative) {
  console.log("\n→ rewriting absolute asset paths");
  run("node", ["scripts/make-relative.mjs"]);
}

/* ── 4. verify ────────────────────────────────────────────────────── */
console.log("\n→ verifying export");
run("node", ["scripts/verify-export.mjs", ...(relative ? ["--relative"] : [])]);

// sanity: the things whose absence only shows up once it is live
const required = ["index.html", "404.html", ".htaccess", "_next"];
const missing = required.filter((f) => !existsSync(join("out", f)));
if (missing.length) {
  console.error(`✗ out/ is missing: ${missing.join(", ")}`);
  process.exit(1);
}

const size = (dir) =>
  readdirSync(dir, { withFileTypes: true }).reduce((n, e) => {
    const p = join(dir, e.name);
    return n + (e.isDirectory() ? size(p) : statSync(p).size);
  }, 0);

console.log(
  `\n✓ out/ is ready — ${(size("out") / 1048576).toFixed(1)} MB\n` +
    `  Upload the CONTENTS of out/ into public_html (include .htaccess).\n`,
);
