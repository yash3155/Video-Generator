/* In-browser visual audit of a rendered frame: text that collides, leaves the canvas, is too small or has too little contrast; plus an outline of every probe box for review without image viewing. */

export interface LayoutIssue {
  kind: "collision" | "offcanvas" | "tiny" | "contrast";
  /** Text snippet and nearest probe id of the element(s) involved. */
  a: string;
  b?: string;
  detail: string;
}

export interface ProbeBox {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  /** Bounding box of the visible content inside the probe (text, math, svg), relative to the probe. */
  content?: { x: number; y: number; w: number; h: number };
}

const CANVAS = { w: 1920, h: 1080 };
export const MIN_FONT_PX = 16;

interface TextRun {
  el: Element;
  rects: DOMRect[];
  name: string;
}

type Rgba = [number, number, number, number];

function parseRgb(c: string): Rgba | null {
  const m = c.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const p = m[1]
    .split(/[\s,/]+/)
    .filter(Boolean)
    .map(Number);
  return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1];
}

function luminance([r, g, b]: Rgba): number {
  const f = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function effectiveOpacity(el: Element): number {
  let o = 1;
  for (let e: Element | null = el; e; e = e.parentElement) {
    const s = getComputedStyle(e);
    if (s.visibility === "hidden" || s.display === "none") return 0;
    o *= Number(s.opacity);
  }
  return o;
}

function backgroundOf(el: Element): Rgba | null {
  for (let e: Element | null = el; e; e = e.parentElement) {
    const bg = parseRgb(getComputedStyle(e).backgroundColor);
    if (bg && bg[3] >= 0.5) return bg;
  }
  return null;
}

function probeName(el: Element): string {
  const p = el.closest("[data-ol-probe]") as HTMLElement | null;
  return p?.dataset.olProbe ?? "frame";
}

function visibleRects(list: DOMRectList): DOMRect[] {
  return Array.from(list).filter((r) => r.width > 0.5 && r.height > 0.5);
}

function textRuns(root: Element): TextRun[] {
  const runs: TextRun[] = [];
  const walk = (el: Element) => {
    if (el.classList.contains("katex")) {
      const rects = visibleRects(el.getClientRects());
      if (rects.length) runs.push({ el, rects, name: `math@${probeName(el)}` });
      return;
    }
    const tag = el.tagName.toLowerCase();
    if (tag === "text") {
      const r = el.getBoundingClientRect();
      const t = el.textContent?.trim();
      if (r.width > 0.5 && t) runs.push({ el, rects: [r], name: `"${t.slice(0, 24)}"@${probeName(el)}` });
      return;
    }
    const rects: DOMRect[] = [];
    let txt = "";
    for (const n of Array.from(el.childNodes)) {
      if (n.nodeType === Node.TEXT_NODE && n.textContent && n.textContent.trim()) {
        const range = document.createRange();
        range.selectNodeContents(n);
        rects.push(...visibleRects(range.getClientRects()));
        txt += n.textContent;
      } else if (n.nodeType === Node.ELEMENT_NODE) walk(n as Element);
    }
    if (rects.length) runs.push({ el, rects, name: `"${txt.trim().slice(0, 24)}"@${probeName(el)}` });
  };
  walk(root);
  return runs;
}

function overlapArea(a: DOMRect, b: DOMRect): number {
  const w = Math.min(a.right, b.right) - Math.max(a.left, b.left);
  const h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
  return w > 0 && h > 0 ? w * h : 0;
}

export function auditLayout(root: Element = document.body): LayoutIssue[] {
  const issues: LayoutIssue[] = [];
  const runs = textRuns(root).filter((r) => effectiveOpacity(r.el) > 0.05);
  for (const r of runs) {
    const off = r.rects.find((rect) => rect.left < -1 || rect.top < -1 || rect.right > CANVAS.w + 1 || rect.bottom > CANVAS.h + 1);
    if (off) issues.push({ kind: "offcanvas", a: r.name, detail: `rect ${Math.round(off.left)},${Math.round(off.top)} ${Math.round(off.width)}x${Math.round(off.height)}` });
    if (r.el.classList.contains("katex")) continue;
    const style = getComputedStyle(r.el);
    const size = parseFloat(style.fontSize);
    if (size < MIN_FONT_PX) issues.push({ kind: "tiny", a: r.name, detail: `font-size ${size}px < ${MIN_FONT_PX}px` });
    if (effectiveOpacity(r.el) <= 0.9) continue;
    const fg = parseRgb(r.el instanceof SVGElement ? style.fill : style.color);
    const bg = backgroundOf(r.el);
    if (fg && bg && fg[3] > 0.5) {
      const l1 = luminance(fg);
      const l2 = luminance(bg);
      const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      const bold = Number(style.fontWeight) >= 600;
      const need = size >= 24 || (bold && size >= 18.5) ? 3 : 4.5;
      if (ratio < need) issues.push({ kind: "contrast", a: r.name, detail: `contrast ${ratio.toFixed(2)} < ${need}` });
    }
  }
  for (let i = 0; i < runs.length; i++) {
    for (let j = i + 1; j < runs.length; j++) {
      const a = runs[i];
      const b = runs[j];
      if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
      let worst = 0;
      for (const ra of a.rects)
        for (const rb of b.rects) {
          const area = overlapArea(ra, rb);
          const smaller = Math.min(ra.width * ra.height, rb.width * rb.height);
          if (area > 24 && smaller > 0) worst = Math.max(worst, area / smaller);
        }
      if (worst > 0.08) issues.push({ kind: "collision", a: a.name, b: b.name, detail: `${Math.round(worst * 100)}% of the smaller box overlaps` });
    }
  }
  return issues;
}

export function probeBoxes(probes: Map<string, HTMLElement>): ProbeBox[] {
  const out: ProbeBox[] = [];
  for (const [id, el] of probes) {
    if (!el.isConnected) continue;
    const r = el.getBoundingClientRect();
    const box: ProbeBox = { id, x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) };
    const rects: DOMRect[] = textRuns(el).flatMap((t) => t.rects);
    for (const g of Array.from(el.querySelectorAll("svg"))) rects.push(g.getBoundingClientRect());
    if (rects.length) {
      const x0 = Math.min(...rects.map((t) => t.left));
      const y0 = Math.min(...rects.map((t) => t.top));
      const x1 = Math.max(...rects.map((t) => t.right));
      const y1 = Math.max(...rects.map((t) => t.bottom));
      box.content = { x: Math.round(x0 - r.left), y: Math.round(y0 - r.top), w: Math.round(x1 - x0), h: Math.round(y1 - y0) };
    }
    out.push(box);
  }
  return out.sort((a, b) => a.id.localeCompare(b.id));
}
