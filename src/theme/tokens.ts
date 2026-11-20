/* Design tokens: themes are data (docs/BOOTSTRAP_PROMPT.md E.2). Every component reads colours and sizes from here. */

export type Accent = "gold" | "teal" | "green" | "coral" | "blue" | "purple";

export interface Theme {
  id: string;
  name: string;
  colors: {
    background: string;
    vignette: string;
    panel: string;
    panelRaised: string;
    border: string;
    text: string;
    textMuted: string;
    textOnAccent: string;
    captionBackground: string;
  } & Record<Accent, string>;
  fonts: { body: string; mono: string; devanagari: string };
  /** Minimum sizes from E.4: hero equation 44 px, card body 24 px, labels 18 px. */
  size: { hero: number; title: number; heading: number; body: number; label: number; caption: number; header: number };
  radius: { panel: number; card: number; pill: number };
  space: { page: number; gap: number; pad: number };
  layout: { width: number; height: number; headerHeight: number; titleHeight: number; footerHeight: number; captionHeight: number };
}

const fonts = {
  body: "Inter, 'Noto Sans Devanagari', sans-serif",
  mono: "'JetBrains Mono', monospace",
  devanagari: "'Noto Sans Devanagari', Inter, sans-serif",
};

const size = { hero: 56, title: 46, heading: 32, body: 26, label: 20, caption: 30, header: 20 };
const radius = { panel: 18, card: 14, pill: 999 };
const space = { page: 56, gap: 24, pad: 28 };
const layout = { width: 1920, height: 1080, headerHeight: 76, titleHeight: 88, footerHeight: 132, captionHeight: 96 };

export const DARK_CLASSROOM: Theme = {
  id: "dark-classroom",
  name: "Dark Technical Classroom",
  colors: {
    background: "#171717",
    vignette: "rgba(0,0,0,0.55)",
    panel: "#252525",
    panelRaised: "#2E2E2E",
    border: "#454545",
    text: "#F2F2F2",
    textMuted: "#B8B8B8",
    textOnAccent: "#171717",
    captionBackground: "rgba(23,23,23,0.88)",
    gold: "#E5C45B",
    teal: "#59BFC3",
    green: "#8ACB91",
    coral: "#D98278",
    blue: "#79A9D8",
    purple: "#B49AD9",
  },
  fonts,
  size,
  radius,
  space,
  layout,
};

export const LIGHT_CLASSROOM: Theme = {
  id: "light-classroom",
  name: "Light Classroom",
  colors: {
    background: "#F6F4EE",
    vignette: "rgba(120,110,90,0.18)",
    panel: "#FFFFFF",
    panelRaised: "#F0EEE8",
    border: "#CFCAC0",
    text: "#1E1E1E",
    textMuted: "#55524C",
    textOnAccent: "#FFFFFF",
    captionBackground: "rgba(255,255,255,0.92)",
    gold: "#8A6A00",
    teal: "#0F6F73",
    green: "#2F6E37",
    coral: "#A4382B",
    blue: "#2B5C93",
    purple: "#5E3F94",
  },
  fonts,
  size,
  radius,
  space,
  layout,
};

export const THEMES: Record<string, Theme> = {
  [DARK_CLASSROOM.id]: DARK_CLASSROOM,
  [LIGHT_CLASSROOM.id]: LIGHT_CLASSROOM,
  light: LIGHT_CLASSROOM,
  dark: DARK_CLASSROOM,
};

export function getTheme(id: string | undefined): Theme {
  return (id && THEMES[id]) || DARK_CLASSROOM;
}

/** WCAG relative luminance contrast ratio between two #RRGGBB colours. */
export function contrastRatio(a: string, b: string): number {
  const lum = (hex: string) => {
    const n = parseInt(hex.replace("#", ""), 16);
    const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
