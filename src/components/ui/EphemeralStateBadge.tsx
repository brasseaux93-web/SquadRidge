import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { EyeOff, Hourglass, Shield, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Honest session-state indicator.
 *
 * Does NOT claim end-to-end encryption, zero-knowledge, or server blindness.
 * Communicates real product boundaries: temporary live dialogue, room scope,
 * retained commitments after approval, and demo mode.
 */
const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.6875rem] font-medium tracking-wide transition-colors duration-short focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
  {
    variants: {
      state: {
        /** Live dialogue is temporary while the room is open */
        liveTemporary:
          "border-ephemeral/30 bg-ephemeral-muted text-ephemeral-foreground animate-pulse-soft",
        /** Content limited to current room members */
        roomScoped: "border-secure/30 bg-secure-muted text-secure-foreground",
        /** Approved commitments retained after close */
        retained:
          "border-progress/35 bg-progress-muted text-progress",
        /** Fixture / prototype data */
        demo: "border-attention/35 bg-attention-muted text-attention",
      },
    },
    defaultVariants: {
      state: "liveTemporary",
    },
  }
);

const ICONS = {
  liveTemporary: Hourglass,
  roomScoped: Shield,
  retained: FileCheck,
  demo: EyeOff,
} as const;

const DEFAULT_LABELS = {
  liveTemporary: "Live dialogue · temporary",
  roomScoped: "Visible to this room",
  retained: "Approved commitment retained",
  demo: "Demo data · not a live record",
} as const;

export interface EphemeralStateBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /** Override default honest label for the state */
  label?: string;
}

export const EphemeralStateBadge = React.forwardRef<
  HTMLDivElement,
  EphemeralStateBadgeProps
>(function EphemeralStateBadge(
  { className, state = "liveTemporary", label, ...props },
  ref
) {
  const resolved = state ?? "liveTemporary";
  const Icon = ICONS[resolved];
  const text = label ?? DEFAULT_LABELS[resolved];

  return (
    <div
      ref={ref}
      role="status"
      aria-live="polite"
      className={cn(badgeVariants({ state: resolved }), className)}
      {...props}
    >
      <Icon className="h-3.5 w-3.5 shrink-0 opacity-90" aria-hidden />
      <span>{text}</span>
    </div>
  );
});

EphemeralStateBadge.displayName = "EphemeralStateBadge";
