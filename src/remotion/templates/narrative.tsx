/* Narrative and concept templates: chat_story, tug_of_war, progressive_cards, split_comparison, causal_chain, diagram_flow, concept_clarification, roadmap. */
import React from "react";
import type {
  ChatStoryData,
  TugOfWarData,
  ProgressiveCardsData,
  SplitComparisonData,
  CausalChainData,
  DiagramFlowData,
  ConceptClarificationData,
  RoadmapData,
} from "./schemas";
import { Badge, Body, Card, Fit, Heading, Icon, Label, Rich, revealStyle, useRc, type IconName } from "../components/ui";
import { text } from "../mappers/guard";
import { ui } from "../i18n";

const col = (gap: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ display: "flex", flexDirection: "column", gap, minHeight: 0, minWidth: 0, ...extra });
const row = (gap: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ display: "flex", flexDirection: "row", gap, minHeight: 0, minWidth: 0, ...extra });

export const ChatStory: React.FC<{ data: ChatStoryData }> = ({ data }) => {
  const { theme, reveal, names, lang, size } = useRc();
  const L = ui(lang);
  return (
    <div style={row(theme.space.gap, { height: "100%" })}>
      <Fit id="chat" style={col(18, { flex: 1, justifyContent: "center", padding: "4px 8px" })}>
        {data.messages.map((m, i) => {
          const novice = m.speaker === "novice";
          const color = novice ? theme.colors.blue : theme.colors.teal;
          const name = novice ? names.novice : names.mentor;
          return (
            <div key={m.id} style={{ display: "flex", justifyContent: novice ? "flex-start" : "flex-end", ...revealStyle(reveal, m.id) }}>
              <div style={row(16, { flexDirection: novice ? "row" : "row-reverse", alignItems: "flex-start", maxWidth: size === "half" ? "96%" : "84%" })}>
                <Badge color={color} size={52}>
                  <Icon name={novice ? "question" : "bulb"} color={theme.colors.textOnAccent} size={30} />
                </Badge>
                <Fit
                  id={`msg-${m.id}`}
                  style={{
                    background: theme.colors.panelRaised,
                    border: `2px solid ${reveal.focused(m.id) ? theme.colors.gold : color}`,
                    borderRadius: 22,
                    borderTopLeftRadius: novice ? 4 : 22,
                    borderTopRightRadius: novice ? 22 : 4,
                    padding: "14px 22px",
                  }}
                >
                  <Label color={color} style={{ marginBottom: 6 }}>
                    {text(name, `names.${m.speaker}`)}
                  </Label>
                  <Body>
                    <Rich value={m.text} path={`data.messages[${i}].text`} />
                  </Body>
                </Fit>
              </div>
            </div>
          );
        })}
      </Fit>
      {data.whereWeAre ? (
        <Fit id="where" style={col(14, { width: size === "half" ? 300 : 430, flex: "none", background: theme.colors.panelRaised, borderRadius: theme.radius.card, border: `2px solid ${theme.colors.border}`, padding: "22px 24px" })}>
          <Label color={theme.colors.gold}>{data.whereWeAre.label === "WHERE WE ARE" ? L.whereWeAre : text(data.whereWeAre.label, "data.whereWeAre.label")}</Label>
          {data.whereWeAre.items.map((it, i) => {
            const cur = i === data.whereWeAre!.current;
            const done = i < data.whereWeAre!.current;
            const color = cur ? theme.colors.gold : done ? theme.colors.teal : theme.colors.textMuted;
            return (
              <div key={i} style={row(14, { alignItems: "center" })}>
                <Badge color={color} filled={cur} size={34}>
                  {done ? <Icon name="check" color={theme.colors.textOnAccent} size={20} /> : <span style={{ fontSize: 16 }}>{i + 1}</span>}
                </Badge>
                <Body size={24} color={cur ? theme.colors.text : theme.colors.textMuted} style={{ fontWeight: cur ? 700 : 400 }}>
                  {text(it, `data.whereWeAre.items[${i}]`)}
                </Body>
              </div>
            );
          })}
        </Fit>
      ) : null}
    </div>
  );
};

