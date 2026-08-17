import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("framer-motion", async () => {
  const React = await import("react");
  const passthrough = ({ children, ...props }: { children?: React.ReactNode }) =>
    React.createElement("div", props, children);
  return {
    motion: {
      div: passthrough,
      button: ({
        children,
        ...props
      }: React.ButtonHTMLAttributes<HTMLButtonElement>) =>
        React.createElement("button", props, children),
      span: passthrough,
      h2: ({
        children,
        ...props
      }: React.HTMLAttributes<HTMLHeadingElement>) =>
        React.createElement("h2", props, children),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
    useReducedMotion: () => true,
  };
});

const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

vi.mock("@/data/store", () => ({
  useAppStore: (sel: (s: { enterAs: (r: string) => void }) => unknown) =>
    sel({
      enterAs: vi.fn(),
    }),
}));

import { DemoWorkflow } from "./DemoWorkflow";

describe("DemoWorkflow", () => {
  beforeEach(() => {
    push.mockClear();
  });

  it("renders honest entry lobby without zero-knowledge claims", () => {
    render(<DemoWorkflow mode="preview" />);
    expect(screen.getByText(/Choose how you enter/i)).toBeInTheDocument();
    expect(screen.getByText(/sample data/i)).toBeInTheDocument();
    const body = document.body.textContent?.toLowerCase() ?? "";
    expect(body).not.toMatch(/zero-knowledge|end-to-end encrypted|empathic nexus/);
  });

  it("offers facilitator and participant entry", () => {
    render(<DemoWorkflow mode="preview" />);
    expect(
      screen.getByRole("button", { name: /Facilitator/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Participant/i })
    ).toBeInTheDocument();
  });

  it("moves into preparing state on role select", async () => {
    const user = userEvent.setup();
    render(<DemoWorkflow mode="preview" />);
    await user.click(screen.getByRole("button", { name: /Facilitator/i }));
    expect(await screen.findByText(/Preparing demo room/i)).toBeInTheDocument();
  });
});
