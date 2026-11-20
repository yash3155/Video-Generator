/* Shared UI primitives: KaTeX math, rich text, cards, icons, reveal styles. */
import React, { createContext, useContext } from "react";
import katex from "katex";
import type { RichText } from "../templates/schemas";
import type { Accent, Theme } from "../../theme/tokens";
import { DARK_CLASSROOM } from "../../theme/tokens";
import { text } from "../mappers/guard";
import { useOverflowProbe } from "../diagnostics";
import type { Reveal } from "../reveal";
import { revealAll } from "../reveal";

export interface RenderContext {
  theme: Theme;
  reveal: Reveal;
  lang: string;
  names: { novice: string; mentor: string };
  /** Probe id prefix, unique per panel inside a composite layout. */
  scope: string;
  /** "full" main panel, or "half" inside a composite layout. */
  size: "full" | "half";
}

export const Ctx = createContext<RenderContext>({ theme: DARK_CLASSROOM, reveal: revealAll(), lang: "en", names: { novice: "Learner", mentor: "Mentor" }, scope: "main", size: "full" });
export const useRc = () => useContext(Ctx);

const katexCache = new Map<string, string>();

export function katexHtml(latex: string, display: boolean): string {
  const key = `${display ? "D" : "I"}:${latex}`;
  let html = katexCache.get(key);
  if (html === undefined) {
    html = katex.renderToString(latex, { throwOnError: true, strict: "error", displayMode: display, output: "html" });
    katexCache.set(key, html);
  }
  return html;
}

/** Typeset LaTeX. LaTeX source is never printed as text. */
export const MathTex: React.FC<{ latex: string; display?: boolean; size?: number; color?: string; style?: React.CSSProperties }> = ({ latex, display = false, size, color, style }) => (
  <span className="ol-math" style={{ fontSize: size, color, lineHeight: 1.2, ...style }} dangerouslySetInnerHTML={{ __html: katexHtml(latex, display) }} />
);

/** Rich text: string, or text + inline math segments. */
export const Rich: React.FC<{ value: RichText; path: string }> = ({ value, path }) => {
  if (typeof value === "string") return <>{text(value, path)}</>;
  return (
    <>
      {value.map((s, i) => (s.type === "text" ? <React.Fragment key={i}>{text(s.text, `${path}[${i}]`)}</React.Fragment> : <MathTex key={i} latex={s.latex} />))}
    </>
  );
};

/** A box whose content must fit; it is registered with the overflow diagnostics. */
export const Fit: React.FC<{ id: string; style?: React.CSSProperties; children?: React.ReactNode; className?: string }> = ({ id, style, children, className }) => {
  const { scope } = useRc();
  const ref = useOverflowProbe<HTMLDivElement>(`${scope}:${id}`);
  return (
    <div ref={ref} className={className} style={{ overflow: "hidden", minWidth: 0, minHeight: 0, ...style }}>
      {children}
    </div>
  );
};

/**
 * Entrance style for a revealable element: hidden elements keep their space so layout never jumps. A fully hidden
 * element is not shifted, because a transform outside its box would count as text overflow (R-04).
 */
export function revealStyle(reveal: Reveal, id: string, dy = 18): React.CSSProperties {
  const a = reveal.amount(id);
  return a <= 0 ? { opacity: 0 } : { opacity: a, transform: `translateY(${(1 - a) * dy}px)` };
}

export function accentOf(theme: Theme, a: Accent): string {
  return theme.colors[a];
}

export type IconName = "check" | "cross" | "warn" | "arrow" | "question" | "bulb" | "dot" | "flag" | "clock";

