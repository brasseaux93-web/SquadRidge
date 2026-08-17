"use client";

import Link from "next/link";
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
      <div className="rounded-[16px] border border-[var(--border-default)] bg-[var(--surface-raised)] p-6">
        <p className="text-[15px] text-ink-secondary">
          You entered as a participant.{" "}
          <Link href="/room/room-1" className="text-accent hover:underline">
            Open the live room
          </Link>
          .
        </p>
      </div>
    );
  }

  const needsAttention = outcomes.filter((o) => o.status === "proposed").length;
  const liveCount = rooms.filter((r) => r.status === "live").length;

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[12px] font-medium uppercase tracking-[0.06em] text-ink-quiet">
            Facilitator workspace
          </p>
          <h1 className="mt-2 font-display text-[2rem] tracking-tight text-ink sm:text-[2.25rem]">
            Rooms
          </h1>
          <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-ink-secondary">
            Open a room to guide the session, review commitments, and close when
            the work is complete.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-[12px]">
          {liveCount > 0 && (
            <span className="rounded-full border border-accent/25 bg-accent-muted px-3 py-1 text-accent">
              {liveCount} live
            </span>
          )}
          {needsAttention > 0 && (
            <span className="rounded-full border border-attention/25 bg-attention-muted px-3 py-1 text-attention">
              {needsAttention} awaiting review
            </span>
          )}
        </div>
      </header>

      <ul className="grid gap-3">
        {rooms.map((room) => {
          const count = participants.filter((p) => p.roomId === room.id).length;
          const pending = outcomes.filter(
            (o) => o.roomId === room.id && o.status === "proposed"
          ).length;
          const approved = outcomes.filter(
            (o) => o.roomId === room.id && o.status === "approved"
          ).length;

          return (
            <li key={room.id}>
              <Link href={`/app/rooms/${room.id}`} className="group block">
                <article className="rounded-[16px] border border-[var(--border-default)] bg-[var(--surface-raised)] px-5 py-5 transition-colors group-hover:border-[var(--border-strong)]">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h2 className="text-[16px] font-medium tracking-tight text-ink transition-colors group-hover:text-accent">
                        {room.title}
                      </h2>
                      <p className="mt-2 text-[13px] text-ink-secondary">
                        <span className="capitalize">{room.phase}</span>
                        <span className="mx-2 text-ink-quiet">·</span>
                        {count} {count === 1 ? "person" : "people"}
                        {pending > 0 && (
                          <>
                            <span className="mx-2 text-ink-quiet">·</span>
                            <span className="text-attention">
                              {pending} awaiting review
                            </span>
                          </>
                        )}
                        {approved > 0 && (
                          <>
                            <span className="mx-2 text-ink-quiet">·</span>
                            {approved} retained
                          </>
                        )}
                      </p>
                      <p className="mt-1.5 text-[12px] text-ink-quiet">
                        Created {formatDate(room.createdAt)}
                      </p>
                    </div>
                    <RoomStatusMarker status={room.status} />
                  </div>
                </article>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
