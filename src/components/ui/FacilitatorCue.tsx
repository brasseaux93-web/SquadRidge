import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Process cues for facilitators — structural, not AI-derived.
 *
 * There is no empathic AI engine in SquadRidge. These cues support
 * human facilitation (phase, pause, turn balance as supplied by the parent).
 */
const cueVariants = cva(
  "inline-flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors duration-short",
  {
    variants: {
      tone: {
        neutral: "border-border-subtle bg-surface text-ink-secondary",
        calm: "border-secure/25 bg-secure-muted text-secure-foreground",
        attention: "border-attention/30 bg-attention-muted text-attention",
        pause: "border-ephemeral/30 bg-ephemeral-muted text-ephemeral-foreground",
      },
    },
    defaultVariants: {
      tone: "neutral",
    },
  }
);

export interface FacilitatorCueProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cueVariants> {
  label: string;
  detail?: string;
}

export function FacilitatorCue({
  label,
  detail,
  tone,
  className,
  ...props
}: FacilitatorCueProps) {
  return (
    <div
      role="status"
      className={cn(cueVariants({ tone }), className)}
      {...props}
    >
      <span className="text-ink">{label}</span>
      {detail ? (
        <span className="font-normal text-ink-quiet">{detail}</span>
      ) : null}
    </div>
  );
}