export const Icon: React.FC<{ name: IconName; color: string; size?: number; style?: React.CSSProperties }> = ({ name, color, size = 28, style }) => {
  const sw = 2.6;
  const common = { fill: "none", stroke: color, strokeWidth: sw, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  let body: React.ReactNode;
  switch (name) {
    case "check":
      body = <path d="M5 12.5l4.5 4.5L19 7.5" {...common} />;
      break;
    case "cross":
      body = <path d="M6 6l12 12M18 6L6 18" {...common} />;
      break;
    case "warn":
      body = (
        <>
          <path d="M12 3.5L21.5 20h-19z" {...common} />
          <path d="M12 10v4.5M12 17.4v.1" {...common} />
        </>
      );
      break;
    case "arrow":
      body = <path d="M4 12h15M13 6l6 6-6 6" {...common} />;
      break;
    case "question":
      body = (
        <>
          <circle cx="12" cy="12" r="9.5" {...common} />
          <path d="M9.2 9.3a2.9 2.9 0 1 1 3.9 2.7c-.7.3-1.1.9-1.1 1.6v.6M12 17.2v.1" {...common} />
        </>
      );
      break;
    case "bulb":
      body = <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z" {...common} />;
      break;
    case "flag":
      body = <path d="M5 21V4M5 4h11l-2 4 2 4H5" {...common} />;
      break;
    case "clock":
      body = (
        <>
          <circle cx="12" cy="12" r="9" {...common} />
          <path d="M12 7v5l3 2" {...common} />
        </>
      );
      break;
    default:
      body = <circle cx="12" cy="12" r="5" fill={color} />;
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flex: "none", ...style }} aria-hidden>
      {body}
    </svg>
  );
};

export const Badge: React.FC<{ children: React.ReactNode; color: string; filled?: boolean; size?: number }> = ({ children, color, filled = true, size = 40 }) => {
  const { theme } = useRc();
  return (
    <div
      style={{
        flex: "none",
        width: size,
        height: size,
        borderRadius: size / 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: filled ? color : "transparent",
        border: `2px solid ${color}`,
        color: filled ? theme.colors.textOnAccent : color,
        fontWeight: 700,
        fontSize: Math.max(18, Math.round(size * 0.48)),
      }}
    >
      {children}
    </div>
  );
};

/** Card with an accent edge; glows when focused. */
export const Card: React.FC<{ id: string; accent: string; style?: React.CSSProperties; children: React.ReactNode; dim?: boolean }> = ({ id, accent, style, children, dim }) => {
  const { theme, reveal } = useRc();
  const focused = reveal.focused(id);
  return (
    <Fit
      id={id}
      style={{
        background: theme.colors.panelRaised,
        border: `2px solid ${focused ? accent : theme.colors.border}`,
        borderLeft: `8px solid ${accent}`,
        borderRadius: theme.radius.card,
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        boxShadow: focused ? `0 0 0 4px ${accent}33, 0 10px 30px rgba(0,0,0,0.35)` : "0 6px 18px rgba(0,0,0,0.25)",
        ...revealStyle(reveal, id),
        ...(dim && reveal.amount(id) > 0 ? { opacity: 0.55 } : {}),
        ...style,
      }}
    >
      {children}
    </Fit>
  );
};

export const Heading: React.FC<{ children: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties }> = ({ children, color, size, style }) => {
  const { theme, size: panel } = useRc();
  return <div style={{ fontSize: size ?? (panel === "half" ? 26 : theme.size.heading), fontWeight: 700, color: color ?? theme.colors.gold, lineHeight: 1.2, ...style }}>{children}</div>;
};

export const Body: React.FC<{ children: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties }> = ({ children, color, size, style }) => {
  const { theme } = useRc();
  return <div style={{ fontSize: size ?? theme.size.body, color: color ?? theme.colors.text, lineHeight: 1.35, ...style }}>{children}</div>;
};

export const Label: React.FC<{ children: React.ReactNode; color?: string; style?: React.CSSProperties }> = ({ children, color, style }) => {
  const { theme } = useRc();
  return <div style={{ fontSize: theme.size.label, fontWeight: 600, letterSpacing: 1.6, textTransform: "uppercase", color: color ?? theme.colors.textMuted, ...style }}>{children}</div>;
};

/** Number formatting for on-screen values (en-US grouping; Indian grouping for hi). */
export function formatNumber(v: number, decimals: number, lang: string): string {
  return v.toLocaleString(lang.startsWith("hi") ? "en-IN" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
