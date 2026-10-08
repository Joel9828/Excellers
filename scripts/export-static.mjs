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
 */
import { execFileSync } from "node:child_process";
import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

const relative = process.env.EXPORT_RELATIVE === "1";
const run = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, { stdio: "inherit", shell: true, ...opts });

console.log(`\n→ building static export (${relative ? "relative" : "root"})`);
run("npx", ["next", "build", "--webpack"]);

// Fail here, with a reason, rather than letting the next step die on a bare
// ENOENT. If out/ is missing it means the build was not a static export.
if (!existsSync("out")) {
  console.error("\n✗ next build did not produce out/");
  console.error('  output: "export" was not active for that build.');
  console.error("  Check next.config.ts still sets it unconditionally.");
  process.exit(1);
}

if (relative) {
  console.log("\n→ rewriting absolute asset paths");
  run("node", ["scripts/make-relative.mjs"]);
}

console.log("\n→ writing .htaccess");
// The source is kept at a NON-dot path on purpose. Hostinger's "Staging
// source files" step drops dotfiles when it copies the checkout into the
// build container, so a committed deploy/hostinger/.htaccess arrives
// missing and the build dies on ENOENT even though git has it. We store it
// as htaccess.conf and write the dotfile into out/ ourselves.
const htaccess = join("deploy", "hostinger", "htaccess.conf");
if (!existsSync(htaccess)) {
  console.error(`✗ missing ${htaccess}`);
  console.error("  Not skippable: without it the upload has no HTTPS");
  console.error("  redirect, no pretty URLs, no 404 page and no cache");
  console.error("  headers, and nothing would report that at runtime.");
  process.exit(1);
}
// A BOM here makes Apache 500 the whole site, so it is worth re-checking at
// the point of copy and not only at the point of writing.
const raw = readFileSync(htaccess);
if (raw[0] === 0xef && raw[1] === 0xbb && raw[2] === 0xbf) {
  console.error("✗ htaccess.conf starts with a UTF-8 BOM — Apache will 500");
  process.exit(1);
}
writeFileSync(join("out", ".htaccess"), raw);

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
