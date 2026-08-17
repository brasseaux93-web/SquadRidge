"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { useAppStore } from "@/data/store";
import { formatDate } from "@/lib/utils";
import type { RoomStatus } from "@/domain/types";

const statusTone: Record<
  RoomStatus,
  "neutral" | "accent" | "success" | "warning"
> = {
  draft: "neutral",
  prepared: "warning",
  live: "accent",
  closing: "warning",
  closed: "success",
};

export default function FacilitatorHome() {
  const rooms = useAppStore((s) => s.rooms);
  const participants = useAppStore((s) => s.participants);
  const outcomes = useAppStore((s) => s.outcomes);
  const user = useAppStore((s) => s.currentUser);

  if (user?.role === "participant") {
    return (
      <Card>
        <p className="text-ink-muted">
          You are signed in as a participant.{" "}
          <Link href="/room/room-1" className="text-accent hover:underline">
            Open the live demo room
          </Link>
          .
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-ink">Your rooms</h1>
        <p className="mt-2 max-w-prose text-ink-muted">
          Facilitator workspace. Open a room to guide phases, review proposed
          commitments, and close the session when outcomes are approved.
        </p>
      </div>

      <div className="grid gap-4">
        {rooms.map((room) => {
          const count = participants.filter((p) => p.roomId === room.id).length;
          const pending = outcomes.filter(
            (o) => o.roomId === room.id && o.status === "proposed"
          ).length;
          const approved = outcomes.filter(
            (o) => o.roomId === room.id && o.status === "approved"
          ).length;

          return (
            <Link key={room.id} href={`/app/rooms/${room.id}`}>
              <Card className="transition-colors hover:border-accent/30">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-medium text-ink">{room.title}</h2>
                    <p className="mt-1 text-sm text-ink-muted">
                      Phase: {room.phase} · {count} participants
                      {pending > 0 ? ` · ${pending} outcomes awaiting review` : ""}
                      {approved > 0 ? ` · ${approved} on ledger` : ""}
                    </p>
                    <p className="mt-1 text-xs text-ink-muted">
                      Updated context · Created {formatDate(room.createdAt)}
                    </p>
                  </div>
                  <Badge tone={statusTone[room.status]}>{room.status}</Badge>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
