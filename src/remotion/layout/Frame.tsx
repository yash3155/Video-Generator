/* Lesson frame layout (E.2): header with progress pills, scene title, main teaching panel, captions above the footer, POINTS TO REMEMBER footer. */
import React from "react";
import { AbsoluteFill } from "remotion";
import type { Theme } from "../../theme/tokens";
import type { ConceptPanel } from "../templates/schemas";
import { Fit, Icon, Label, useRc } from "../components/ui";
import { text } from "../mappers/guard";
import { ui } from "../i18n";

export interface HeaderInfo {
  course: string;
  chapter: string;
  part: string;
  progress: { index: number; total: number };
}

export interface CaptionWord {
  text: string;
  spoken: boolean;
}

export const MAIN_PANEL = { left: 56, top: 172, width: 1808, height: 668, pad: 28 };
/** Width reserved on the right of the main panel for the Concept Clarification companion, which never covers the main diagram. */
export const CONCEPT_COLUMN = 580;

function fontFor(theme: Theme, lang: string): string {
  return lang.startsWith("hi") ? theme.fonts.devanagari : theme.fonts.body;
}

const Header: React.FC<{ header: HeaderInfo }> = ({ header }) => {
  const { theme } = useRc();
  const { index, total } = header.progress;
  return (
    <div style={{ position: "absolute", left: 56, right: 56, top: 0, height: theme.layout.headerHeight, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
      <Fit id="header" style={{ fontSize: theme.size.header, fontWeight: 600, letterSpacing: 2.4, textTransform: "uppercase", color: theme.colors.textMuted, whiteSpace: "nowrap", flex: 1 }}>
        <span style={{ color: theme.colors.gold }}>{text(header.course, "header.course")}</span>
        {"  \u00b7  "}
        {text(header.chapter, "header.chapter")}
        {"  \u00b7  "}
        {text(header.part, "header.part")}
      </Fit>
      <div style={{ display: "flex", gap: 8, flex: "none" }}>
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            style={{
              width: 56,
              height: 12,
              borderRadius: 6,
              background: i < index ? theme.colors.teal : i === index ? theme.colors.gold : "transparent",
              border: `2px solid ${i <= index ? "transparent" : theme.colors.border}`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

const Footer: React.FC<{ takeaways: string[] }> = ({ takeaways }) => {
  const { theme, lang } = useRc();
  const h = theme.layout.footerHeight;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: h, background: theme.colors.panel, borderTop: `2px solid ${theme.colors.border}`, padding: "14px 56px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
      <Label color={theme.colors.gold}>{ui(lang).pointsToRemember}</Label>
      <div style={{ display: "flex", gap: 20, flex: 1, minHeight: 0 }}>
        {takeaways.slice(0, 3).map((t, i) => (
          <Fit key={i} id={`takeaway-${i}`} style={{ flex: 1, display: "flex", gap: 12, alignItems: "flex-start" }}>
            <Icon name="check" color={theme.colors.teal} size={26} style={{ marginTop: 2 }} />
            <div style={{ fontSize: 24, lineHeight: 1.3, color: theme.colors.text }}>{text(t, `takeaways[${i}]`)}</div>
          </Fit>
        ))}
      </div>
    </div>
  );
};

const Captions: React.FC<{ words: CaptionWord[] }> = ({ words }) => {
  const { theme } = useRc();
  if (!words.length) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: theme.layout.footerHeight + 10, height: theme.layout.captionHeight - 16, display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Fit id="caption" style={{ maxWidth: 1560, maxHeight: theme.layout.captionHeight - 16, padding: "8px 26px", borderRadius: 14, background: theme.colors.captionBackground, fontSize: theme.size.caption, lineHeight: 1.3, textAlign: "center", fontWeight: 500 }}>
        {words.map((w, i) => (
          <span key={i} style={{ color: w.spoken ? theme.colors.gold : theme.colors.text }}>
            {(i ? " " : "") + text(w.text, `caption[${i}]`)}
          </span>
        ))}
      </Fit>
    </div>
  );
};

const ConceptOverlay: React.FC<{ concept: ConceptPanel }> = ({ concept }) => {
  const { theme, lang } = useRc();
  const L = ui(lang);
  const item = (label: string, value: string, path: string, color: string) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Label color={color}>{label}</Label>
      <div style={{ fontSize: 24, lineHeight: 1.3 }}>{text(value, path)}</div>
    </div>
  );
  return (
    <Fit
      id="concept-overlay"
      style={{ position: "absolute", right: 24, top: 24, bottom: 24, width: 560, background: theme.colors.panel, border: `3px solid ${theme.colors.teal}`, borderRadius: theme.radius.panel, padding: 26, display: "flex", flexDirection: "column", gap: 16, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
    >
      <div style={{ fontSize: 40, fontWeight: 700, color: theme.colors.gold }}>{text(concept.term, "concept.term")}</div>
      {concept.fullForm ? <div style={{ fontSize: 24, color: theme.colors.textMuted }}>{text(concept.fullForm, "concept.fullForm")}</div> : null}
      {item(L.simpleMeaning, concept.simpleMeaning, "concept.simpleMeaning", theme.colors.teal)}
      {item(L.roleHere, concept.roleHere, "concept.roleHere", theme.colors.blue)}
      {concept.connectsTo ? item(L.connectsTo, concept.connectsTo, "concept.connectsTo", theme.colors.purple) : null}
    </Fit>
  );
};

export const LessonFrame: React.FC<{
  header: HeaderInfo;
  title: string;
  takeaways: string[];
  caption: CaptionWord[];
  watermark: boolean;
  concept?: ConceptPanel;
  children: React.ReactNode;
}> = ({ header, title, takeaways, caption, watermark, concept, children }) => {
  const { theme, lang } = useRc();
  const L = ui(lang);
  return (
    <AbsoluteFill style={{ background: theme.colors.background, color: theme.colors.text, fontFamily: fontFor(theme, lang) }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, transparent 55%, ${theme.colors.vignette} 100%)` }} />
      <Header header={header} />
      <div style={{ position: "absolute", left: 56, right: 56, top: theme.layout.headerHeight, height: theme.layout.titleHeight, display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ width: 8, height: 52, borderRadius: 4, background: theme.colors.gold, flex: "none" }} />
        <Fit id="title" style={{ fontSize: theme.size.title, fontWeight: 700, whiteSpace: "nowrap", flex: 1, lineHeight: 1.25 }}>
          {text(title, "title")}
        </Fit>
      </div>
      <div
        style={{
          position: "absolute",
          left: MAIN_PANEL.left,
          top: MAIN_PANEL.top,
          width: MAIN_PANEL.width,
          height: MAIN_PANEL.height,
          background: theme.colors.panel,
          border: `2px solid ${theme.colors.border}`,
          borderRadius: theme.radius.panel,
          padding: MAIN_PANEL.pad,
          boxSizing: "border-box",
        }}
      >
        <Fit id="main" style={{ width: concept ? `calc(100% - ${CONCEPT_COLUMN}px)` : "100%", height: "100%" }}>
          {children}
        </Fit>
        {watermark ? (
          <div style={{ position: "absolute", right: 24, bottom: 18, padding: "6px 16px", border: `2px solid ${theme.colors.coral}`, borderRadius: 8, color: theme.colors.coral, fontSize: 18, fontWeight: 700, letterSpacing: 2.4, background: theme.colors.panel }}>
            {L.illustrative}
          </div>
        ) : null}
        {concept ? <ConceptOverlay concept={concept} /> : null}
      </div>
      <Captions words={caption} />
      <Footer takeaways={takeaways} />
    </AbsoluteFill>
  );
};
