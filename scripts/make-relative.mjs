/**
 * Post-process `out/` so the static export works from any sub-path.
 *
 * `assetPrefix: "./"` already makes the `_next/*` bundle references relative,
 * but files served straight out of `public/` keep the absolute `/brand/...`
 * form that next/image and <link> emit. On a host that serves the site below
 * the domain root those 404, so rewrite them to relative here.
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = "out";
const PUBLIC_DIRS = ["brand", "media"];
const TEXT = /\.(html|js|txt|json|css)$/;

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) yield* walk(p);
    else yield p;
  }
}

let changed = 0;
for (const file of walk(ROOT)) {
  if (!TEXT.test(file)) continue;
  // latin1, not utf8: minified bundles can contain byte sequences that are not
  // valid UTF-8, and decoding them as utf8 silently replaces each one with
  // U+FFFD — which then gets written back, corrupting the chunk. latin1 maps
  // every byte 1:1, and the ASCII paths we rewrite are unaffected.
  const before = readFileSync(file, "latin1");
  let after = before;
  for (const dir of PUBLIC_DIRS) {
    // only the quoted absolute form, so real URLs are left alone
    after = after.split(`"/${dir}/`).join(`"./${dir}/`);
    after = after.split(`'/${dir}/`).join(`'./${dir}/`);
    after = after.split(`(/${dir}/`).join(`(./${dir}/`);
  }
  // A bundled UTF-8 decoder carries a literal U+FFFD ("�") in its source.
  // That is valid code, but publishers reasonably treat a raw replacement
  // character as a corruption signal, so emit it as an escape instead — inside
  // a JS string literal the two are identical.
  if (file.endsWith(".js")) {
    after = after.split("ï¿½").join("\\ufffd"); // UTF-8 bytes of U+FFFD, seen through latin1
  }

  if (after !== before) {
    writeFileSync(file, Buffer.from(after, "latin1"));
    changed++;
  }
}

console.log(`rewrote absolute public paths in ${changed} file(s)`);
