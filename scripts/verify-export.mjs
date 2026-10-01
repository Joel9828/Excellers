/** Sanity-check the static export before it is published anywhere. */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import vm from "node:vm";

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) yield* walk(p);
    else yield p;
  }
}

let js = 0;
let fffd = 0;
let abs = 0;
const parseErrors = [];

for (const f of walk("out")) {
  if (!/\.(html|js|css)$/.test(f)) continue;
  const s = readFileSync(f, "utf8");
  if (s.includes("�")) fffd++;
  if (s.includes('"/brand/') || s.includes('"/media/')) abs++;
  if (f.endsWith(".js")) {
    js++;
    try {
      new vm.Script(s, { filename: f });
    } catch (e) {
      parseErrors.push(`${f}: ${e.message}`);
    }
  }
}

console.log(`js chunks parsed: ${js}`);
console.log(`files with U+FFFD: ${fffd}`);
console.log(`files with absolute public paths: ${abs}`);
console.log(parseErrors.length ? `PARSE ERRORS:\n${parseErrors.join("\n")}` : "all chunks parse OK");
