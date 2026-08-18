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
    highlight: false,
  },
  {
    title: "Ombuds teams",
    body: "Offer a calmer digital room for sensitive workplace dialogue without a permanent transcript by default.",
    highlight: false,
  },
  {
    title: "Employee relations",
    body: "Support difficult conversations with facilitation tools and explicit commitment records.",
    highlight: false,
  },
  {
    title: "Institutional pilot partners",
    body: "Evaluate a bounded, facilitator-led dialogue process before considering wider deployment.",
    highlight: true,
  },
];

const pilotTrust = [
  "Bounded pilot scope",
  "Facilitator-led process",
  "No production security claims",
];

export default function HomePage() {
  return (
    <div className="theme-marketing">
      {/* Prototype disclosure is global via DemoBanner in root layout */}
      <MarketingNav />

      <main>
        {/* Hero */}
        <section className="container-marketing grid items-center gap-12 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-20">
          <div>
            <p className="text-[13px] font-medium tracking-wide text-accent">
              For conversations that need care
            </p>
            <h1 className="mt-4 text-[42px] font-semibold leading-[1.05] tracking-[-0.03em] text-ink sm:text-[56px] lg:text-[64px]">
              Difficult conversations deserve better infrastructure.
            </h1>
            <p className="mt-5 max-w-[34rem] text-[17px] leading-[1.55] text-ink-secondary sm:text-[18px]">
              SquadRidge gives facilitators a structured space for dialogue, and a
              deliberate path to the commitments people choose to carry forward.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/enter" className="btn-m-primary shadow-soft">
                Explore the demo
              </Link>
              <a
                href="#pilot"
                className="inline-flex min-h-[44px] items-center px-3 text-[15px] font-medium text-ink-secondary transition-colors hover:text-ink"
              >
                Discuss a pilot
              </a>
            </div>
          </div>

          <div className="lg:w-full lg:max-w-[440px] lg:justify-self-end">
            <ProductMockup />
          </div>
        </section>

        {/* Benefits */}
        <section id="how" className="border-t border-border-subtle py-16 sm:py-20">
          <div className="container-marketing">
            <p className="text-[13px] font-medium text-ink-quiet">
              Designed for the whole conversation
            </p>
            <h2 className="mt-3 max-w-[28rem] text-[32px] font-semibold leading-[1.15] tracking-[-0.02em] text-ink sm:text-[40px]">
              From a hard conversation to a shared next step.
            </h2>

            <ul className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-8">
              {benefits.map((item) => (
                <li key={item.title}>
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-[12px] bg-accent-muted text-accent">
                    {item.icon}
                  </div>
                  <h3 className="text-[17px] font-semibold text-ink">{item.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-secondary">
                    {item.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Privacy */}
        <section id="privacy" className="border-t border-border-subtle py-16 sm:py-20">
          <div className="container-marketing max-w-[720px]">
            <p className="text-[13px] font-medium text-ink-quiet">Privacy by design</p>
            <h2 className="mt-3 text-[32px] font-semibold leading-[1.15] tracking-[-0.02em] text-ink sm:text-[40px]">
              The conversation is not the record.
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-ink-secondary">
              SquadRidge separates a live, facilitator-led session from the
              commitments people explicitly choose to retain.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[18px] border border-border-default bg-surface p-6 shadow-soft">
                <p className="text-[12px] font-medium uppercase tracking-wide text-ink-quiet">
                  Inside the room
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-ink">
                  Temporary live dialogue, visible to current participants while the
                  session is open.
                </p>
              </div>
              <div className="rounded-[18px] border border-accent/20 bg-accent-muted p-6">
                <p className="text-[12px] font-medium uppercase tracking-wide text-accent">
                  After the room
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-ink">
                  Approved commitments only. What the group explicitly chooses to keep.
                </p>
              </div>
            </div>

            <p className="mt-6 text-[13px] leading-relaxed text-ink-quiet">
              This preview uses sample data. Production safeguards are being designed
              separately from this prototype.
            </p>
          </div>
        </section>

        {/* Audience */}
        <section id="audience" className="border-t border-border-subtle py-16 sm:py-20">
          <div className="container-marketing">
            <h2 className="max-w-[24rem] text-[32px] font-semibold leading-[1.15] tracking-[-0.02em] text-ink sm:text-[40px]">
              Built for people who hold hard conversations.
            </h2>
            <ul className="mt-12 grid gap-6 sm:grid-cols-2">
              {audiences.map((a) => (
                <li
                  key={a.title}
                  className={
                    a.highlight
                      ? "rounded-[18px] border border-accent/25 bg-surface p-6 shadow-soft ring-1 ring-accent/10"
                      : "rounded-[18px] border border-border-default bg-surface p-6"
                  }
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-[16px] font-semibold text-ink">{a.title}</h3>
                    {a.highlight ? (
                      <span className="shrink-0 rounded-full bg-accent-muted px-2.5 py-0.5 text-[11px] font-medium text-accent">
                        Early partners
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-secondary">
                    {a.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Pilot interest */}
        <section id="pilot" className="border-t border-border-subtle py-16 sm:py-20">
          <div className="container-marketing">
            <div className="rounded-[18px] border border-border-default bg-surface px-6 py-10 shadow-soft sm:px-10">
              <p className="text-[13px] font-medium text-accent">For early partners</p>
              <h2 className="mt-3 max-w-[28rem] text-[28px] font-semibold leading-[1.15] tracking-[-0.02em] text-ink sm:text-[36px]">
                Help shape a better infrastructure for hard conversations.
              </h2>
              <p className="mt-4 max-w-[36rem] text-[16px] leading-relaxed text-ink-secondary">
                SquadRidge is seeking a small number of institutional pilot partners to
                evaluate structured, facilitator-led dialogue in a bounded setting.
                Early conversations are exploratory and do not require a production
                deployment.
              </p>

              <ul className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-6">
                {pilotTrust.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-[14px] text-ink-secondary"
                  >
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                      aria-hidden
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <a
                  href="mailto:pilots@squadridge.example?subject=Pilot%20discussion%20request"
                  className="btn-m-primary shadow-soft"
                >
                  Discuss a pilot
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="border-t border-border-subtle py-16 sm:py-20">
          <div className="container-marketing text-center">
            <h2 className="mx-auto max-w-[28rem] text-[32px] font-semibold leading-[1.15] tracking-[-0.02em] text-ink sm:text-[40px]">
              See what a more deliberate conversation space feels like.
            </h2>
            <p className="mx-auto mt-4 max-w-[32rem] text-[17px] leading-relaxed text-ink-secondary">
              Walk through a guided room, role-based dialogue, commitment approval, and
              a clear room close using sample data.
            </p>
            <div className="mt-8">
              <Link href="/enter" className="btn-m-primary shadow-soft">
                Explore the demo
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border-subtle bg-surface-soft py-10">
        <div className="container-marketing flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[16px] font-semibold text-ink">SquadRidge</p>
            <p className="mt-1 max-w-sm text-[14px] leading-relaxed text-ink-secondary">
              A private space for facilitated dialogue and deliberate next steps.
            </p>
            <p className="mt-3 text-[12px] text-ink-quiet">
              Prototype preview · sample data only
            </p>
          </div>
          <div className="flex flex-wrap gap-6 text-[14px] text-ink-secondary">
            <Link href="/privacy" className="transition-colors hover:text-ink">
              Privacy
            </Link>
            <Link href="/security" className="transition-colors hover:text-ink">
              Security overview
            </Link>
            <Link href="/enter" className="transition-colors hover:text-ink">
              Demo
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
