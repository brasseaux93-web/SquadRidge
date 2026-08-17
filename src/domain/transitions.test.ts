import { describe, expect, it } from "vitest";
import {
  canApproveOutcome,
  canSendMessage,
  canSetPhase,
} from "./transitions";

describe("canSetPhase", () => {
  it("allows phase change when room is live", () => {
    expect(canSetPhase("live", "dialogue").ok).toBe(true);
  });

  it("rejects phase change when room is closed", () => {
    const r = canSetPhase("closed", "dialogue");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toMatch(/closed/i);
  });
});

describe("canApproveOutcome", () => {
  it("allows approving proposed outcomes", () => {
    expect(canApproveOutcome("proposed").ok).toBe(true);
  });

  it("rejects approving already approved outcomes", () => {
    expect(canApproveOutcome("approved").ok).toBe(false);
  });
});

describe("canSendMessage", () => {
  it("blocks messages on closed rooms", () => {
    expect(canSendMessage("closed").ok).toBe(false);
  });

  it("allows messages on live rooms", () => {
    expect(canSendMessage("live").ok).toBe(true);
  });
});
