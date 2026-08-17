"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/data/store";
import type { UserRole } from "@/domain/types";

const roles: {
  role: UserRole;
  title: string;
  description: string;
  detail: string;
}[] = [
  {
    role: "facilitator",
    title: "Facilitator",
    description: "Guide the room, set the pace, and approve what carries forward.",
    detail: "Open a live session, move through stages, review commitments, and close with care.",
  },
  {
    role: "participant",
    title: "Participant",
    description: "Join under an assigned role and contribute to the dialogue.",
    detail: "Speak from your experience. Request a pause if the process needs to slow down.",
  },
];

export default function EnterPage() {
  const enterAs = useAppStore((s) => s.enterAs);
  const router = useRouter();

  function choose(role: UserRole) {
    enterAs(role);
    if (role === "facilitator") {
      router.push("/app");
    } else {
      router.push("/room/room-1");
    }
  }

  return (
    <div className="relative min-h-[calc(100dvh-2.5rem)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(106,138,131,0.09),transparent)]" />

      <div className="container-app relative flex min-h-[calc(100dvh-2.5rem)] flex-col items-center justify-center py-16">
        <div className="mb-12 max-w-md text-center">
          <Link
            href="/"
            className="text-[15px] font-semibold tracking-tight text-ink transition-colors hover:text-accent"
          >
            SquadRidge
          </Link>
          <h1 className="mt-8 font-display text-[2rem] leading-[1.1] tracking-tight text-ink sm:text-[2.35rem]">
            Choose how you enter
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-secondary">
            This is a guided demonstration with sample data—not a production login.
          </p>
        </div>

        <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
          {roles.map((r) => (
            <button
              key={r.role}
              type="button"
              onClick={() => choose(r.role)}
              className="group flex flex-col rounded-[16px] border border-[var(--border-default)] bg-[var(--surface-raised)] p-6 text-left transition-all hover:border-[var(--border-strong)] hover:bg-[var(--surface-raised)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <span className="text-[11px] font-medium uppercase tracking-[0.06em] text-ink-quiet">
                Enter as
              </span>
              <span className="mt-2 text-xl font-medium tracking-tight text-ink group-hover:text-accent transition-colors">
                {r.title}
              </span>
              <span className="mt-2 text-[14px] leading-relaxed text-ink-secondary">
                {r.description}
              </span>
              <span className="mt-4 text-[13px] leading-relaxed text-ink-quiet">
                {r.detail}
              </span>
              <span className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-accent">
                Continue
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path
                    d="M3 7h8M8 3.5L11.5 7 8 10.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
          ))}
        </div>

        <p className="mt-10 text-center text-[13px] text-ink-quiet">
          <Link href="/" className="transition-colors hover:text-ink-secondary">
            ← Back to overview
          </Link>
        </p>
      </div>
    </div>
  );
}
