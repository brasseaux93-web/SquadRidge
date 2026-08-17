import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PrivacyLabel } from "@/components/ui/PrivacyLabel";

export default function HomePage() {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-canvas/85 backdrop-blur-md">
        <div className="container-app flex h-14 items-center justify-between">
          <Link href="/" className="font-display text-xl tracking-tight text-ink">
            SquadRidge
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-ink-secondary md:flex">
            <a href="#arc" className="hover:text-ink transition-colors">
              The arc
            </a>
            <a href="#boundaries" className="hover:text-ink transition-colors">
              Boundaries
            </a>
            <a href="#for-whom" className="hover:text-ink transition-colors">
              For whom
            </a>
            <Link href="/enter">
              <Button variant="ghost" className="min-h-[34px] px-3.5 py-1.5 text-sm">
                Enter demo
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="container-app grid gap-12 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-24">
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="section-label">Pilot infrastructure · mediators & ombuds</span>
              <PrivacyLabel scope="demo" />
            </div>
            <h1 className="font-display text-[2.35rem] leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.15rem]">
              Private rooms for difficult conversations — and durable next steps.
            </h1>
            <p className="mt-5 max-w-prose text-base leading-relaxed text-ink-secondary sm:text-lg">
              SquadRidge is facilitator-led dialogue infrastructure. Participants enter
              under assigned roles. Live exchange is temporary. Only consented
              commitments cross into a retained record.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/enter">
                <Button>Enter the facilitated room demo</Button>
              </Link>
              <a href="#arc">
                <Button variant="ghost">See the product arc</Button>
              </a>
            </div>
            <p className="mt-6 max-w-md text-xs leading-relaxed text-ink-quiet">
              This is a prototype. Fixture data is used. Real identity verification and
              production encryption are not active. Transparency is intentional.
            </p>
          </div>

          {/* Abstract governed-passage visual */}
          <div className="relative">
            <div className="surface-raised overflow-hidden rounded-xl shadow-lift">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-4 py-2.5">
                <span className="text-xs font-medium text-ink">Governed passage</span>
                <PrivacyLabel scope="room" />
              </div>
              <div className="space-y-0 p-5">
                {/* Abstract rooms connected by controlled path */}
                <div className="flex items-center gap-3">
                  <div className="flex h-16 w-20 flex-col items-center justify-center rounded-md border border-private/30 bg-private-muted">
                    <span className="text-[0.6rem] uppercase tracking-wider text-private">Room</span>
                    <span className="mt-0.5 text-xs text-ink-secondary">Dialogue</span>
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-private/40 via-white/15 to-progress/40" aria-hidden />
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-attention/40 bg-attention-muted">
                    <span className="text-[0.55rem] font-medium text-attention">Gate</span>
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-progress/30 to-consented/40" aria-hidden />
                  <div className="flex h-16 w-20 flex-col items-center justify-center rounded-md border border-progress/30 bg-progress-muted">
                    <span className="text-[0.6rem] uppercase tracking-wider text-progress">Ledger</span>
                    <span className="mt-0.5 text-xs text-ink-secondary">Retained</span>
                  </div>
                </div>
                <p className="mt-5 text-center text-[0.7rem] leading-relaxed text-ink-quiet">
                  Only approved, consented commitments cross the boundary.
                  Session text does not.
                </p>
              </div>
              <div className="border-t border-[var(--border-subtle)] bg-canvas/40 px-4 py-2.5 text-[0.65rem] text-ink-quiet">
                Abstract system model · not a live operational view
              </div>
            </div>
          </div>
        </section>

        {/* Product arc */}
        <section className="border-t border-[var(--border-subtle)] py-16" id="arc">
          <div className="container-app">
            <span className="section-label">The product arc</span>
            <h2 className="mt-2 max-w-2xl font-display text-3xl text-ink sm:text-4xl">
              From private exchange to accountable next steps.
            </h2>
            <ol className="mt-12 grid gap-6 md:grid-cols-3">
              {[
                {
                  n: "01",
                  title: "Enter under role",
                  body: "Participants are invited or verified before entry. Inside the room they appear through facilitator-assigned roles so the focus stays on substance, not status.",
                },
                {
                  n: "02",
                  title: "Facilitate with structure",
                  body: "A visible Dialogue Spine guides phases—arrival, listening, clarification, options, commitments—without turning the room into a surveillance surface.",
                },
                {
                  n: "03",
                  title: "Retain only what is agreed",
                  body: "When the room closes, live dialogue is purged. Only facilitator-approved, consented commitments move to the outcome ledger.",
                },
              ].map((step) => (
                <li
                  key={step.n}
                  className="rounded-lg border border-[var(--border-subtle)] bg-surface/50 p-5"
                >
                  <span className="font-mono text-xs text-ink-quiet">{step.n}</span>
                  <h3 className="mt-2 text-base font-medium text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Boundaries */}
        <section className="border-t border-[var(--border-subtle)] py-16" id="boundaries">
          <div className="container-app max-w-3xl">
            <span className="section-label">Boundaries</span>
            <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
              Privacy is operational, not ornamental.
            </h2>
            <p className="mt-4 text-ink-secondary">
              SquadRidge is designed around minimized retention and explicit consent.
              What appears where is deliberate. Nothing is implied that the system
              does not actually enforce.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                {
                  label: "Room",
                  text: "Live dialogue is visible only to current room members while the session is open.",
                },
                {
                  label: "Facilitators",
                  text: "Working proposals and safety requests are visible to assigned facilitators.",
                },
                {
                  label: "Ledger",
                  text: "Only approved commitments are retained after close. Publication requires additional consent.",
                },
                {
                  label: "Demo",
                  text: "This prototype uses fixture data. No production encryption or identity verification is active.",
                },
              ].map((row) => (
                <li
                  key={row.label}
                  className="flex gap-4 rounded-lg border border-[var(--border-subtle)] bg-surface/40 px-4 py-3"
                >
                  <span className="w-24 shrink-0 text-xs font-medium uppercase tracking-wide text-ink-quiet">
                    {row.label}
                  </span>
                  <span className="text-sm text-ink-secondary">{row.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* For whom */}
        <section className="border-t border-[var(--border-subtle)] py-16" id="for-whom">
          <div className="container-app">
            <span className="section-label">For whom</span>
            <h2 className="mt-2 max-w-xl font-display text-3xl text-ink">
              Built for people who hold hard conversations.
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                "Mediators",
                "Ombuds teams",
                "HR / Employee Relations",
                "Institutional pilot partners",
              ].map((audience) => (
                <div
                  key={audience}
                  className="rounded-lg border border-[var(--border-subtle)] bg-surface/40 px-4 py-5 text-center text-sm font-medium text-ink"
                >
                  {audience}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-[var(--border-subtle)] py-16">
          <div className="container-app text-center">
            <h2 className="font-display text-3xl text-ink">Experience the facilitated room</h2>
            <p className="mx-auto mt-3 max-w-prose text-ink-secondary">
              Walk through phases, dialogue under roles, outcome approval, and room
              close with message purge—using clearly labeled demo data.
            </p>
            <div className="mt-8">
              <Link href="/enter">
                <Button>Enter demo</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border-subtle)] bg-surface py-10">
        <div className="container-app flex flex-col gap-6 text-sm text-ink-secondary sm:flex-row sm:justify-between">
          <div>
            <div className="font-display text-lg text-ink">SquadRidge</div>
            <p className="mt-1 max-w-sm text-ink-quiet">
              Infrastructure for conversations that cannot safely happen in ordinary tools.
            </p>
          </div>
          <div className="flex flex-wrap gap-6">
            <Link href="/privacy" className="hover:text-ink transition-colors">
              Privacy
            </Link>
            <Link href="/security" className="hover:text-ink transition-colors">
              Security overview
            </Link>
            <Link href="/enter" className="hover:text-ink transition-colors">
              Demo
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
