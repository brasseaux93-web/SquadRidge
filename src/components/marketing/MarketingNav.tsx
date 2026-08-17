"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "#how", label: "How it works" },
  { href: "#privacy", label: "Privacy" },
  { href: "#audience", label: "Who it’s for" },
];

export function MarketingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-md"
      style={{
        background: "rgba(247, 247, 244, 0.88)",
        borderColor: "var(--m-border)",
      }}
    >
      <div className="container-marketing flex h-14 items-center justify-between gap-4">
        <Link
          href="/"
          className="text-[17px] font-semibold tracking-tight text-[var(--m-ink)]"
        >
          SquadRidge
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[14px] text-[var(--m-ink-secondary)] transition-colors hover:text-[var(--m-ink)]"
            >
              {l.label}
            </a>
          ))}
          <Link href="/enter" className="btn-m-primary min-h-[38px] px-4 text-[14px]">
            Explore the demo
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border md:hidden"
          style={{ borderColor: "var(--m-border)" }}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
            {open ? (
              <path
                d="M4 4l10 10M14 4L4 14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M3 5h12M3 9h12M3 13h12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="border-t px-5 py-4 md:hidden"
          style={{
            borderColor: "var(--m-border)",
            background: "var(--m-canvas)",
          }}
        >
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-[10px] px-3 py-2.5 text-[15px] text-[var(--m-ink)]"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <Link
              href="/enter"
              className="btn-m-primary mt-2 w-full"
              onClick={() => setOpen(false)}
            >
              Explore the demo
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
