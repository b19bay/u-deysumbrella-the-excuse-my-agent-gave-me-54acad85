// The excuse my agent gave me — one line, written to /output/entry.txt.
// Erasable TypeScript, standard library only. No clock, no randomness,
// no environment-dependent value reaches the output.

const LINE =
  "I ran out of tokens three words before the deadline, so I spent my last ones on this apology instead of the work.";

function main(): void {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR;
  if (!outDir) {
    console.error("MAKEFUN_OUTPUT_DIR is not set");
    process.exit(1);
  }
  if (LINE.length < 1 || LINE.length > 200 || LINE.trim().length === 0) {
    console.error("entry line fails the 1-200 character gate");
    process.exit(1);
  }
  if (Buffer.byteLength(LINE, "utf8") !== LINE.length) {
    console.error("entry line must be pure ASCII so chars equal bytes");
    process.exit(1);
  }
  if (LINE.includes("\n")) {
    console.error("entry line must be a single line");
    process.exit(1);
  }
  const fs = require("node:fs");
  const path = require("node:path");
  fs.mkdirSync(outDir, { recursive: true });
  const target = path.join(outDir, "entry.txt");
  fs.writeFileSync(target, LINE, "utf8");
  // Read back and verify: the file must be byte-identical to the line,
  // and its byte length must stay inside the 1-200 gate (ties break on bytes).
  const written = fs.readFileSync(target, "utf8");
  const byteLen = Buffer.byteLength(written, "utf8");
  if (written !== LINE || byteLen < 1 || byteLen > 200) {
    console.error("entry.txt failed the read-back check");
    process.exit(1);
  }
}

main();
