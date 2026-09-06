/**
 * Finds starter values that must be replaced before a real deploy.
 *
 * Everything keys off ONE marker, `bp-placeholder:`, written as a comment
 * beside the value it refers to. The text after the colon is the instruction,
 * so this script never needs editing when a placeholder is added or removed —
 * the marker travels with the code and cannot drift out of sync with a list
 * kept somewhere else.
 *
 * Deliberately NOT the same thing as a TODO. A TODO is work to do eventually;
 * a bp-placeholder is a value that is wrong until someone sets it. Gating on
 * TODOs would block a release over a "review this code" note.
 *
 * Two modes:
 *   default   report and exit 0 — visible on every build, never blocks work
 *   --strict  exit 1 if any remain — the gate before you ship
 *
 * Failing by default would block every build of a starter whose whole point is
 * that these begin unset. A warning seen 40 times stops being read. So the
 * warning keeps it visible day to day, and --strict is what holds the line.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { glob } from "node:fs/promises";

const MARKER = /bp-placeholder:\s*(.*?)\s*(?:\*\/|-->)?\s*$/;

const FILES = ["astro.config.mjs", "src/**/*.{astro,ts,mjs,md,css}"];

const root = process.cwd();
const strict = process.argv.includes("--strict");

/** file -> [{ line, hint }] */
const byFile = new Map();
let total = 0;

const seen = new Set();
for (const pattern of FILES) {
   for await (const entry of glob(pattern, { cwd: root })) {
      const rel = entry.replaceAll("\\", "/");
      if (seen.has(rel)) continue;
      seen.add(rel);

      let text;
      try {
         text = readFileSync(join(root, rel), "utf8");
      } catch {
         continue;
      }
      if (!text.includes("bp-placeholder:")) continue;

      const lines = text.split("\n");
      lines.forEach((line, i) => {
         const m = line.match(MARKER);
         if (!m) return;

         // A hint often wraps across several comment lines. Absorb the
         // following ones so the instruction survives Prettier's 80 columns.
         const parts = [m[1]];
         for (let j = i + 1; j < lines.length; j += 1) {
            const next = lines[j].trim();
            const cont = next.match(/^(?:\/\/|\*|#)\s?(.*)$/);
            if (!cont || next.includes("bp-placeholder:")) break;
            const t = cont[1].replace(/(?:\*\/|-->)\s*$/, "").trim();
            if (!t) break;
            parts.push(t);
         }

         if (!byFile.has(rel)) byFile.set(rel, []);
         byFile.get(rel).push({
            line: i + 1,
            hint: parts.filter(Boolean).join(" ") || "(no description)",
         });
         total += 1;
      });
   }
}

if (total === 0) {
   console.log("✔ No placeholders left to replace.");
   process.exit(0);
}

const noun = total === 1 ? "placeholder" : "placeholders";
console.log(
   strict
      ? `\n✖ ${total} ${noun} still to replace — not ready to ship.\n`
      : `\n⚠ ${total} ${noun} still to replace (warning only; run with --strict to gate).\n`,
);

for (const [file, hits] of [...byFile].sort()) {
   console.log(`  ${file}`);
   for (const { line, hint } of hits) {
      console.log(`    ${String(line).padStart(4)}  ${hint}`);
   }
   console.log();
}

process.exit(strict ? 1 : 0);
