import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { javaMajor } from "./require-java.mjs";

describe("javaMajor", () => {
  it("parses modern versions", () => {
    expect(javaMajor('openjdk version "21.0.5" 2024-10-15')).toBe(21);
  });

  it("parses legacy 1.x versions", () => {
    expect(javaMajor('java version "1.8.0_391"')).toBe(8);
  });

  it("returns null when there is no Java", () => {
    expect(
      javaMajor("The operation couldn’t be completed. Unable to locate a Java Runtime."),
    ).toBeNull();
  });
});

describe("CLI", () => {
  it("exits 1 with both message lines when java is missing", () => {
    const script = fileURLToPath(new URL("./require-java.mjs", import.meta.url));
    const emptyDir = mkdtempSync(join(tmpdir(), "no-java-"));
    let result;
    try {
      result = spawnSync(process.execPath, [script], {
        encoding: "utf8",
        env: { PATH: emptyDir },
      });
    } finally {
      rmSync(emptyDir, { recursive: true, force: true });
    }
    expect(result.status).toBe(1);
    expect(result.stderr).toContain(
      "Java 21+ is required for the Firebase emulators: brew install openjdk@21",
    );
    expect(result.stderr).toContain(
      'If it\'s already installed: export PATH="/opt/homebrew/opt/openjdk@21/bin:$PATH"',
    );
  });
});
