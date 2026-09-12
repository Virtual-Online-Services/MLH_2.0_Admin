// Minimal example test to verify the test harness runs:
// - Vitest globals (describe/it/expect)
// - jsdom environment (document is available)
// - fast-check property-based testing library
import { describe, it, expect } from "vitest";
import fc from "fast-check";

describe("test harness", () => {
  it("runs a basic assertion", () => {
    expect(1 + 1).toBe(2);
  });

  it("has a jsdom document available", () => {
    const el = document.createElement("div");
    el.textContent = "hello";
    expect(el.textContent).toBe("hello");
  });

  it("runs a fast-check property (>=100 iterations)", () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (a, b) => {
        return a + b === b + a;
      }),
      { numRuns: 100 }
    );
  });
});
