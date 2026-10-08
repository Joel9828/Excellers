/**
 * Gate the static export before it is published anywhere.
 *
 * Every check here is a failure that stays invisible in the browser until it
 * is live, so this exits non-zero rather than printing a warning nobody reads.
 *
 * Pass `--relative` when the export was built for a sub-folder: absolute
 * public paths are a defect there, and expected at a domain root.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import vm from "node:vm";

const relative = process.argv.includes("--relative");

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) yield* walk(p);
    else yield p;
  }
}

let js = 0;
let mojibake = 0;
let abs = 0;
const parseErrors = [];
const mojibakeFiles = [];
const absFiles = [];

for (const f of walk("out")) {
  if (!/\.(html|js|css)$/.test(f)) continue;
  const raw = readFileSync(f);
  const s = raw.toString("utf8");

  // Not "does it contain U+FFFD" — core-js's URL polyfill contains the
  // replacement character on purpose, for malformed percent-escapes. What we
  // are actually guarding against is make-relative.mjs mangling bytes through
  // a latin1/utf8 mixup, and that always breaks the UTF-8 round trip.
  if (!Buffer.from(s, "utf8").equals(raw)) {
    mojibake++;
    mojibakeFiles.push(f);
  }
  if (s.includes('"/brand/') || s.includes('"/media/')) {
    abs++;
    absFiles.push(f);
  }
  if (f.endsWith(".js")) {
    js++;
    try {
      new vm.Script(s, { filename: f });
    } catch (e) {
      parseErrors.push(`${f}: ${e.message}`);
    }
  }
}

const mode = relative ? "relative (sub-folder)" : "absolute (domain root)";
console.log(`mode: ${mode}`);
console.log(`js chunks parsed: ${js}`);
console.log(`files with broken encoding: ${mojibake}`);
console.log(`files with absolute public paths: ${abs}`);
console.log(
  parseErrors.length
    ? `PARSE ERRORS:\n${parseErrors.join("\n")}`
    : "all chunks parse OK",
);

const fail = [];
if (!js) fail.push("no JS chunks found in out/ — the export is empty");
if (mojibake)
  fail.push(`bytes do not round-trip as UTF-8 in: ${mojibakeFiles.join(", ")}`);
if (parseErrors.length) fail.push(`${parseErrors.length} chunk(s) failed to parse`);
if (relative && abs) {
  fail.push(`absolute public paths in: ${absFiles.join(", ")}`);
}

if (fail.length) {
  console.error("\n✗ export is not publishable:");
  for (const m of fail) console.error("  - " + m);
  process.exit(1);
}
