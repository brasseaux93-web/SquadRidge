"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { EphemeralStateBadge } from "@/components/ui/EphemeralStateBadge";
import { PrivacyLabel } from "@/components/ui/PrivacyLabel";
import { RoomStatusMarker } from "@/components/ui/StatusMarker";
import { DialogueSpine } from "@/components/room/DialogueSpine";
import { ProtectedPause } from "@/components/room/ProtectedPause";
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
  const reportSafety = useAppStore((s) => s.reportSafety);

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
      <div className="container-app py-16">
        <EmptyState
          title="Room not found"
          description="This room may have been removed or the link is incorrect."
          action={
            <Link href="/enter" className="text-[14px] text-accent hover:underline">
              ← Enter demo
            </Link>
          }
        />
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
    <div className="min-h-dvh bg-canvas">
      <header className="sticky top-0 z-30 border-b border-border-subtle bg-canvas/90 backdrop-blur-md">
        <div className="container-app flex h-14 items-center justify-between gap-4">
          <Link href="/" className="text-[15px] font-semibold tracking-tight text-ink">
            SquadRidge
          </Link>
          <div className="flex items-center gap-3 text-[13px] text-ink-secondary">
            <span className="hidden sm:inline">
              You appear as <span className="font-medium text-ink">{displayRole}</span>
            </span>
            <Link
              href="/enter"
              className="rounded-[10px] border border-border-default px-3 py-1.5 transition-colors hover:border-border-strong hover:text-ink"
            >
              Switch role
            </Link>
          </div>
        </div>
      </header>

      <main className="container-app space-y-8 py-10">
        <header className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="font-display text-[1.75rem] tracking-tight text-ink sm:text-[2rem]">
                {room.title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <RoomStatusMarker status={room.status} />
                <PrivacyLabel scope={room.isDemo ? "demo" : "room"} />
                <EphemeralStateBadge
                  state={isClosed ? "retained" : "liveTemporary"}
                />
              </div>
              <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-ink-secondary">
                You appear under an assigned role. Live dialogue is temporary while
                the room is open. Only approved commitments are shown after review.
              </p>
            </div>
            {!isClosed && (
              <ProtectedPause
                disabled={busy}
                onRequest={(intent, note) => {
                  void reportSafety(room.id, intent, note);
                }}
              />
            )}
          </div>
        </header>

        {lastError && (
          <div
            role="alert"
            className="rounded-[14px] border border-critical/30 bg-critical-muted px-4 py-3 text-[14px] text-critical"
          >
            {lastError}{" "}
            <button type="button" className="underline" onClick={clearError}>
              Dismiss
            </button>
          </div>
        )}

        <DialogueSpine current={room.phase} status={room.status} />

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <section className="flex min-h-[440px] flex-col rounded-[16px] border border-border-default bg-surface shadow-soft">
            <div className="flex items-center justify-between border-b border-border-subtle px-5 py-3.5">
              <div>
                <h2 className="text-[14px] font-medium text-ink">Live dialogue</h2>
                <p className="mt-0.5 text-[11px] text-ink-quiet">
                  Temporary · visible to people in this room
                </p>
              </div>
              <PrivacyLabel scope={isClosed ? "demo" : "room"} />
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5" aria-live="polite">
              <AnimatePresence initial={false}>
                {messages.length === 0 ? (
                  <EmptyState
                    title={
                      isClosed
                        ? "Dialogue ended with the room"
                        : "Waiting for the conversation to begin"
                    }
                    description={
                      isClosed
                        ? "Approved commitments remain. Live exchange is not retained."
                        : "You appear under your assigned role. Speak from your experience."
                    }
                  />
                ) : (
                  messages.map((m) => (
                    <motion.article
                      key={m.id}
                      initial={reduce ? false : { opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      className="transcript-line"
                      data-facilitator={m.isFacilitator}
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <span
                          className={`text-[11px] font-semibold tracking-wide ${
                            m.isFacilitator ? "text-accent" : "text-ink-quiet"
                          }`}
                        >
                          {m.displayRole}
                        </span>
                        <time className="text-[11px] text-ink-quiet">
                          {formatDate(m.createdAt)}
                        </time>
                      </div>
                      <p className="mt-1.5 text-[14px] leading-relaxed text-ink">
                        {m.body}
                      </p>
                    </motion.article>
                  ))
                )}
              </AnimatePresence>
            </div>

            {!isClosed && myParticipation && (
              <div className="border-t border-border-subtle px-5 py-4">
                <label className="sr-only" htmlFor="part-msg">
                  Your message
                </label>
                <textarea
                  id="part-msg"
                  rows={2}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={`Message as ${displayRole}…`}
                  className="w-full rounded-[12px] border border-border-default bg-canvas px-3.5 py-2.5 text-[14px] text-ink placeholder:text-ink-quiet focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
                />
                <div className="mt-3 flex justify-end">
                  <Button
                    onClick={handleSend}
                    disabled={!draft.trim() || busy}
                    loading={busy}
                    className="min-h-[36px] rounded-[10px] px-4 text-[12px]"
                  >
                    Send
                  </Button>
                </div>
              </div>
            )}
          </section>

          <aside className="space-y-4">
            <section className="rounded-[16px] border border-border-default bg-surface p-4 shadow-soft">
              <h2 className="text-[13px] font-medium text-ink">Working agreements</h2>
              <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-ink-secondary">
                {room.groundRules.map((g) => (
                  <li key={g} className="flex gap-2">
                    <span
                      className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink-quiet"
                      aria-hidden
                    />
                    {g}
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-[16px] border border-border-default bg-surface p-4 shadow-soft">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-[13px] font-medium text-ink">Approved commitments</h2>
                <EphemeralStateBadge state="retained" label="Retained" />
              </div>
              <p className="mt-1 text-[11px] text-ink-quiet">
                Only facilitator-approved items appear here.
              </p>
              <div className="mt-3 space-y-2">
                {outcomes.length === 0 && (
                  <p className="text-[13px] text-ink-quiet">None yet.</p>
                )}
                {outcomes.map((o) => (
                  <div
                    key={o.id}
                    className="rounded-[12px] border border-progress/20 bg-progress-muted/40 p-3 text-[13px] leading-relaxed text-ink"
                  >
                    {o.body}
                    {o.ownerLabel && (
                      <div className="mt-1 text-[11px] text-ink-quiet">
                        Owner · {o.ownerLabel}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
