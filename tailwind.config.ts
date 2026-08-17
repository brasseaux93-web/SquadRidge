import type { Config } from "tailwindcss";

/**
 * SquadRidge design tokens → CSS variables in globals.css.
 * Components must use semantic names — never hardcoded hex.
 */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "var(--canvas)",
        surface: {
          DEFAULT: "var(--surface)",
          soft: "var(--surface-soft)",
          raised: "var(--surface-raised)",
        },
        raised: "var(--surface-raised)",
        deep: "var(--canvas)",
        elevated: "var(--surface-raised)",

        accent: {
          DEFAULT: "var(--signal-active)",
          hover: "var(--accent-hover)",
          muted: "var(--signal-active-muted)",
          foreground: "var(--ink-inverse)",
        },
        primary: {
          DEFAULT: "var(--signal-active)",
          hover: "var(--accent-hover)",
          foreground: "var(--ink-inverse)",
        },

        ink: {
          DEFAULT: "var(--ink)",
          secondary: "var(--ink-secondary)",
          muted: "var(--ink-secondary)",
          quiet: "var(--ink-quiet)",
          inverse: "var(--ink-inverse)",
        },
        text: {
          primary: "var(--ink)",
          secondary: "var(--ink-secondary)",
        },

        private: {
          DEFAULT: "var(--signal-private)",
          muted: "var(--signal-private-muted)",
        },
        progress: {
          DEFAULT: "var(--signal-progress)",
          muted: "var(--signal-progress-muted)",
        },
        attention: {
          DEFAULT: "var(--signal-attention)",
          muted: "var(--signal-attention-muted)",
        },
        critical: {
          DEFAULT: "var(--signal-critical)",
          muted: "var(--signal-critical-muted)",
        },
        consented: {
          DEFAULT: "var(--signal-consented)",
          muted: "var(--signal-consented-muted)",
        },
        ephemeral: {
          DEFAULT: "var(--signal-ephemeral)",
          muted: "var(--signal-ephemeral-muted)",
          foreground: "var(--signal-ephemeral-fg)",
        },
        secure: {
          DEFAULT: "var(--signal-secure)",
          muted: "var(--signal-secure-muted)",
          foreground: "var(--signal-secure-fg)",
        },

        border: {
          DEFAULT: "var(--border-default)",
          subtle: "var(--border-subtle)",
          strong: "var(--border-strong)",
        },

        danger: "var(--signal-critical)",
        warning: "var(--signal-attention)",
        success: "var(--signal-progress)",

        marketing: {
          canvas: "var(--m-canvas)",
          surface: "var(--m-surface)",
          ink: "var(--m-ink)",
          secondary: "var(--m-ink-secondary)",
          quiet: "var(--m-ink-quiet)",
          accent: "var(--m-accent)",
          border: "var(--m-border)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        serif: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        lift: "var(--shadow-lift)",
        focus: "var(--shadow-focus)",
      },
      maxWidth: {
        container: "1120px",
        prose: "62ch",
      },
      transitionTimingFunction: {
        out: "var(--ease-out)",
      },
      transitionDuration: {
        instant: "var(--duration-instant)",
        short: "var(--duration-short)",
        medium: "var(--duration-medium)",
        deliberate: "var(--duration-deliberate)",
      },
      keyframes: {
        dissolveOut: {
          "0%": { opacity: "1", filter: "blur(0)" },
          "100%": {
            opacity: "0",
            filter: "blur(6px)",
            transform: "translateY(4px)",
          },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.72" },
        },
      },
      animation: {
        dissolve: "dissolveOut 1.2s var(--ease-out) forwards",
        "pulse-soft": "pulseSoft 2.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
