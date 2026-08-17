"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useAppStore } from "@/data/store";
import type { UserRole } from "@/domain/types";
import { EphemeralStateBadge } from "@/components/ui/EphemeralStateBadge";
import { FacilitatorCue } from "@/components/ui/FacilitatorCue";
import { ApprovedCommitmentCard } from "@/components/ui/ApprovedCommitmentCard";
import { DissolveDialogue } from "@/components/ui/DissolveDialogue";
import { cn } from "@/lib/utils";

type Stage = "entry" | "preparing" | "preview" | "dissolved";

const entryOptions: {
  role: UserRole;
  title: string;
  description: string;
  detail: string;
}[] = [
  {
    role: "facilitator",
    title: "Facilitator",
    description:
      "Guide the room, set the pace, and approve what carries forward.",
    detail:
      "Open a live session, move through stages, review commitments, and close with care.",
  },
  {
    role: "participant",
    title: "Participant",
    description: "Join under an assigned role and contribute to the dialogue.",
    detail:
      "Speak from your experience. Request a pause if the process needs to slow down.",
  },
];

/**
 * Fluid demo entry: Airlock → preparing → optional in-place preview or route into app.
 *
 * Honest language only. No zero-knowledge, E2E encryption, or AI/empathic engine claims.
 */
export function DemoWorkflow({
  mode = "navigate",
}: {
  /** navigate: after airlock, go to real demo routes; preview: stay on page for dissolve demo */
  mode?: "navigate" | "preview";
}) {
  const router = useRouter();
  const enterAs = useAppStore((s) => s.enterAs);
  const reduce = useReducedMotion();
  const [stage, setStage] = React.useState<Stage>("entry");
  const [selectedRole, setSelectedRole] = React.useState<UserRole | null>(null);
  const [dissolving, setDissolving] = React.useState(false);

  function start(role: UserRole) {
    setSelectedRole(role);
    setStage("preparing");

    window.setTimeout(
      () => {
        enterAs(role);
        if (mode === "navigate") {
          if (role === "facilitator") router.push("/app");
          else router.push("/room/room-1");
        } else {
          setStage("preview");
        }
      },
      reduce ? 0 : 900
    );
  }

  function endSession() {
    setDissolving(true);
  }

  return (
    <div className="theme-marketing relative min-h-[calc(100dvh-2.5rem)] overflow-hidden">
      <AnimatePresence mode="wait">
        {stage === "entry" && (
          <motion.div
            key="entry"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98, filter: "blur(8px)" }}
            transition={{ duration: reduce ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="container-marketing flex min-h-[calc(100dvh-2.5rem)] flex-col items-center justify-center py-14"
          >
            <div className="mb-12 max-w-lg text-center">
              <Link
                href="/"
                className="text-[15px] font-semibold tracking-tight text-[var(--m-ink)] transition-colors hover:text-[var(--m-accent)]"
              >
                SquadRidge
              </Link>
              <div className="mt-6 flex justify-center">
                <EphemeralStateBadge state="demo" />
              </div>
              <h1 className="mt-6 font-display text-[2.15rem] leading-[1.08] tracking-tight text-[var(--m-ink)] sm:text-[2.75rem]">
                Choose how you enter
              </h1>
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--m-ink-secondary)]">
                Guided demonstration with sample data—not a production login.
              </p>
            </div>

            <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
              {entryOptions.map((option) => (
                <motion.button
                  key={option.role}
                  type="button"
                  layoutId={reduce ? undefined : `role-card-${option.role}`}
                  onClick={() => start(option.role)}
                  className={cn(
                    "group flex flex-col rounded-[18px] border bg-[var(--m-surface)] p-6 text-left shadow-[var(--m-shadow-sm)] transition-colors",
                    "hover:border-[var(--m-accent)]/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--m-accent)]"
                  )}
                  style={{ borderColor: "var(--m-border)" }}
                >
                  <span className="text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--m-ink-quiet)]">
                    Enter as
                  </span>
                  <motion.span
                    layoutId={reduce ? undefined : `role-title-${option.role}`}
                    className="mt-2 text-xl font-semibold tracking-tight text-[var(--m-ink)]"
                  >
                    {option.title}
                  </motion.span>
                  <span className="mt-2 text-[14px] leading-relaxed text-[var(--m-ink-secondary)]">
                    {option.description}
                  </span>
                  <span className="mt-3 text-[13px] leading-relaxed text-[var(--m-ink-quiet)]">
                    {option.detail}
                  </span>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--m-accent)]">
                    Continue
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </motion.button>
              ))}
            </div>

            <p className="mt-10 text-[13px] text-[var(--m-ink-quiet)]">
              <Link href="/" className="hover:text-[var(--m-ink-secondary)]">
                ← Back to overview
              </Link>
            </p>
          </motion.div>
        )}

        {stage === "preparing" && selectedRole && (
          <motion.div
            key="preparing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container-marketing flex min-h-[calc(100dvh-2.5rem)] flex-col items-center justify-center py-14"
          >
            <motion.div
              layoutId={reduce ? undefined : `role-card-${selectedRole}`}
              className="w-full max-w-sm rounded-[18px] border bg-[var(--m-surface)] p-8 text-center shadow-[var(--m-shadow)]"
              style={{ borderColor: "var(--m-border)" }}
            >
              <div
                className="mx-auto mb-4 h-8 w-8 rounded-full border-2 border-[var(--m-accent)] border-t-transparent animate-spin"
                aria-hidden
              />
              <motion.h2
                layoutId={reduce ? undefined : `role-title-${selectedRole}`}
                className="text-lg font-semibold text-[var(--m-ink)]"
              >
                Preparing demo room
              </motion.h2>
              <p className="mt-2 text-[14px] text-[var(--m-ink-secondary)]">
                Entering as{" "}
                {selectedRole === "facilitator" ? "Facilitator" : "Participant"}.
                Sample data only.
              </p>
              <div className="mt-4 flex justify-center">
                <EphemeralStateBadge state="demo" />
              </div>
            </motion.div>
          </motion.div>
        )}

        {(stage === "preview" || stage === "dissolved") && selectedRole && (
          <motion.div
            key="preview"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="container-marketing flex min-h-[calc(100dvh-2.5rem)] flex-col py-10"
          >
            <header
              className="flex flex-wrap items-center justify-between gap-3 border-b pb-4"
              style={{ borderColor: "var(--m-border)" }}
            >
              <div>
                <motion.h2
                  layoutId={reduce ? undefined : `role-title-${selectedRole}`}
                  className="text-xl font-semibold text-[var(--m-ink)]"
                >
                  {selectedRole === "facilitator" ? "Facilitator" : "Participant"}{" "}
                  preview
                </motion.h2>
                <p className="mt-1 text-[13px] text-[var(--m-ink-quiet)]">
                  In-place workflow demo — not the full application shell
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <EphemeralStateBadge state="liveTemporary" />
                {selectedRole === "facilitator" ? (
                  <FacilitatorCue
                    tone="calm"
                    label="Phase"
                    detail="Dialogue"
                  />
                ) : null}
                {stage !== "dissolved" ? (
                  <button
                    type="button"
                    onClick={endSession}
                    className="btn-m-secondary min-h-[36px] px-3 text-[13px]"
                  >
                    Close room · dissolve dialogue
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setDissolving(false);
                      setStage("entry");
                      setSelectedRole(null);
                    }}
                    className="btn-m-primary min-h-[36px] px-3 text-[13px]"
                  >
                    Start over
                  </button>
                )}
              </div>
            </header>

            <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <DissolveDialogue
                dissolving={dissolving}
                onDissolved={() => setStage("dissolved")}
              >
                <div
                  className="space-y-4 rounded-[18px] border bg-[var(--m-surface)] p-5"
                  style={{ borderColor: "var(--m-border)" }}
                >
                  <p className="text-[11px] font-medium text-[var(--m-accent)]">
                    Participant A
                  </p>
                  <p className="text-[15px] leading-relaxed text-[var(--m-ink)]">
                    I need us to acknowledge that ownership was unclear after the
                    handoff.
                  </p>
                  <p className="text-[11px] font-medium text-[var(--m-ink-quiet)]">
                    Participant B
                  </p>
                  <p className="text-[15px] leading-relaxed text-[var(--m-ink)]">
                    I hear that. The checklist did not get the attention it needed.
                  </p>
                </div>
              </DissolveDialogue>

              <div className="space-y-3">
                <ApprovedCommitmentCard
                  body="We agree to schedule a follow-up by Friday."
                  ownerLabel="Both parties"
                  className="!bg-[var(--m-surface)] !text-[var(--m-ink)] border-[var(--m-border)]"
                />
                {stage === "dissolved" ? (
                  <p className="text-[13px] leading-relaxed text-[var(--m-ink-secondary)]">
                    Live dialogue has been cleared from this preview. The approved
                    commitment remains. Application purge is not cryptographic
                    erasure.
                  </p>
                ) : (
                  <p className="text-[13px] leading-relaxed text-[var(--m-ink-quiet)]">
                    Closing dissolves temporary dialogue and leaves only what was
                    approved to keep.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
