/** Print the `files` map for publishing out/ as an Artifact, under app/. */
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) yield* walk(p);
    else yield p;
  }
}

const files = {};
for (const f of walk("out")) {
  const rel = f.replaceAll("\\", "/").replace(/^out\//, "");
  if (rel.endsWith(".txt")) continue; // RSC payloads, unused by the static page
  files[`app/${rel}`] = rel;
}

console.log(JSON.stringify(files));
console.error("count", Object.keys(files).length);
