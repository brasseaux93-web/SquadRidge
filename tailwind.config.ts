import type { Config } from "tailwindcss";

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
        surface: "var(--surface)",
        raised: "var(--surface-raised)",
        deep: "var(--canvas)",
        elevated: "var(--surface-raised)",
        accent: {
          DEFAULT: "var(--signal-active)",
          hover: "var(--accent-hover)",
          muted: "var(--signal-active-muted)",
        },
        ink: {
          DEFAULT: "var(--ink)",
          secondary: "var(--ink-secondary)",
          muted: "var(--ink-secondary)",
          quiet: "var(--ink-quiet)",
          inverse: "var(--ink-inverse)",
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
        danger: "var(--signal-critical)",
        warning: "var(--signal-attention)",
        success: "var(--signal-progress)",
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
    },
  },
  plugins: [],
};

export default config;
