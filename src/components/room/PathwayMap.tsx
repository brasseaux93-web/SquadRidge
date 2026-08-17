"use client";

import type { RoomStatus, SessionPhase } from "@/domain/types";
import { SESSION_PHASES } from "@/domain/transitions";
import { cn } from "@/lib/utils";

const STAGE_LABELS: Record<SessionPhase | "ledger", string> = {
  opening: "Opening",
  dialogue: "Dialogue",
  caucus: "Caucus",
  synthesis: "Synthesis",
  closing: "Closing",
  ledger: "Ledger retained",
};

export function PathwayMap({
  current,
  status,
}: {
  current: SessionPhase;
  status: RoomStatus;
}) {
  const stages: (SessionPhase | "ledger")[] = [...SESSION_PHASES, "ledger"];
  const currentIdx =
    status === "closed"
      ? stages.length - 1
      : Math.max(0, stages.indexOf(current));

  const nextAction =
    status === "closed"
      ? "Review retained outcomes on the ledger. Session chat is not available."
      : current === "closing"
        ? "Facilitator may close the room to purge chat and lock the session."
        : "Facilitator advances phase; participants contribute under assigned roles.";

  return (
    <div
      className="rounded-xl border border-white/8 bg-surface/80 p-4"
      aria-label="Session pathway"
    >
      <div className="mb-2 text-xs font-medium uppercase tracking-wider text-ink-muted">
        Dialogue pathway
      </div>
      <ol className="flex flex-wrap gap-2">
        {stages.map((stage, i) => {
          const done = i < currentIdx;
          const active = i === currentIdx;
          return (
            <li
              key={stage}
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
              {STAGE_LABELS[stage]}
            </li>
          );
        })}
      </ol>
      <p className="mt-3 text-xs text-ink-muted">
        {status === "closed"
          ? "Room closed. Session chat purged. Approved commitments remain on the ledger."
          : `Current phase: ${STAGE_LABELS[current]}. Responsible: facilitator. Next: ${nextAction}`}
      </p>
    </div>
  );
}
