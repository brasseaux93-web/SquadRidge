"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { InformationLifecycle } from "@/components/room/InformationLifecycle";
import { PathwayMap } from "@/components/room/PathwayMap";
import { useAppStore } from "@/data/store";
import { formatDate } from "@/lib/utils";

export default function ParticipantRoomPage() {
  const { id } = useParams<{ id: string }>();
  const reduce = useReducedMotion();
  const router = useRouter();

  const user = useAppStore((s) => s.currentUser);
  const room = useAppStore((s) => s.getRoom(id));
  const participants = useAppStore((s) => s.getRoomParticipants(id));
  const messages = useAppStore((s) => s.getRoomMessages(id));
  const outcomes = useAppStore((s) => s.getOutcomesForCurrentUser(id));
  const lastError = useAppStore((s) => s.lastError);
  const clearError = useAppStore((s) => s.clearError);
  const sendMessage = useAppStore((s) => s.sendMessage);

  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);

  const myParticipation = useMemo(() => {
    if (!user) return undefined;
    return participants.find((p) => p.userId === user.id && !p.isFacilitator);
  }, [participants, user]);

  if (!user) {
    router.replace("/enter");
    return null;
  }

  if (!room) {
    return (
      <div className="container-app py-12">
        <Card>
          <p className="text-ink-muted">Room not found.</p>
          <Link href="/enter" className="mt-4 inline-block text-accent">
            ← Enter demo
          </Link>
        </Card>
      </div>
    );
  }

  const isClosed = room.status === "closed";
  const displayRole = myParticipation?.displayRole ?? "Participant";

  async function handleSend() {
    if (!draft.trim() || !myParticipation || isClosed) return;
    setBusy(true);
    await sendMessage(
      room!.id,
      myParticipation.id,
      myParticipation.displayRole,
      draft,
      false
    );
    setDraft("");
    setBusy(false);
  }

  return (
    <div className="min-h-dvh">
      <header className="border-b border-white/5 bg-deep/90 backdrop-blur-md">
        <div className="container-app flex h-14 items-center justify-between">
          <Link href="/" className="font-serif text-xl text-ink">
            SquadRidge
          </Link>
          <div className="flex items-center gap-3 text-sm text-ink-muted">
            <span>
              You appear as <strong className="text-ink">{displayRole}</strong>
            </span>
            <Link href="/enter" className="text-accent hover:underline">
              Switch role
            </Link>
          </div>
        </div>
      </header>

      <main className="container-app space-y-6 py-8">
        <div>
          <h1 className="font-serif text-2xl text-ink sm:text-3xl">{room.title}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge tone={isClosed ? "success" : "accent"}>{room.status}</Badge>
            <Badge>Phase: {room.phase}</Badge>
            <Badge tone="neutral">Role: participant</Badge>
          </div>
          <p className="mt-3 max-w-prose text-sm text-ink-muted">
            Your real name is not shown in this room. Live messages are not kept
            after the facilitator closes the session. You only see approved
            commitments on the ledger.
          </p>
        </div>

        {lastError && (
          <div
            role="alert"
            className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
          >
            {lastError}{" "}
            <button type="button" className="underline" onClick={clearError}>
              Dismiss
            </button>
          </div>
        )}

        <PathwayMap current={room.phase} status={room.status} />
        <InformationLifecycle status={room.status} />

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <Card className="flex min-h-[400px] flex-col">
            <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-3">
              <h2 className="text-sm font-medium text-ink">Room dialogue</h2>
              <span className="text-xs text-ink-muted">
                {isClosed ? "Session closed" : "Ephemeral while open"}
              </span>
            </div>

            <div className="flex-1 space-y-3" aria-live="polite">
              <AnimatePresence initial={false}>
                {messages.length === 0 ? (
                  <p className="text-sm text-ink-muted">
                    {isClosed
                      ? "Session messages were purged when the room closed."
                      : "Waiting for dialogue to begin."}
                  </p>
                ) : (
                  messages.map((m) => (
                    <motion.div
                      key={m.id}
                      initial={reduce ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`rounded-lg border p-3 ${
                        m.isFacilitator
                          ? "border-accent/25 bg-accent-muted"
                          : "border-white/5 bg-deep"
                      }`}
                    >
                      <div className="text-xs font-medium uppercase tracking-wide text-accent">
                        {m.displayRole}
                      </div>
                      <p className="mt-1 text-sm text-ink">{m.body}</p>
                      <div className="mt-1 text-[0.65rem] text-ink-muted">
                        {formatDate(m.createdAt)}
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {!isClosed && myParticipation && (
              <div className="mt-4 border-t border-white/5 pt-4">
                <label className="sr-only" htmlFor="part-msg">
                  Your message
                </label>
                <textarea
                  id="part-msg"
                  rows={2}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={`Message as ${displayRole}…`}
                  className="w-full rounded-md border border-white/10 bg-deep px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                />
                <div className="mt-2 flex justify-end">
                  <Button
                    onClick={handleSend}
                    disabled={!draft.trim() || busy}
                    loading={busy}
                  >
                    Send
                  </Button>
                </div>
              </div>
            )}
          </Card>

          <div className="space-y-4">
            <Card>
              <h2 className="text-sm font-medium text-ink">Ground rules</h2>
              <ul className="mt-3 list-disc space-y-1 pl-4 text-sm text-ink-muted">
                {room.groundRules.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
            </Card>

            <Card>
              <h2 className="text-sm font-medium text-ink">
                Approved commitments
              </h2>
              <p className="mt-1 text-xs text-ink-muted">
                Only facilitator-approved items appear here. Proposed items are
                not shown to participants.
              </p>
              <div className="mt-3 space-y-2">
                {outcomes.length === 0 && (
                  <p className="text-sm text-ink-muted">None yet.</p>
                )}
                {outcomes.map((o) => (
                  <div
                    key={o.id}
                    className="rounded-lg border border-accent/20 bg-accent-muted p-3 text-sm text-ink"
                  >
                    {o.body}
                    {o.ownerLabel && (
                      <div className="mt-1 text-xs text-ink-muted">
                        Owner: {o.ownerLabel}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
