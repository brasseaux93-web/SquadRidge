"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { PrivacyLabel } from "@/components/ui/PrivacyLabel";
import { RoomStatusMarker } from "@/components/ui/StatusMarker";
import { EmptyState } from "@/components/ui/EmptyState";
import { DialogueSpine } from "@/components/room/DialogueSpine";
import { InformationLifecycle } from "@/components/room/InformationLifecycle";
import { CommitmentCard } from "@/components/room/CommitmentCard";
import { ProtectedPause } from "@/components/room/ProtectedPause";
import { useAppStore } from "@/data/store";
import { SESSION_PHASES } from "@/domain/transitions";
import type { SessionPhase } from "@/domain/types";
import { formatDate } from "@/lib/utils";

export default function FacilitatorRoomPage() {
  const { id } = useParams<{ id: string }>();
  const reduce = useReducedMotion();
  const router = useRouter();

  const user = useAppStore((s) => s.currentUser);
  const room = useAppStore((s) => s.getRoom(id));
  const participants = useAppStore((s) => s.getRoomParticipants(id));
  const messages = useAppStore((s) => s.getRoomMessages(id));
  const outcomes = useAppStore((s) => s.getRoomOutcomes(id));
  const lastError = useAppStore((s) => s.lastError);
  const clearError = useAppStore((s) => s.clearError);
  const setPhase = useAppStore((s) => s.setPhase);
  const closeRoom = useAppStore((s) => s.closeRoom);
  const sendMessage = useAppStore((s) => s.sendMessage);
  const proposeOutcome = useAppStore((s) => s.proposeOutcome);
  const setOutcomeStatus = useAppStore((s) => s.setOutcomeStatus);

  const [draft, setDraft] = useState("");
  const [outcomeDraft, setOutcomeDraft] = useState("");
  const [confirmClose, setConfirmClose] = useState(false);
  const [busy, setBusy] = useState(false);

  const facParticipant = useMemo(
    () => participants.find((p) => p.isFacilitator),
    [participants]
  );

  if (!user) {
    router.replace("/enter");
    return null;
  }

  if (!room) {
    return (
      <EmptyState
        title="Room not found"
        description="This room may have been removed or the link is incorrect."
        action={
          <Link href="/app" className="text-sm text-accent hover:underline">
            ← Back to rooms
          </Link>
        }
      />
    );
  }

  const isClosed = room.status === "closed";

  async function handleSend() {
    if (!draft.trim() || !facParticipant || isClosed) return;
    setBusy(true);
    await sendMessage(
      room!.id,
      facParticipant.id,
      facParticipant.displayRole,
      draft,
      true
    );
    setDraft("");
    setBusy(false);
  }

  async function handlePropose() {
    if (!outcomeDraft.trim() || !facParticipant) return;
    setBusy(true);
    await proposeOutcome(room!.id, outcomeDraft, facParticipant.id);
    setOutcomeDraft("");
    setBusy(false);
  }

  async function handleClose() {
    setBusy(true);
    await closeRoom(room!.id);
    setConfirmClose(false);
    setBusy(false);
  }

  async function handlePhase(p: SessionPhase) {
    setBusy(true);
    await setPhase(room!.id, p);
    setBusy(false);
  }

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <Link
          href="/app"
          className="text-[12px] text-ink-quiet transition-colors hover:text-ink-secondary"
        >
          ← Rooms
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-display text-[1.75rem] tracking-tight text-ink sm:text-[2rem]">
              {room.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <RoomStatusMarker status={room.status} />
              <PrivacyLabel scope={room.isDemo ? "demo" : "room"} />
              <span className="text-[12px] text-ink-quiet">
                Invite {room.inviteCode}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {!isClosed && (
              <>
                <ProtectedPause disabled={busy} />
                <Button
                  variant="danger"
                  className="min-h-[36px] rounded-[10px] px-3.5 py-1.5 text-[12px]"
                  onClick={() => setConfirmClose(true)}
                >
                  Close room
                </Button>
              </>
            )}
          </div>
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
      <InformationLifecycle status={room.status} />

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-5">
          <section className="flex min-h-[440px] flex-col rounded-[16px] border border-[var(--border-default)] bg-[var(--surface-raised)]">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-5 py-3.5">
              <div>
                <h2 className="text-[14px] font-medium text-ink">Live dialogue</h2>
                <p className="mt-0.5 text-[11px] text-ink-quiet">
                  Temporary · visible to people in this room
                </p>
              </div>
              <PrivacyLabel scope={isClosed ? "demo" : "room"} />
            </div>

            <div
              className="flex-1 space-y-5 overflow-y-auto px-5 py-5"
              aria-live="polite"
            >
              <AnimatePresence initial={false}>
                {messages.length === 0 ? (
                  <EmptyState
                    title={isClosed ? "Dialogue ended with the room" : "Waiting for the first voice"}
                    description={
                      isClosed
                        ? "Approved commitments remain. Live exchange is not retained."
                        : "People appear under assigned roles. The focus stays on what is said."
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

            {!isClosed && (
              <div className="border-t border-[var(--border-subtle)] px-5 py-4">
                <label className="sr-only" htmlFor="fac-msg">
                  Facilitator message
                </label>
                <textarea
                  id="fac-msg"
                  rows={2}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Guide the room…"
                  className="w-full rounded-[12px] border border-white/10 bg-canvas px-3.5 py-2.5 text-[14px] text-ink placeholder:text-ink-quiet focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
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

          {!isClosed && (
            <section className="rounded-[16px] border border-[var(--border-default)] bg-[var(--surface-raised)] p-5">
              <h2 className="text-[14px] font-medium text-ink">Propose a commitment</h2>
              <p className="mt-1 text-[12px] leading-relaxed text-ink-secondary">
                Nothing is retained without your approval.
              </p>
              <textarea
                rows={3}
                value={outcomeDraft}
                onChange={(e) => setOutcomeDraft(e.target.value)}
                placeholder="We agree to…"
                className="mt-3 w-full rounded-[12px] border border-white/10 bg-canvas px-3.5 py-2.5 text-[14px] text-ink placeholder:text-ink-quiet focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
              />
              <div className="mt-3 flex justify-end">
                <Button
                  variant="subtle"
                  onClick={handlePropose}
                  disabled={!outcomeDraft.trim() || busy}
                  className="min-h-[36px] rounded-[10px] px-4 text-[12px]"
                >
                  Add for review
                </Button>
              </div>
            </section>
          )}

          {isClosed && (
            <section className="rounded-[16px] border border-progress/20 bg-progress-muted/25 p-5">
              <h2 className="text-[14px] font-medium text-ink">Room closed</h2>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-secondary">
                Closed {room.closedAt ? formatDate(room.closedAt) : ""}. Live dialogue
                was removed. Review{" "}
                <Link
                  href={`/app/rooms/${room.id}/outcomes`}
                  className="text-accent hover:underline"
                >
                  retained commitments
                </Link>
                .
              </p>
            </section>
          )}
        </div>

        <aside className="space-y-4">
          <section className="rounded-[16px] border border-[var(--border-default)] bg-[var(--surface-raised)] p-4">
            <h2 className="text-[13px] font-medium text-ink">Session phase</h2>
            <p className="mt-1 text-[11px] text-ink-quiet">Visible to everyone in the room</p>
            <div
              className="mt-3 flex flex-wrap gap-1.5"
              role="group"
              aria-label="Set phase"
            >
              {SESSION_PHASES.map((p) => (
                <button
                  key={p}
                  type="button"
                  disabled={isClosed || busy}
                  onClick={() => handlePhase(p)}
                  className={`rounded-full border px-2.5 py-1 text-[11px] capitalize transition-colors disabled:opacity-40 ${
                    room.phase === p
                      ? "border-accent bg-accent-muted text-accent"
                      : "border-white/10 text-ink-quiet hover:border-white/20 hover:text-ink-secondary"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-[16px] border border-[var(--border-default)] bg-[var(--surface-raised)] p-4">
            <h2 className="text-[13px] font-medium text-ink">In the room</h2>
            <ul className="mt-3 space-y-2.5">
              {participants.map((p) => (
                <li key={p.id} className="flex items-center justify-between text-[13px]">
                  <span className="text-ink">{p.displayRole}</span>
                  {p.isFacilitator && (
                    <span className="text-[11px] text-accent">Facilitator</span>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-[16px] border border-[var(--border-default)] bg-[var(--surface-raised)] p-4">
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

          <section className="rounded-[16px] border border-[var(--border-default)] bg-[var(--surface-raised)] p-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-[13px] font-medium text-ink">Commitments</h2>
              <Link
                href={`/app/rooms/${room.id}/outcomes`}
                className="text-[11px] text-accent hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="mt-3 space-y-3">
              {outcomes.length === 0 && (
                <p className="text-[13px] text-ink-quiet">None yet.</p>
              )}
              {outcomes.map((o) => (
                <CommitmentCard
                  key={o.id}
                  outcome={o}
                  canModerate={!isClosed}
                  onApprove={() => setOutcomeStatus(o.id, "approved")}
                  onReject={() => setOutcomeStatus(o.id, "rejected")}
                />
              ))}
            </div>
          </section>
        </aside>
      </div>

      <AnimatePresence>
        {confirmClose && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="close-title"
          >
            <motion.div
              className="w-full max-w-md rounded-[18px] border border-[var(--border-default)] bg-[var(--surface-raised)] p-6 shadow-lift"
              initial={reduce ? false : { scale: 0.98, y: 6 }}
              animate={{ scale: 1, y: 0 }}
            >
              <h2 id="close-title" className="font-display text-xl text-ink">
                Close this room?
              </h2>
              <ul className="mt-4 space-y-2.5 text-[14px] leading-relaxed text-ink-secondary">
                <li>
                  <span className="font-medium text-ink">Removed:</span> live session
                  messages for this room in the demo store.
                </li>
                <li>
                  <span className="font-medium text-ink">Kept:</span> approved
                  commitments.
                </li>
                <li className="text-[13px] text-ink-quiet">
                  This demonstrates minimized retention. It is not a production
                  deletion guarantee.
                </li>
              </ul>
              <div className="mt-6 flex justify-end gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setConfirmClose(false)}
                  disabled={busy}
                >
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleClose} loading={busy}>
                  Close room
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