export const TugOfWar: React.FC<{ data: TugOfWarData }> = ({ data }) => {
  const { theme, reveal, lang } = useRc();
  const side = (s: TugOfWarData["left"], color: string, which: string) => (
    <Card id={s.id} accent={color} style={{ flex: 1 }}>
      <Heading color={color}>{text(s.label, `data.${which}.label`)}</Heading>
      <div style={col(10)}>
        {s.points.map((p, i) => (
          <div key={i} style={row(12, { alignItems: "flex-start" })}>
            <Icon name="dot" color={color} size={22} style={{ marginTop: 6 }} />
            <Body>{text(p, `data.${which}.points[${i}]`)}</Body>
          </div>
        ))}
      </div>
    </Card>
  );
  return (
    <div style={col(theme.space.gap, { height: "100%" })}>
      <div style={row(18, { flex: 1, alignItems: "stretch" })}>
        {side(data.left, theme.colors.blue, "left")}
        <div style={col(10, { width: 150, flex: "none", alignItems: "center", justifyContent: "center" })}>
          <svg width={150} height={60} viewBox="0 0 150 60" aria-hidden>
            <path d="M8 30h134" stroke={theme.colors.border} strokeWidth={6} strokeLinecap="round" />
            <path d="M8 30l14-12M8 30l14 12M142 30l-14-12M142 30l-14 12" stroke={theme.colors.gold} strokeWidth={5} strokeLinecap="round" fill="none" />
            <circle cx={75} cy={30} r={10} fill={theme.colors.gold} />
          </svg>
          <Label color={theme.colors.gold}>{ui(lang).vs}</Label>
        </div>
        {side(data.right, theme.colors.purple, "right")}
      </div>
      <Card id={data.resolution.id} accent={theme.colors.gold} style={{ flex: "none", ...revealStyle(reveal, data.resolution.id) }}>
        <div style={row(16, { alignItems: "center" })}>
          <Icon name="bulb" color={theme.colors.gold} size={36} />
          <div style={col(4, { flex: 1 })}>
            <Label color={theme.colors.gold}>{text(data.resolution.label, "data.resolution.label")}</Label>
            <Body>
              <Rich value={data.resolution.text} path="data.resolution.text" />
            </Body>
          </div>
        </div>
      </Card>
    </div>
  );
};

const ACCENTS = ["gold", "teal", "blue", "purple", "green", "coral"] as const;

export const ProgressiveCards: React.FC<{ data: ProgressiveCardsData }> = ({ data }) => {
  const { theme, size } = useRc();
  const n = data.cards.length;
  const cols = size === "half" ? (n <= 2 ? 1 : 2) : n <= 4 ? n : 3;
  const singleRow = size === "full" && n <= 4;
  const bodySize = singleRow ? (n <= 3 ? 31 : 28) : undefined;
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gridAutoRows: "minmax(0, 1fr)", gap: theme.space.gap, height: "100%" }}>
      {data.cards.map((c, i) => {
        const color = theme.colors[ACCENTS[i % ACCENTS.length]];
        return (
          <Card key={c.id} id={c.id} accent={color} style={singleRow ? { justifyContent: "center", gap: 22, padding: "28px 32px" } : undefined}>
            <div style={singleRow ? col(16) : row(14, { alignItems: "center" })}>
              <Badge color={color} size={singleRow ? 64 : 44}>
                {i + 1}
              </Badge>
              <Heading color={color} size={singleRow ? 38 : 30}>
                {text(c.title, `data.cards[${i}].title`)}
              </Heading>
            </div>
            <Fit id={`${c.id}-body`} style={singleRow ? { flex: "none", maxHeight: "70%" } : { flex: 1 }}>
              <Body size={bodySize}>
                <Rich value={c.body} path={`data.cards[${i}].body`} />
              </Body>
            </Fit>
          </Card>
        );
      })}
    </div>
  );
};

const TONE: Record<"trap" | "neutral" | "positive", { accent: "coral" | "blue" | "green"; icon: IconName }> = {
  trap: { accent: "coral", icon: "warn" },
  neutral: { accent: "blue", icon: "arrow" },
  positive: { accent: "green", icon: "check" },
};

export const SplitComparison: React.FC<{ data: SplitComparisonData }> = ({ data }) => {
  const { theme } = useRc();
  const side = (s: SplitComparisonData["left"], which: string) => {
    const tone = TONE[s.tone];
    const color = theme.colors[tone.accent];
    return (
      <Card id={s.id} accent={color} style={{ flex: 1 }}>
        <div style={row(14, { alignItems: "center" })}>
          <Icon name={tone.icon} color={color} size={40} />
          <Heading color={color}>{text(s.heading, `data.${which}.heading`)}</Heading>
        </div>
        <div style={col(14)}>
          {s.points.map((p, i) => (
            <div key={i} style={row(12, { alignItems: "flex-start" })}>
              <Icon name={s.tone === "trap" ? "cross" : s.tone === "positive" ? "check" : "dot"} color={color} size={26} style={{ marginTop: 4 }} />
              <Body>
                <Rich value={p} path={`data.${which}.points[${i}]`} />
              </Body>
            </div>
          ))}
        </div>
      </Card>
    );
  };
  return (
    <div style={col(theme.space.gap, { height: "100%" })}>
      <div style={row(theme.space.gap, { flex: 1 })}>
        {side(data.left, "left")}
        {side(data.right, "right")}
      </div>
      {data.verdict ? (
        <Card id={data.verdict.id} accent={theme.colors.gold} style={{ flex: "none" }}>
          <div style={row(16, { alignItems: "center" })}>
            <Icon name="bulb" color={theme.colors.gold} size={36} />
            <Body style={{ fontWeight: 600 }}>
              <Rich value={data.verdict.text} path="data.verdict.text" />
            </Body>
          </div>
        </Card>
      ) : null}
    </div>
  );
};

