/* Assessment and closing templates: interactive_quiz, summary_thread. */
import React from "react";
import type { InteractiveQuizData, SummaryThreadData } from "./schemas";
import { Badge, Body, Card, Fit, Heading, Icon, Label, useRc } from "../components/ui";
import { text } from "../mappers/guard";
import { ui } from "../i18n";

const col = (gap: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ display: "flex", flexDirection: "column", gap, minHeight: 0, minWidth: 0, ...extra });
const row = (gap: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ display: "flex", flexDirection: "row", gap, minHeight: 0, minWidth: 0, ...extra });

const LETTERS = ["A", "B", "C", "D"];

export const InteractiveQuiz: React.FC<{ data: InteractiveQuizData }> = ({ data }) => {
  const { theme, reveal, lang } = useRc();
  const L = ui(lang);
  const phase = reveal.visual.phase ?? "question";
  const revealed = phase === "reveal";
  return (
    <div style={col(theme.space.gap, { height: "100%" })}>
      <div style={row(theme.space.gap, { alignItems: "center" })}>
        <Icon name="question" color={theme.colors.gold} size={52} />
        <Fit id="question" style={{ flex: 1 }}>
          <Heading size={36} color={theme.colors.text}>
            {text(data.question, "data.question")}
          </Heading>
        </Fit>
        {phase === "thinking" ? (
          <div style={col(4, { alignItems: "center", flex: "none" })}>
            <svg width={92} height={92} viewBox="0 0 92 92" aria-hidden>
              <circle cx={46} cy={46} r={38} fill="none" stroke={theme.colors.border} strokeWidth={8} />
              <circle cx={46} cy={46} r={38} fill="none" stroke={theme.colors.gold} strokeWidth={8} strokeDasharray={`${2 * Math.PI * 38}`} strokeDashoffset={`${2 * Math.PI * 38 * (1 - Math.min(1, reveal.frame / 96))}`} transform="rotate(-90 46 46)" strokeLinecap="round" />
            </svg>
            <Label color={theme.colors.gold}>{L.thinkTime}</Label>
          </div>
        ) : null}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gridAutoRows: "minmax(0, 1fr)", gap: 18, flex: 1, minHeight: 0 }}>
        {data.options.map((o, i) => {
          const correct = i === data.correctIndex;
          const color = revealed ? (correct ? theme.colors.green : theme.colors.textMuted) : theme.colors.blue;
          return (
            <Fit
              key={i}
              id={`option-${i}`}
              style={{
                ...row(18, { alignItems: "center" }),
                padding: "16px 24px",
                borderRadius: theme.radius.card,
                background: revealed && correct ? `${theme.colors.green}22` : theme.colors.panelRaised,
                border: `3px solid ${revealed && correct ? theme.colors.green : theme.colors.border}`,
                opacity: revealed && !correct ? 0.55 : 1,
              }}
            >
              <Badge color={color} size={52}>
                {LETTERS[i]}
              </Badge>
              <Body size={28} style={{ flex: 1 }}>
                {text(o, `data.options[${i}]`)}
              </Body>
              {revealed ? <Icon name={correct ? "check" : "cross"} color={correct ? theme.colors.green : theme.colors.textMuted} size={40} /> : null}
            </Fit>
          );
        })}
      </div>
      {revealed ? (
        <Card id="explanation" accent={theme.colors.green} style={{ flex: "none" }}>
          <div style={row(16, { alignItems: "center" })}>
            <Label color={theme.colors.green} style={{ flex: "none" }}>
              {`${L.answer}: ${LETTERS[data.correctIndex]}`}
            </Label>
            <Body>{text(data.explanation, "data.explanation")}</Body>
          </div>
        </Card>
      ) : null}
    </div>
  );
};

export const SummaryThread: React.FC<{ data: SummaryThreadData }> = ({ data }) => {
  const { theme, reveal } = useRc();
  const v = reveal.visual;
  const [a, b] = v.range ?? [1, 8];
  const compact = Boolean(v.compact);
  const accents = ["gold", "teal", "blue", "purple", "green", "coral", "gold", "teal"] as const;
  return (
    <div style={col(16, { height: "100%" })}>
      <Heading>{text(data.title, "data.title")}</Heading>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gridTemplateRows: "repeat(4, minmax(0, 1fr))", gridAutoFlow: "column", gap: 14, flex: 1, minHeight: 0 }}>
        {data.rules.map((r, i) => {
          const n = i + 1;
          const inRange = n >= a && n <= b && a > 0;
          const color = theme.colors[accents[i]];
          const active = inRange && !compact;
          return (
            <Card key={r.id} id={r.id} accent={color} dim={!inRange && !compact} style={{ padding: "12px 20px", gap: 6, ...(active ? { borderColor: color } : {}) }}>
              <div style={row(14, { alignItems: "center" })}>
                <Badge color={color} size={36}>
                  {n}
                </Badge>
                <Body size={compact ? 30 : 26} style={{ fontWeight: 700 }} color={color}>
                  {text(r.title, `data.rules[${i}].title`)}
                </Body>
              </div>
              {compact ? null : (
                <Body size={24} color={theme.colors.text}>
                  {text(r.text, `data.rules[${i}].text`)}
                </Body>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
