"use client";

import type { RoomStatus, SessionPhase } from "@/domain/types";
import { SESSION_PHASES } from "@/domain/transitions";
import { cn } from "@/lib/utils";

const STAGE_META: Record<
  SessionPhase | "ledger",
  { label: string; intent: string }
> = {
  opening: {
    label: "Arrival",
    intent: "Shared purpose and working agreements",
  },
  dialogue: {
    label: "Listening",
    intent: "Exchange under assigned roles",
  },
  caucus: {
    label: "Clarification",
    intent: "Private check-in when needed",
  },
  synthesis: {
    label: "Options",
    intent: "Shape shared understanding",
  },
  closing: {
    label: "Commitments",
    intent: "Review and capture next steps",
  },
  ledger: {
    label: "Retained",
    intent: "Approved outcomes only",
  },
};

export function DialogueSpine({
  current,
  status,
  className,
}: {
  current: SessionPhase;
  status: RoomStatus;
  className?: string;
}) {
  const stages: (SessionPhase | "ledger")[] = [...SESSION_PHASES, "ledger"];
  const currentIdx =
    status === "closed"
      ? stages.length - 1
      : Math.max(0, stages.indexOf(current));

  return (
    <nav
      aria-label="Dialogue progression"
      className={cn(
        "rounded-[16px] border border-border-default bg-surface px-4 py-4 shadow-soft",
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="text-[11px] font-medium uppercase tracking-[0.06em] text-ink-quiet">
          Dialogue spine
        </span>
        {status === "closed" ? (
          <span className="text-[12px] text-progress">Room closed · dialogue cleared</span>
        ) : status === "safety_review" ? (
          <span className="text-[12px] text-critical">Safety review in progress</span>
        ) : status === "paused" ? (
          <span className="text-[12px] text-attention">Paused</span>
        ) : null}
      </div>

      <ol className="relative flex flex-col gap-0 sm:flex-row sm:items-stretch">
        {stages.map((stage, i) => {
          const done = i < currentIdx;
          const active = i === currentIdx;
          const meta = STAGE_META[stage];
          return (
            <li
              key={stage}
              className={cn(
                "relative flex flex-1 flex-col sm:items-center",
                i < stages.length - 1 && "sm:pr-2"
              )}
            >
              <div className="flex items-center gap-3 sm:flex-col sm:gap-2">
                <span
                  className={cn(
                    "relative z-[1] flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[0.65rem] font-semibold",
                    active &&
                      "border-accent bg-accent-muted text-accent shadow-focus",
                    done &&
                      !active &&
                      "border-progress/40 bg-progress-muted text-progress",
                    !done &&
                      !active &&
                      "border-border-default bg-surface-soft text-ink-quiet"
                  )}
                  aria-current={active ? "step" : undefined}
                >
                  {done && !active ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                      <path
                        d="M2.5 6.2L4.8 8.5L9.5 3.5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </span>
                <div className="sm:text-center">
                  <div
                    className={cn(
                      "text-[12px] font-medium",
                      active ? "text-ink" : done ? "text-ink-secondary" : "text-ink-quiet"
                    )}
                  >
                    {meta.label}
                  </div>
                  <div className="mt-0.5 hidden text-[11px] text-ink-quiet sm:block">
                    {meta.intent}
                  </div>
                </div>
              </div>
              {i < stages.length - 1 && (
                <div
                  className={cn(
                    "absolute left-[13px] top-7 h-[calc(100%-0.5rem)] w-px sm:left-auto sm:right-0 sm:top-[13px] sm:h-px sm:w-[calc(100%-1.75rem)]",
                    done ? "bg-progress/35" : "bg-border-default"
                  )}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>

      <p className="mt-4 border-t border-border-subtle pt-3 text-[13px] leading-relaxed text-ink-secondary">
        {status === "closed"
          ? "Session dialogue has been removed. Only approved commitments remain."
          : `Current stage: ${STAGE_META[current]?.label ?? current}. The facilitator may advance, pause, or revisit stages.`}
      </p>
    </nav>
  );
}
