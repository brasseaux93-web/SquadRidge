"use client";

import type { OutcomeEntry } from "@/domain/types";
import { OutcomeStatusMarker } from "@/components/ui/StatusMarker";
import { PrivacyLabel } from "@/components/ui/PrivacyLabel";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";

/**
 * Commitment architecture — a durable mediation artifact, not a task card.
 */

export function CommitmentCard({
  outcome,
  canModerate,
  onApprove,
  onReject,
  className,
}: {
  outcome: OutcomeEntry;
  canModerate?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
  className?: string;
}) {
  const isApproved = outcome.status === "approved";
  const isProposed =
    outcome.status === "proposed" ||
    outcome.status === "under_review" ||
    outcome.status === "revised";

  return (
    <article
      className={cn(
        "rounded-lg border p-4 transition-colors",
        isApproved
          ? "border-progress/25 bg-progress-muted/40"
          : "border-[var(--border-default)] bg-canvas/50",
        className
      )}
    >
      <header className="flex flex-wrap items-center justify-between gap-2">
        <OutcomeStatusMarker status={outcome.status} />
        <PrivacyLabel scope={isApproved ? "ledger" : "facilitators"} />
      </header>

      <div className="mt-3 space-y-3">
        <div>
          <div className="section-label">Shared understanding / next step</div>
          <p className="mt-1 text-sm leading-relaxed text-ink">{outcome.body}</p>
        </div>

        {(outcome.ownerLabel || outcome.dueDate) && (
          <dl className="grid grid-cols-2 gap-3 text-xs">
            {outcome.ownerLabel && (
              <div>
                <dt className="text-ink-quiet">Responsible</dt>
                <dd className="mt-0.5 text-ink-secondary">{outcome.ownerLabel}</dd>
              </div>
            )}
            {outcome.dueDate && (
              <div>
                <dt className="text-ink-quiet">Target</dt>
                <dd className="mt-0.5 text-ink-secondary">{outcome.dueDate}</dd>
              </div>
            )}
          </dl>
        )}

        {outcome.notes && (
          <p className="text-xs text-ink-quiet">{outcome.notes}</p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border-subtle)] pt-3 text-[0.65rem] text-ink-quiet">
          <span>
            {isApproved && outcome.approvedAt
              ? `Acknowledged ${formatDate(outcome.approvedAt)}`
              : `Proposed ${formatDate(outcome.createdAt)}`}
          </span>
          {isApproved && <span>Retained after room close</span>}
        </div>
      </div>

      {canModerate && isProposed && (
        <div className="mt-3 flex gap-2">
          <Button
            className="min-h-[32px] px-3 py-1 text-xs"
            onClick={onApprove}
          >
            Approve for ledger
          </Button>
          <Button
            variant="ghost"
            className="min-h-[32px] px-3 py-1 text-xs"
            onClick={onReject}
          >
            Return
          </Button>
        </div>
      )}
    </article>
  );
}
