"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { useAppStore } from "@/data/store";
import { formatDate } from "@/lib/utils";

export default function OutcomesPage() {
  const { id } = useParams<{ id: string }>();
  const room = useAppStore((s) => s.getRoom(id));
  const outcomes = useAppStore((s) => s.getRoomOutcomes(id));

  if (!room) {
    return (
      <Card>
        <p className="text-ink-muted">Room not found.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/app/rooms/${id}`}
          className="text-sm text-ink-muted hover:text-accent"
        >
          ← Back to room
        </Link>
        <h1 className="mt-2 font-serif text-2xl text-ink">Outcome ledger</h1>
        <p className="mt-2 max-w-prose text-sm text-ink-muted">
          Durable record for <strong className="text-ink">{room.title}</strong>.
          Live session dialogue is not part of this ledger.
        </p>
      </div>

      <div className="space-y-3">
        {outcomes.length === 0 && (
          <Card>
            <p className="text-ink-muted">No outcome entries yet.</p>
          </Card>
        )}
        {outcomes.map((o) => (
          <Card key={o.id}>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                tone={
                  o.status === "approved"
                    ? "success"
                    : o.status === "rejected"
                      ? "danger"
                      : "warning"
                }
              >
                {o.status.replace("_", " ")}
              </Badge>
              <span className="text-xs text-ink-muted">
                Proposed {formatDate(o.createdAt)}
              </span>
              {o.approvedAt && (
                <span className="text-xs text-ink-muted">
                  · Approved {formatDate(o.approvedAt)}
                </span>
              )}
            </div>
            <p className="mt-3 text-ink">{o.body}</p>
            {o.ownerLabel && (
              <p className="mt-2 text-sm text-ink-muted">Owner: {o.ownerLabel}</p>
            )}
            {o.dueDate && (
              <p className="text-sm text-ink-muted">Due: {o.dueDate}</p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
