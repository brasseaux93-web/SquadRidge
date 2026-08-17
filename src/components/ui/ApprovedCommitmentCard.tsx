import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { EphemeralStateBadge } from "./EphemeralStateBadge";

const cardVariants = cva(
  "rounded-xl border border-border-subtle bg-surface p-4 shadow-soft focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent",
  {
    variants: {
      emphasis: {
        default: "",
        retained: "border-progress/25 bg-progress-muted/30",
      },
    },
    defaultVariants: {
      emphasis: "retained",
    },
  }
);

export interface ApprovedCommitmentCardProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof cardVariants> {
  body: string;
  ownerLabel?: string | null;
  dueDate?: string | null;
  showRetainedBadge?: boolean;
}

export function ApprovedCommitmentCard({
  body,
  ownerLabel,
  dueDate,
  showRetainedBadge = true,
  emphasis,
  className,
  ...props
}: ApprovedCommitmentCardProps) {
  return (
    <article
      className={cn(cardVariants({ emphasis }), className)}
      {...props}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[0.6875rem] font-medium uppercase tracking-wide text-ink-quiet">
          Commitment
        </p>
        {showRetainedBadge ? <EphemeralStateBadge state="retained" /> : null}
      </div>
      <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink">{body}</p>
      {(ownerLabel || dueDate) && (
        <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-secondary">
          {ownerLabel ? (
            <div>
              <dt className="inline text-ink-quiet">Owner · </dt>
              <dd className="inline">{ownerLabel}</dd>
            </div>
          ) : null}
          {dueDate ? (
            <div>
              <dt className="inline text-ink-quiet">Due · </dt>
              <dd className="inline">{dueDate}</dd>
            </div>
          ) : null}
        </dl>
      )}
    </article>
  );
}
