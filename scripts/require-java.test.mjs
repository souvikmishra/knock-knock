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