const ROLE_ACCENT = { condition: "blue", action: "teal", mechanism: "purple", result: "gold", consequence: "green" } as const;

export const CausalChain: React.FC<{ data: CausalChainData }> = ({ data }) => {
  const { theme, reveal, lang, size } = useRc();
  const L = ui(lang);
  const vertical = size === "half";
  const big = !vertical && data.links.length <= 4;
  return (
    <div style={{ display: "flex", flexDirection: vertical ? "column" : "row", alignItems: vertical ? "stretch" : "center", gap: 0, height: "100%" }}>
      {data.links.map((l, i) => {
        const color = theme.colors[ROLE_ACCENT[l.role]];
        return (
          <React.Fragment key={l.id}>
            {i > 0 ? (
              <div style={{ flex: "none", display: "flex", alignItems: "center", justifyContent: "center", width: vertical ? "auto" : 56, height: vertical ? 34 : "auto", opacity: reveal.amount(l.id) }}>
                <Icon name="arrow" color={theme.colors.gold} size={40} style={vertical ? { transform: "rotate(90deg)" } : undefined} />
              </div>
            ) : null}
            <Card
              id={l.id}
              accent={color}
              style={vertical ? { flex: 1, flexDirection: "row", alignItems: "center", gap: 14, padding: "8px 18px" } : { flex: 1, height: "82%", justifyContent: "center", gap: 16 }}
            >
              <div style={vertical ? row(8, { alignItems: "center", width: 210, flex: "none" }) : row(10, { alignItems: "center" })}>
                <Badge color={color} size={vertical ? 30 : 36}>
                  {i + 1}
                </Badge>
                <Label color={color}>{L.roles[l.role]}</Label>
              </div>
              <Body size={vertical ? 23 : big ? 32 : 28} style={vertical ? { lineHeight: 1.25 } : undefined}>
                <Rich value={l.text} path={`data.links[${i}].text`} />
              </Body>
            </Card>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export const DiagramFlow: React.FC<{ data: DiagramFlowData }> = ({ data }) => {
  const { theme, reveal } = useRc();
  const edgeLabel = (from: string, to: string) => data.edges.find((e) => e.from === from && e.to === to)?.label;
  if (data.mode === "timeline") {
    return (
      <div style={col(0, { height: "100%", justifyContent: "center", position: "relative" })}>
        <div style={{ position: "absolute", left: 40, right: 40, top: "50%", height: 6, background: theme.colors.border, borderRadius: 3 }} />
        <div style={row(0, { justifyContent: "space-between", alignItems: "stretch", height: "100%" })}>
          {data.nodes.map((n, i) => {
            const above = i % 2 === 0;
            const color = theme.colors[ACCENTS[i % ACCENTS.length]];
            return (
              <div key={n.id} style={col(0, { flex: 1, alignItems: "center", justifyContent: "center", ...revealStyle(reveal, n.id, 0) })}>
                <Fit id={n.id} style={col(6, { height: "42%", justifyContent: above ? "flex-end" : "flex-start", alignItems: "center", textAlign: "center", padding: "0 10px", order: above ? 0 : 2 })}>
                  <Heading color={color} size={28}>
                    {text(n.label, `data.nodes[${i}].label`)}
                  </Heading>
                  {n.sublabel ? <Body size={24} color={theme.colors.textMuted}>{text(n.sublabel, `data.nodes[${i}].sublabel`)}</Body> : null}
                </Fit>
                <div style={{ order: 1, width: 34, height: 34, borderRadius: 17, background: color, border: `5px solid ${theme.colors.background}`, margin: "12px 0" }} />
                <div style={{ height: "42%", order: above ? 2 : 0 }} />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return (
    <div style={row(0, { height: "100%", alignItems: "center" })}>
      {data.nodes.map((n, i) => {
        const color = theme.colors[ACCENTS[i % ACCENTS.length]];
        const label = i > 0 ? edgeLabel(data.nodes[i - 1].id, n.id) : undefined;
        return (
          <React.Fragment key={n.id}>
            {i > 0 ? (
              <div style={col(6, { width: 150, flex: "none", alignItems: "center", opacity: reveal.amount(n.id) })}>
                {label ? <Label color={theme.colors.gold} style={{ textAlign: "center", letterSpacing: 0.5, textTransform: "none", fontSize: 22 }}>{text(label, `data.edges.${n.id}.label`)}</Label> : null}
                <Icon name="arrow" color={theme.colors.gold} size={56} />
              </div>
            ) : null}
            <Card id={n.id} accent={color} style={{ flex: 1, height: "66%", justifyContent: "center", alignItems: "center", textAlign: "center", gap: 18 }}>
              <Badge color={color} size={56}>
                {i + 1}
              </Badge>
              <Heading color={color} size={36}>
                {text(n.label, `data.nodes[${i}].label`)}
              </Heading>
              {n.sublabel ? (
                <Body size={28} color={theme.colors.textMuted}>
                  {text(n.sublabel, `data.nodes[${i}].sublabel`)}
                </Body>
              ) : null}
            </Card>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export const ConceptClarification: React.FC<{ data: ConceptClarificationData }> = ({ data }) => {
  const { theme, lang } = useRc();
  const L = ui(lang);
  const rowItem = (label: string, value: React.ReactNode, color: string, icon: IconName) => (
    <div style={row(18, { alignItems: "flex-start" })}>
      <Icon name={icon} color={color} size={34} style={{ marginTop: 2 }} />
      <div style={col(4, { flex: 1 })}>
        <Label color={color}>{label}</Label>
        <Body>{value}</Body>
      </div>
    </div>
  );
  return (
    <Card id={data.id} accent={theme.colors.teal} style={{ height: "100%", padding: "28px 36px", gap: 20 }}>
      <div style={row(18, { alignItems: "baseline", flexWrap: "wrap" })}>
        <Heading size={theme.size.hero}>{text(data.term, "data.term")}</Heading>
        {data.fullForm ? <Body color={theme.colors.textMuted} size={30}>{text(data.fullForm, "data.fullForm")}</Body> : null}
      </div>
      {rowItem(L.simpleMeaning, text(data.simpleMeaning, "data.simpleMeaning"), theme.colors.teal, "bulb")}
      {rowItem(L.roleHere, text(data.roleHere, "data.roleHere"), theme.colors.blue, "flag")}
      {data.connectsTo ? rowItem(L.connectsTo, text(data.connectsTo, "data.connectsTo"), theme.colors.purple, "arrow") : null}
      {data.example ? rowItem(L.example, <Rich value={data.example} path="data.example" />, theme.colors.gold, "check") : null}
    </Card>
  );
};

export const Roadmap: React.FC<{ data: RoadmapData }> = ({ data }) => {
  const { theme, reveal, lang } = useRc();
  const L = ui(lang);
  return (
    <div style={col(theme.space.gap, { height: "100%" })}>
      <Heading>{text(data.title, "data.title")}</Heading>
      <div style={row(0, { flex: 1, alignItems: "center", position: "relative" })}>
        <div style={{ position: "absolute", left: 60, right: 60, top: "50%", marginTop: -90, height: 6, background: theme.colors.border }} />
        {data.items.map((it, i) => {
          const color = it.status === "current" ? theme.colors.gold : it.status === "done" ? theme.colors.teal : theme.colors.textMuted;
          return (
            <div key={it.id} style={col(14, { flex: 1, alignItems: "center", textAlign: "center", ...revealStyle(reveal, it.id) })}>
              <Badge color={color} filled={it.status !== "next"} size={it.status === "current" ? 92 : 76}>
                {it.status === "done" ? <Icon name="check" color={theme.colors.textOnAccent} size={42} /> : i + 1}
              </Badge>
              <Label color={color}>{L.status[it.status]}</Label>
              <Fit id={it.id} style={col(8, { height: 120, padding: "0 10px", alignItems: "center" })}>
                <Body size={32} style={{ fontWeight: it.status === "current" ? 700 : 600 }} color={it.status === "next" ? theme.colors.textMuted : theme.colors.text}>
                  {text(it.label, `data.items[${i}].label`)}
                </Body>
                {it.sublabel ? <Body size={26} color={theme.colors.textMuted}>{text(it.sublabel, `data.items[${i}].sublabel`)}</Body> : null}
              </Fit>
            </div>
          );
        })}
      </div>
    </div>
  );
};
