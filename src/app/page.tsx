import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-white/5 bg-deep/80 backdrop-blur-md">
        <div className="container-app flex h-16 items-center justify-between">
          <Link href="/" className="font-serif text-2xl text-ink">
            SquadRidge
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-ink md:flex">
            <a href="#how" className="hover:text-accent">
              How it works
            </a>
            <a href="#privacy" className="hover:text-accent">
              Privacy
            </a>
            <Link href="/enter">
              <Button variant="ghost" className="min-h-[36px] px-4 py-1.5 text-sm">
                Enter demo
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="container-app grid gap-10 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
          <div>
            <span className="section-pill">Pilot program — mediators & ombuds teams</span>
            <h1 className="font-serif text-4xl leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.25rem]">
              A private room for difficult conversations — and durable next steps.
            </h1>
            <p className="mt-5 max-w-prose text-lg text-ink-muted">
              SquadRidge gives facilitators a structured digital space for sensitive
              dialogue. Participants can speak candidly under role-based identities.
              Only approved commitments carry forward when the room closes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/enter">
                <Button>Enter the facilitated room demo</Button>
              </Link>
              <a href="#how">
                <Button variant="ghost">See how it works</Button>
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-4 rounded-lg border border-white/8 bg-white/[0.02] px-4 py-3 text-sm text-ink">
              <span>Private dialogue</span>
              <span className="text-white/20">|</span>
              <span>Facilitator control</span>
              <span className="text-white/20">|</span>
              <span>Approved outcomes only</span>
            </div>
          </div>

          <div className="glass overflow-hidden rounded-xl shadow-lift">
            <div className="flex items-center justify-between border-b border-white/5 bg-elevated px-4 py-3 text-sm">
              <span className="font-medium text-ink">SESSION: Team alignment</span>
              <span className="rounded-full border border-accent/30 bg-accent-muted px-2.5 py-0.5 text-xs text-accent">
                Facilitator-guided · Live
              </span>
            </div>
            <div className="space-y-3 p-4">
              <div className="rounded-lg border border-white/5 bg-deep p-3">
                <div className="text-xs font-medium uppercase tracking-wide text-accent">
                  Engineer A
                </div>
                <p className="mt-1 text-sm text-ink">
                  “I felt the review process last month bypassed the technical
                  standards we had agreed on.”
                </p>
              </div>
              <div className="rounded-lg border border-accent/25 bg-accent-muted p-3">
                <div className="text-[0.65rem] font-bold uppercase tracking-wide text-ink-muted">
                  Proposed commitment
                </div>
                <p className="mt-1 text-sm text-ink">
                  Review Q4 technical standards together before implementation begins.
                </p>
                <div className="mt-2 flex flex-wrap justify-between gap-2 text-xs">
                  <span className="text-accent">Ready for facilitator review</span>
                  <span className="italic text-ink-muted">Saved to outcome ledger</span>
                </div>
              </div>
            </div>
            <div className="flex justify-between border-t border-white/5 bg-elevated px-4 py-2 text-xs text-ink-muted">
              <span>Private room</span>
              <span>Session text not retained after close</span>
            </div>
          </div>
        </section>

        <section className="border-t border-white/5 py-16" id="how">
          <div className="container-app max-w-3xl">
            <span className="section-pill">How it works</span>
            <h2 className="font-serif text-3xl text-ink sm:text-4xl">
              A structured room for honest dialogue.
            </h2>
            <ol className="mt-10 space-y-8">
              {[
                {
                  step: "1 — Prepare the room",
                  title: "Verify participants without putting identities on display.",
                  body: "Participants are verified before entering. Inside the room they appear through facilitator-assigned roles so the conversation stays focused on substance.",
                },
                {
                  step: "2 — Guide the conversation",
                  title: "Facilitate with structure, not surveillance.",
                  body: "Set ground rules, guide phases, open private caucuses when appropriate, and keep the group oriented toward practical next steps.",
                },
                {
                  step: "3 — Approve the outcome",
                  title: "Keep the agreement—not a replay of the conversation.",
                  body: "Only approved commitments, timelines, and unresolved items move to the ledger. Live discussion does not become a permanent transcript.",
                },
              ].map((s) => (
                <li key={s.step} className="border-l-2 border-accent/40 pl-5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-accent">
                    {s.step}
                  </div>
                  <h3 className="mt-1 text-lg font-medium text-ink">{s.title}</h3>
                  <p className="mt-2 text-ink-muted">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-t border-white/5 py-16" id="privacy">
          <div className="container-app max-w-3xl">
            <span className="section-pill">Privacy by design</span>
            <h2 className="font-serif text-3xl text-ink sm:text-4xl">
              Protect the conversation. Preserve the progress.
            </h2>
            <p className="mt-4 text-ink-muted">
              SquadRidge is built around minimized retention: active room dialogue does
              not become a permanent transcript. Facilitators retain only what the
              group agrees should carry forward.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                "Private live-room communication",
                "Minimized retention of session dialogue",
                "Separate identity and room context",
                "Outcome-focused recordkeeping",
                "No participant scoring or ranking",
                "No session-text used for model training",
              ].map((item) => (
                <li
                  key={item}
                  className="rounded-lg border border-white/8 bg-surface px-4 py-3 text-sm text-ink"
                >
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-ink-muted">
              Like any software, SquadRidge cannot prevent screenshots or external notes.
              It is a tool to support trust—not a replacement for it. This prototype uses
              local fixtures and does not implement production encryption.
            </p>
          </div>
        </section>

        <section className="border-t border-white/5 py-16">
          <div className="container-app text-center">
            <h2 className="font-serif text-3xl text-ink">Try the facilitated room</h2>
            <p className="mx-auto mt-3 max-w-prose text-ink-muted">
              Enter as a facilitator or participant to walk through room phases,
              dialogue, outcome approval, and session close with message purge.
            </p>
            <div className="mt-8">
              <Link href="/enter">
                <Button>Enter demo</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 bg-surface py-10">
        <div className="container-app flex flex-col gap-4 text-sm text-ink-muted sm:flex-row sm:justify-between">
          <div>
            <div className="font-serif text-lg text-ink">SquadRidge</div>
            <p className="mt-1 max-w-sm">
              Built with care for the people who hold the hardest conversations.
            </p>
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-accent">
              Privacy
            </Link>
            <Link href="/security" className="hover:text-accent">
              Security overview
            </Link>
            <Link href="/enter" className="hover:text-accent">
              Demo
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
