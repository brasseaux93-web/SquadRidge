import Link from "next/link";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { ProductMockup } from "@/components/marketing/ProductMockup";

const benefits = [
  {
    title: "Enter with context",
    body: "Participants arrive through clear roles and shared expectations, so the conversation can focus on what matters.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M4 16c1.2-2.4 3.2-3.6 6-3.6s4.8 1.2 6 3.6"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Facilitate with care",
    body: "A visible session structure helps facilitators guide listening, clarification, options, and agreement.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <path
          d="M4 10h12M10 4v12"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    title: "Keep only what is agreed",
    body: "Live dialogue ends with the room. Only approved commitments move forward.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <path
          d="M5 10.5l3 3 7-7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const audiences = [
  {
    title: "Mediators",
    body: "Hold structured sessions where roles stay clear and only agreed next steps are kept.",
  },
  {
    title: "Ombuds teams",
    body: "Offer a calmer digital room for sensitive workplace dialogue without a permanent transcript by default.",
  },
  {
    title: "Employee relations",
    body: "Support difficult conversations with facilitation tools and explicit commitment records.",
  },
  {
    title: "Institutional pilot partners",
    body: "Evaluate a bounded process for facilitated dialogue before wider deployment.",
  },
];

export default function HomePage() {
  return (
    <div className="theme-marketing">
      <MarketingNav />

      <p
        className="border-b px-5 py-2 text-center text-[12px] leading-relaxed text-[var(--m-ink-quiet)] sm:px-8"
        style={{ borderColor: "var(--m-border)" }}
      >
        Prototype preview — uses sample data. Production identity verification and
        encryption are not active.
      </p>

      <main>
        {/* Hero */}
        <section className="container-marketing grid items-center gap-12 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-20">
          <div>
            <p className="text-[13px] font-medium tracking-wide text-[var(--m-accent)]">
              For conversations that need care
            </p>
            <h1 className="mt-4 text-[42px] font-semibold leading-[1.05] tracking-[-0.03em] text-[var(--m-ink)] sm:text-[56px] lg:text-[64px]">
              Difficult conversations deserve better infrastructure.
            </h1>
            <p className="mt-5 max-w-[34rem] text-[17px] leading-[1.55] text-[var(--m-ink-secondary)] sm:text-[18px]">
              SquadRidge gives facilitators a private, structured space for
              dialogue—and a clear path to the commitments people choose to carry
              forward.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/enter" className="btn-m-primary">
                Explore the demo
              </Link>
              <a href="#how" className="btn-m-secondary">
                How it works
              </a>
            </div>
          </div>

          <div className="lg:justify-self-end lg:w-full lg:max-w-[440px]">
            <ProductMockup />
          </div>
        </section>

        {/* Benefits */}
        <section
          id="how"
          className="border-t py-16 sm:py-20"
          style={{ borderColor: "var(--m-border)" }}
        >
          <div className="container-marketing">
            <p className="text-[13px] font-medium text-[var(--m-ink-quiet)]">
              Designed for the whole conversation
            </p>
            <h2 className="mt-3 max-w-[28rem] text-[32px] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--m-ink)] sm:text-[40px]">
              From a hard conversation to a shared next step.
            </h2>

            <ul className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-8">
              {benefits.map((item) => (
                <li key={item.title}>
                  <div
                    className="mb-4 flex h-10 w-10 items-center justify-center rounded-[12px] text-[var(--m-accent)]"
                    style={{ background: "var(--m-accent-soft)" }}
                  >
                    {item.icon}
                  </div>
                  <h3 className="text-[17px] font-semibold text-[var(--m-ink)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[var(--m-ink-secondary)]">
                    {item.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Privacy */}
        <section
          id="privacy"
          className="border-t py-16 sm:py-20"
          style={{ borderColor: "var(--m-border)" }}
        >
          <div className="container-marketing max-w-[720px]">
            <p className="text-[13px] font-medium text-[var(--m-ink-quiet)]">
              Privacy by design
            </p>
            <h2 className="mt-3 text-[32px] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--m-ink)] sm:text-[40px]">
              The conversation is not the record.
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-[var(--m-ink-secondary)]">
              SquadRidge separates a live, facilitator-led session from the
              commitments people explicitly choose to retain.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div
                className="rounded-[18px] border p-5"
                style={{
                  borderColor: "var(--m-border)",
                  background: "var(--m-surface)",
                }}
              >
                <p className="text-[12px] font-medium uppercase tracking-wide text-[var(--m-ink-quiet)]">
                  Inside the room
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-[var(--m-ink)]">
                  Temporary live dialogue, visible to current participants while the
                  session is open.
                </p>
              </div>
              <div
                className="rounded-[18px] border p-5"
                style={{
                  borderColor: "var(--m-border)",
                  background: "var(--m-accent-soft)",
                }}
              >
                <p className="text-[12px] font-medium uppercase tracking-wide text-[var(--m-accent)]">
                  After the room
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-[var(--m-ink)]">
                  Approved commitments only—what the group explicitly chooses to keep.
                </p>
              </div>
            </div>

            <p className="mt-6 text-[13px] leading-relaxed text-[var(--m-ink-quiet)]">
              In this preview, data is fixture-only. Production privacy controls are
              not yet active.
            </p>
          </div>
        </section>

        {/* Audience */}
        <section
          id="audience"
          className="border-t py-16 sm:py-20"
          style={{ borderColor: "var(--m-border)" }}
        >
          <div className="container-marketing">
            <h2 className="max-w-[24rem] text-[32px] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--m-ink)] sm:text-[40px]">
              Built for people who hold hard conversations.
            </h2>
            <ul className="mt-12 grid gap-6 sm:grid-cols-2">
              {audiences.map((a) => (
                <li
                  key={a.title}
                  className="rounded-[18px] border p-6"
                  style={{
                    borderColor: "var(--m-border)",
                    background: "var(--m-surface)",
                  }}
                >
                  <h3 className="text-[16px] font-semibold text-[var(--m-ink)]">
                    {a.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[var(--m-ink-secondary)]">
                    {a.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Closing CTA */}
        <section
          className="border-t py-16 sm:py-20"
          style={{ borderColor: "var(--m-border)" }}
        >
          <div className="container-marketing text-center">
            <h2 className="mx-auto max-w-[28rem] text-[32px] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--m-ink)] sm:text-[40px]">
              See what a more deliberate conversation space feels like.
            </h2>
            <p className="mx-auto mt-4 max-w-[32rem] text-[17px] leading-relaxed text-[var(--m-ink-secondary)]">
              Walk through a guided room, role-based dialogue, commitment approval,
              and a clear room close using sample data.
            </p>
            <div className="mt-8">
              <Link href="/enter" className="btn-m-primary">
                Explore the demo
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer
        className="border-t py-10"
        style={{ borderColor: "var(--m-border)", background: "var(--m-surface-soft)" }}
      >
        <div className="container-marketing flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[16px] font-semibold text-[var(--m-ink)]">SquadRidge</p>
            <p className="mt-1 max-w-sm text-[14px] leading-relaxed text-[var(--m-ink-secondary)]">
              A private space for facilitated dialogue and deliberate next steps.
            </p>
            <p className="mt-3 text-[12px] text-[var(--m-ink-quiet)]">
              Prototype preview · sample data only
            </p>
          </div>
          <div className="flex flex-wrap gap-6 text-[14px] text-[var(--m-ink-secondary)]">
            <Link href="/privacy" className="hover:text-[var(--m-ink)] transition-colors">
              Privacy
            </Link>
            <Link href="/security" className="hover:text-[var(--m-ink)] transition-colors">
              Security overview
            </Link>
            <Link href="/enter" className="hover:text-[var(--m-ink)] transition-colors">
              Demo
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
