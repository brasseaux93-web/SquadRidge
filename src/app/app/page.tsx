"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { PrivacyLabel } from "@/components/ui/PrivacyLabel";
import { RoomStatusMarker } from "@/components/ui/StatusMarker";
import { useAppStore } from "@/data/store";
import { formatDate } from "@/lib/utils";

export default function FacilitatorHome() {
  const rooms = useAppStore((s) => s.rooms);
  const participants = useAppStore((s) => s.participants);
  const outcomes = useAppStore((s) => s.outcomes);
  const user = useAppStore((s) => s.currentUser);

  if (user?.role === "participant" || user?.role === "observer") {
    return (
      <Card>
        <p className="text-ink-secondary">
          You are signed in as a participant.{" "}
          <Link href="/room/room-1" className="text-accent hover:underline">
            Open the live demo room
          </Link>
          .
        </p>
      </Card>
    );
  }

  const needsAttention = outcomes.filter((o) => o.status === "proposed").length;
  const liveCount = rooms.filter((r) => r.status === "live").length;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-tight text-ink">Workspace</h1>
          <p className="mt-2 max-w-prose text-ink-secondary">
            Facilitator briefing. Open a room to guide phases, review proposed
            commitments, and close the session when outcomes are ready.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-ink-quiet">
          {liveCount > 0 && (
            <span className="rounded-full border border-accent/30 bg-accent-muted px-2.5 py-1 text-accent">
              {liveCount} live
            </span>
          )}
          {needsAttention > 0 && (
            <span className="rounded-full border border-attention/30 bg-attention-muted px-2.5 py-1 text-attention">
              {needsAttention} awaiting review
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-3">
        {rooms.map((room) => {
          const count = participants.filter((p) => p.roomId === room.id).length;
          const pending = outcomes.filter(
            (o) => o.roomId === room.id && o.status === "proposed"
          ).length;
          const approved = outcomes.filter(
            (o) => o.roomId === room.id && o.status === "approved"
          ).length;

          return (
            <Link key={room.id} href={`/app/rooms/${room.id}`} className="group block">
              <article className="surface-raised rounded-xl px-5 py-4 transition-colors group-hover:border-[var(--border-strong)]">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-base font-medium text-ink group-hover:text-accent transition-colors">
                      {room.title}
                    </h2>
                    <p className="mt-1.5 text-sm text-ink-secondary">
                      Phase: {room.phase}
                      <span className="mx-1.5 text-ink-quiet">·</span>
                      {count} participants
                      {pending > 0 && (
                        <>
                          <span className="mx-1.5 text-ink-quiet">·</span>
                          <span className="text-attention">{pending} awaiting review</span>
                        </>
                      )}
                      {approved > 0 && (
                        <>
                          <span className="mx-1.5 text-ink-quiet">·</span>
                          {approved} on ledger
                        </>
                      )}
                    </p>
                    <p className="mt-1 text-xs text-ink-quiet">
                      Created {formatDate(room.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <RoomStatusMarker status={room.status} />
                    {room.isDemo && <PrivacyLabel scope="demo" />}
                  </div>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
