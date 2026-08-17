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
      <Card>
        <p className="text-ink-muted">Room not found.</p>
        <Link href="/app" className="mt-4 inline-block text-accent">
          ← Back to rooms
        </Link>
      </Card>
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
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/app" className="text-sm text-ink-muted hover:text-accent">
            ← Rooms
          </Link>
          <h1 className="mt-2 font-serif text-2xl text-ink sm:text-3xl">
            {room.title}
          </h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge tone={isClosed ? "success" : "accent"}>{room.status}</Badge>
            <Badge>Phase: {room.phase}</Badge>
            <Badge tone="neutral">Invite {room.inviteCode}</Badge>
            <Badge tone="neutral">You: Facilitator</Badge>
          </div>
        </div>
        {!isClosed && (
          <Button variant="danger" onClick={() => setConfirmClose(true)}>
            Close room & purge chat
          </Button>
        )}
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

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <Card className="flex min-h-[420px] flex-col">
            <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-3">
              <h2 className="text-sm font-medium text-ink">Live dialogue</h2>
              <span className="text-xs text-ink-muted">
                {isClosed
                  ? "Session closed — messages purged"
                  : "Visible only while the room is open"}
              </span>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto pr-1" aria-live="polite">
              <AnimatePresence initial={false}>
                {messages.length === 0 ? (
                  <p className="text-sm text-ink-muted">
                    {isClosed
                      ? "No session messages are retained after close. Approved outcomes remain on the ledger."
                      : "No messages yet. Participants appear under assigned roles."}
                  </p>
                ) : (
                  messages.map((m) => (
                    <motion.div
                      key={m.id}
                      initial={reduce ? false : { opacity: 0, y: 8 }}
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

            {!isClosed && (
              <div className="mt-4 border-t border-white/5 pt-4">
                <label className="sr-only" htmlFor="fac-msg">
                  Facilitator message
                </label>
                <textarea
                  id="fac-msg"
                  rows={2}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Guide the room as Facilitator…"
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

          {!isClosed && (
            <Card>
              <h2 className="text-sm font-medium text-ink">Propose outcome</h2>
              <p className="mt-1 text-xs text-ink-muted">
                Nothing reaches the ledger without your approval.
              </p>
              <textarea
                rows={3}
                value={outcomeDraft}
                onChange={(e) => setOutcomeDraft(e.target.value)}
                placeholder="e.g. Bi-weekly technical reviews before production deployments."
                className="mt-3 w-full rounded-md border border-white/10 bg-deep px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
              <div className="mt-2 flex justify-end">
                <Button
                  variant="subtle"
                  onClick={handlePropose}
                  disabled={!outcomeDraft.trim() || busy}
                >
                  Add to review queue
                </Button>
              </div>
            </Card>
          )}

          {isClosed && (
            <Card className="border-accent/20">
              <h2 className="text-sm font-medium text-ink">Room closed</h2>
              <p className="mt-2 text-sm text-ink-muted">
                Closed {room.closedAt ? formatDate(room.closedAt) : ""}. Live
                dialogue was purged from the demo store. Review the{" "}
                <Link
                  href={`/app/rooms/${room.id}/outcomes`}
                  className="text-accent hover:underline"
                >
                  outcome ledger
                </Link>{" "}
                for retained commitments.
              </p>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <h2 className="text-sm font-medium text-ink">Session phase</h2>
            <p className="mt-1 text-xs text-ink-muted">
              Facilitator-only control. Participants see the current phase.
            </p>
            <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Set phase">
              {SESSION_PHASES.map((p) => (
                <button
                  key={p}
                  type="button"
                  disabled={isClosed || busy}
                  onClick={() => handlePhase(p)}
                  className={`rounded-full border px-3 py-1 text-xs capitalize transition-colors disabled:opacity-40 ${
                    room.phase === p
                      ? "border-accent bg-accent-muted text-accent"
                      : "border-white/10 text-ink-muted hover:border-white/20"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-sm font-medium text-ink">Participants</h2>
            <ul className="mt-3 space-y-2">
              {participants.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-ink">{p.displayRole}</span>
                  {p.isFacilitator && (
                    <Badge tone="accent">Facilitator</Badge>
                  )}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-ink-muted">
              Real names are held outside the room context.
            </p>
          </Card>

          <Card>
            <h2 className="text-sm font-medium text-ink">Ground rules</h2>
            <ul className="mt-3 list-disc space-y-1 pl-4 text-sm text-ink-muted">
              {room.groundRules.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-ink">Outcome ledger</h2>
              <Link
                href={`/app/rooms/${room.id}/outcomes`}
                className="text-xs text-accent hover:underline"
              >
                Full view
              </Link>
            </div>
            <div className="mt-3 space-y-3">
              {outcomes.length === 0 && (
                <p className="text-sm text-ink-muted">No outcomes yet.</p>
              )}
              {outcomes.map((o) => (
                <div
                  key={o.id}
                  className="rounded-lg border border-white/8 bg-deep p-3"
                >
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
                  <p className="mt-2 text-sm text-ink">{o.body}</p>
                  {o.status === "proposed" && !isClosed && (
                    <div className="mt-3 flex gap-2">
                      <Button
                        className="min-h-[32px] px-3 py-1 text-xs"
                        disabled={busy}
                        onClick={() => setOutcomeStatus(o.id, "approved")}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="ghost"
                        className="min-h-[32px] px-3 py-1 text-xs"
                        disabled={busy}
                        onClick={() => setOutcomeStatus(o.id, "rejected")}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
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
              className="w-full max-w-md rounded-xl border border-white/10 bg-surface p-6 shadow-lift"
              initial={reduce ? false : { scale: 0.96, y: 8 }}
              animate={{ scale: 1, y: 0 }}
            >
              <h2 id="close-title" className="font-serif text-xl text-ink">
                Close room and purge chat?
              </h2>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-ink-muted">
                <li>
                  <strong className="text-ink">Deleted:</strong> all live session
                  messages in this demo store for this room.
                </li>
                <li>
                  <strong className="text-ink">Kept:</strong> approved (and other)
                  outcome ledger entries.
                </li>
                <li>
                  This is an in-browser demonstration of minimized retention—not a
                  production deletion guarantee.
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
                  Close & purge
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
