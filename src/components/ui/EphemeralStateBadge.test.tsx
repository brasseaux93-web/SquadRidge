import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { EphemeralStateBadge } from "./EphemeralStateBadge";

describe("EphemeralStateBadge", () => {
  it("renders live temporary state with honest default label", () => {
    render(<EphemeralStateBadge state="liveTemporary" />);
    const el = screen.getByRole("status");
    expect(el).toHaveTextContent(/Live dialogue · temporary/i);
    expect(el.className).toMatch(/ephemeral/);
  });

  it("renders room-scoped state without encryption language", () => {
    render(<EphemeralStateBadge state="roomScoped" />);
    const el = screen.getByRole("status");
    expect(el).toHaveTextContent(/Visible to this room/i);
    expect(el.textContent?.toLowerCase()).not.toMatch(/encrypt|zero-knowledge|e2e/);
  });

  it("renders retained commitment state", () => {
    render(<EphemeralStateBadge state="retained" />);
    expect(screen.getByRole("status")).toHaveTextContent(/Approved commitment retained/i);
  });

  it("allows custom label but does not invent security claims", () => {
    render(
      <EphemeralStateBadge state="demo" label="Fixture preview only" />
    );
    expect(screen.getByRole("status")).toHaveTextContent("Fixture preview only");
  });

  it("exposes polite live region for assistive tech", () => {
    render(<EphemeralStateBadge label="Secure room boundary" />);
    const el = screen.getByRole("status");
    expect(el).toHaveAttribute("aria-live", "polite");
  });

  it("does not leak arbitrary data attributes from unknown props into text", () => {
    render(
      <EphemeralStateBadge
        state="liveTemporary"
        data-testid="ephemeral-badge"
        label="Live dialogue · temporary"
      />
    );
    const el = screen.getByTestId("ephemeral-badge");
    expect(el.textContent).toBe("Live dialogue · temporary");
  });
});
