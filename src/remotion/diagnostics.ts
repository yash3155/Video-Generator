/* Per-frame diagnostics channel (E.5): components register text boxes; after layout we measure overflow and log one tagged line that the Node renderer collects into overflow.json. */
import React, { useCallback, useEffect, useState } from "react";
import { continueRender, delayRender, useCurrentFrame } from "remotion";
import { auditLayout, probeBoxes, type LayoutIssue, type ProbeBox } from "./layout-audit";

export type { LayoutIssue, ProbeBox };

export const DIAG_PREFIX = "OPENLECTERN_DIAG ";

export interface OverflowItem {
  id: string;
  axis: "x" | "y" | "xy";
  scrollWidth: number;
  clientWidth: number;
  scrollHeight: number;
  clientHeight: number;
}

export interface DiagnosticsMessage {
  kind: "overflow";
  label: string;
  frame: number;
  items: OverflowItem[];
  layout: LayoutIssue[];
  boxes: ProbeBox[];
}

const probes = new Map<string, HTMLElement>();
const TOLERANCE_PX = 2;

/** Callback ref that registers an element whose content must fit inside its box. */
export function useOverflowProbe<T extends HTMLElement>(id: string): (el: T | null) => void {
  return useCallback(
    (el: T | null) => {
      if (el) {
        el.dataset.olProbe = id;
        probes.set(id, el);
      } else probes.delete(id);
    },
    [id],
  );
}

export function measureOverflow(): OverflowItem[] {
  const out: OverflowItem[] = [];
  for (const [id, el] of probes) {
    if (!el.isConnected) continue;
    const x = el.scrollWidth > el.clientWidth + TOLERANCE_PX;
    const y = el.scrollHeight > el.clientHeight + TOLERANCE_PX;
    if (x || y) out.push({ id, axis: x && y ? "xy" : x ? "x" : "y", scrollWidth: el.scrollWidth, clientWidth: el.clientWidth, scrollHeight: el.scrollHeight, clientHeight: el.clientHeight });
  }
  return out.sort((a, b) => a.id.localeCompare(b.id));
}

const FONT_FACES = ["400 26px Inter", "600 26px Inter", "700 26px Inter", "400 26px 'JetBrains Mono'", "400 26px 'Noto Sans Devanagari'", "600 26px 'Noto Sans Devanagari'"];

/** Block rendering until the bundled fonts are loaded so text is measured and painted with the right metrics. */
export function useFontsReady(): boolean {
  const [handle] = useState(() => delayRender("openlectern fonts"));
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      setReady(true);
    };
    Promise.all(FONT_FACES.map((f) => document.fonts.load(f, "Aa \u0905")))
      .then(() => document.fonts.ready)
      .then(finish, finish);
  }, [handle]);
  // Released only after the ready commit, so child effects (the diagnostics reporter) register their own delayRender first.
  useEffect(() => {
    if (ready) continueRender(handle);
  }, [ready, handle]);
  return ready;
}

/** Measures registered probes once layout settles on this frame and logs the result (only when diagnostics are on). */
export const DiagnosticsReporter: React.FC<{ label: string; enabled: boolean }> = ({ label, enabled }) => {
  const frame = useCurrentFrame();
  useEffect(() => {
    if (!enabled) return;
    const handle = delayRender(`openlectern diagnostics ${frame}`);
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        const msg: DiagnosticsMessage = { kind: "overflow", label, frame, items: measureOverflow(), layout: auditLayout(), boxes: probeBoxes(probes) };
        console.log(DIAG_PREFIX + JSON.stringify(msg));
        continueRender(handle);
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      continueRender(handle);
    };
  }, [enabled, frame, label]);
  return null;
};
