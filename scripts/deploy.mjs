/**
 * Build the static export and ship it to the `excellers` Vercel project.
 *
 * The re-link is not optional: `next build` wipes `out/`, taking `out/.vercel`
 * with it, and an unlinked deploy silently creates a NEW project named after
 * the directory ("out") on its own URL instead of updating excellers.vercel.app.
 */
import { execFileSync } from "node:child_process";

const PROJECT = "excellers";
const run = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, { stdio: "inherit", shell: true, ...opts });

const capture = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, { encoding: "utf8", shell: true, ...opts });

// One artifact for every target: the same `npm run export` a plain host
// builds from, so Vercel can never be shipping something the host is not.
console.log("\n[1/2] static export");
run("npm", ["run", "export"]);

console.log(`\n[2/2] deploy to "${PROJECT}"`);
run("npx", ["vercel", "link", "--yes", "--project", PROJECT], { cwd: "out" });
const out = capture("npx", ["vercel", "deploy", "--prod", "--yes"], { cwd: "out" });

const urls = [...new Set(out.match(/https:\/\/[a-z0-9.-]+\.vercel\.app/g) ?? [])];
console.log("\ndeployed:");
urls.forEach((u) => console.log("  " + u));

if (!urls.some((u) => u.includes(PROJECT))) {
  console.error(`\nWARNING: no ${PROJECT}.vercel.app URL in the output — check the link step.`);
  process.exit(1);
}
