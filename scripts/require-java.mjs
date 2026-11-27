import { spawnSync } from "node:child_process";
import { realpathSync } from "node:fs";
import { pathToFileURL } from "node:url";

const MIN_JAVA = 21;
const MESSAGE = `Java ${MIN_JAVA}+ is required for the Firebase emulators: brew install openjdk@${MIN_JAVA}
If it's already installed: export PATH="/opt/homebrew/opt/openjdk@${MIN_JAVA}/bin:$PATH"`;

/** Parses the major version out of `java -version` output, or null if there is none. */
export function javaMajor(versionOutput) {
  const match = /version "(\d+)(?:\.(\d+))?/.exec(versionOutput);
  if (!match) return null;
  const first = Number(match[1]);
  // Legacy scheme: "1.8.0_391" means Java 8.
  return first === 1 && match[2] !== undefined ? Number(match[2]) : first;
}

function main() {
  const result = spawnSync("java", ["-version"], { encoding: "utf8" });
  const major = result.error ? null : javaMajor(`${result.stderr}${result.stdout}`);
  if (major === null || major < MIN_JAVA) {
    console.error(MESSAGE);
    process.exit(1);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href) {
  main();
}
