import { describe, expect, it } from "vitest";
import { DEFAULT_KNOCK_WINDOW, KNOCK_WINDOWS, isKnockWindow } from "./windows";

describe("knock windows", () => {
  it("offers 5, 15 and 60 minutes", () => {
    expect(KNOCK_WINDOWS).toEqual([5, 15, 60]);
  });

  it("defaults to 15", () => {
    expect(DEFAULT_KNOCK_WINDOW).toBe(15);
  });

  it("accepts only the offered windows", () => {
    expect(isKnockWindow(15)).toBe(true);
    expect(isKnockWindow(10)).toBe(false);
    expect(isKnockWindow("15")).toBe(false);
    expect(isKnockWindow(undefined)).toBe(false);
  });
});
