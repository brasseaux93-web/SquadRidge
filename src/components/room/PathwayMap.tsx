"use client";

import type { RoomStatus, SessionPhase } from "@/domain/types";
import { cn } from "@/lib/utils";

const STAGES: { key: SessionPhase | "ledger"; label: string }[] = [
  { key: "opening", label: "Opening" },
  { key: "dialogue", label: "Dialogue" },
  { key: "caucus", label: "Caucus" },
  { key: "synthesis", label: "Synthesis" },
  { key: "closing", label: "Closing" },
  { key: "ledger", label: "Ledger retained" },
];

export function PathwayMap({
  current,
  status,
}: {
  current: SessionPhase;
  status: RoomStatus;
}) {
  const currentIdx =
    status === "closed"
      ? STAGES.length - 1
      : STAGES.findIndex((s) => s.key === current);

  return (
    <div
      className="rounded-xl border border-white/8 bg-surface/80 p-4"
      aria-label="Session pathway"
    >
      <div className="mb-2 text-xs font-medium uppercase tracking-wider text-ink-muted">
        Dialogue pathway
      </div>
      <ol className="flex flex-wrap gap-2">
        {STAGES.map((stage, i) => {
          const done = i < currentIdx;
          const active = i === currentIdx;
          return (
            <li
              key={stage.key}
              className={cn(
                "rounded-full border px-3 py-1 text-xs",
                active && "border-accent bg-accent-muted text-accent",
                done && !active && "border-white/15 text-ink",
                !done && !active && "border-white/8 text-ink-muted"
              )}
            >
              <span className="sr-only">
                {active ? "Current: " : done ? "Completed: " : "Upcoming: "}
              </span>
              {stage.label}
            </li>
          );
        })}
      </ol>
      <p className="mt-3 text-xs text-ink-muted">
        {status === "closed"
          ? "Room closed. Session chat purged. Approved commitments remain on the ledger."
          : `Current phase: ${current}. Facilitator controls progression. Live messages exist only while the room is open.`}
      </p>
    </div>
  );
}
