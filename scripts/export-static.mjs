/**
 * Builds the static `out/` folder for a plain Apache/LiteSpeed host
 * (Hostinger, cPanel, any "drop it in public_html" setup).
 *
 *   npm run export
 *
 * Steps: static Next build → relative asset paths → .htaccess → verify.
 * Everything it checks is a failure that is silent in the browser, so
 * it exits non-zero rather than shipping a broken upload.
 */
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const run = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, { stdio: "inherit", shell: true, ...opts });

console.log("\n→ building static export");
run("npm", ["run", "build"], { env: { ...process.env, EXPORT_STATIC: "1" } });

console.log("\n→ rewriting absolute asset paths");
run("node", ["scripts/make-relative.mjs"]);

console.log("\n→ copying .htaccess");
const htaccess = join("deploy", "hostinger", ".htaccess");
if (!existsSync(htaccess)) {
  console.error(`✗ missing ${htaccess}`);
  process.exit(1);
}
// A BOM here makes Apache 500 the whole site, so it is worth re-checking
// at the point of copy and not only at the point of writing.
const { readFileSync } = await import("node:fs");
const raw = readFileSync(htaccess);
if (raw[0] === 0xef && raw[1] === 0xbb && raw[2] === 0xbf) {
  console.error("✗ .htaccess starts with a UTF-8 BOM — Apache will 500");
  process.exit(1);
}
copyFileSync(htaccess, join("out", ".htaccess"));

console.log("\n→ verifying export");
run("node", ["scripts/verify-export.mjs"]);

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
