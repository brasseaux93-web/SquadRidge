import { cn } from "@/lib/utils";
import type { RoomStatus, OutcomeStatus } from "@/domain/types";

type MarkerTone =
  | "neutral"
  | "active"
  | "progress"
  | "attention"
  | "critical"
  | "consented";

const TONE_STYLES: Record<MarkerTone, string> = {
  neutral: "border-border-default bg-surface-soft text-ink-secondary",
  active: "border-accent/30 bg-accent-muted text-accent",
  progress: "border-progress/30 bg-progress-muted text-progress",
  attention: "border-attention/30 bg-attention-muted text-attention",
  critical: "border-critical/30 bg-critical-muted text-critical",
  consented: "border-consented/30 bg-consented-muted text-consented",
};

const ROOM_TONE: Record<RoomStatus, MarkerTone> = {
  draft: "neutral",
  scheduled: "neutral",
  waiting: "attention",
  prepared: "attention",
  live: "active",
  paused: "attention",
  safety_review: "critical",
  closing: "attention",
  closed: "progress",
};

const OUTCOME_TONE: Record<OutcomeStatus, MarkerTone> = {
  proposed: "attention",
  under_review: "attention",
  approved: "progress",
  rejected: "critical",
  revised: "attention",
};

export function StatusMarker({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: MarkerTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.7rem] font-medium tracking-wide capitalize",
        TONE_STYLES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function RoomStatusMarker({
  status,
  className,
}: {
  status: RoomStatus;
  className?: string;
}) {
  return (
    <StatusMarker tone={ROOM_TONE[status] ?? "neutral"} className={className}>
      {status.replace("_", " ")}
    </StatusMarker>
  );
}

export function OutcomeStatusMarker({
  status,
  className,
}: {
  status: OutcomeStatus;
  className?: string;
}) {
  return (
    <StatusMarker tone={OUTCOME_TONE[status] ?? "neutral"} className={className}>
      {status.replace("_", " ")}
    </StatusMarker>
  );
}
