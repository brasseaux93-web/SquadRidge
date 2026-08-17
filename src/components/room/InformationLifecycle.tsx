"use client";

import type { RoomStatus } from "@/domain/types";
import { cn } from "@/lib/utils";

const LAYERS = [
  {
    id: "ephemeral",
    title: "Live dialogue",
    open: "Visible to room members while the session is open.",
    closed: "Purged when the facilitator closes the room. Not recoverable in this system.",
  },
  {
    id: "working",
    title: "Working proposals",
    open: "Draft commitments awaiting facilitator review.",
    closed: "Unapproved proposals are historical for facilitators only; participants never saw them as final.",
  },
  {
    id: "retained",
    title: "Approved ledger",
    open: "Items the facilitator has approved to carry forward.",
    closed: "Retained after close. This is the durable record of next steps.",
  },
] as const;

export function InformationLifecycle({ status }: { status: RoomStatus }) {
  const closed = status === "closed";

  return (
    <section
      className="rounded-xl border border-white/8 bg-surface/80 p-4"
      aria-labelledby="lifecycle-heading"
    >
      <h2
        id="lifecycle-heading"
        className="text-xs font-medium uppercase tracking-wider text-ink-muted"
      >
        Information lifecycle
      </h2>
      <p className="mt-2 text-sm text-ink-muted">
        {closed
          ? "This room is closed. Session chat has been removed from the active store. Approved outcomes remain."
          : "While the room is open, dialogue is temporary. Only facilitator-approved commitments are intended to persist."}
      </p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-3">
        {LAYERS.map((layer) => (
          <li
            key={layer.id}
            className={cn(
              "rounded-lg border p-3",
              layer.id === "ephemeral" && closed
                ? "border-danger/25 bg-danger/5"
                : layer.id === "retained"
                  ? "border-accent/30 bg-accent-muted"
                  : "border-white/8 bg-deep"
            )}
          >
            <div className="text-sm font-medium text-ink">{layer.title}</div>
            <p className="mt-1 text-xs text-ink-muted">
              {closed ? layer.closed : layer.open}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
