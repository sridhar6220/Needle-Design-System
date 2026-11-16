import { useLayoutEffect, useState, type CSSProperties, type RefObject } from "react";

export type Side = "top" | "bottom" | "left" | "right";
export interface FloatingOptions {
  side?: Side; align?: "start" | "center" | "end"; offset?: number;
  /** Fixed px width, "anchor" to match the trigger, or "auto" to size to content. */
  width?: number | "anchor" | "auto"; maxHeight?: number;
}
/**
 * Positions a floating element (rendered in a portal) next to its anchor with `position: fixed`.
 * Flips to the other side when there's no room and clamps inside the viewport, so nothing gets clipped by scrolling panels or modals.
 */
export function useFloating(anchor: RefObject<HTMLElement | null>, floating: RefObject<HTMLElement | null>, open: boolean, opts: FloatingOptions = {}): CSSProperties {
  const [style, setStyle] = useState<CSSProperties>({ position: "fixed", top: 0, left: 0, visibility: "hidden" });
  const { side = "bottom", align = "start", offset = 6, width = "auto", maxHeight } = opts;
  useLayoutEffect(() => {
    if (!open) { setStyle({ position: "fixed", top: 0, left: 0, visibility: "hidden" }); return; }
    const place = () => {
      const a = anchor.current?.getBoundingClientRect(); const f = floating.current; if (!a || !f) return;
      const vw = window.innerWidth, vh = window.innerHeight, m = 8;
      const w = width === "anchor" ? Math.max(a.width, Math.min(f.offsetWidth, 360)) : typeof width === "number" ? width : f.offsetWidth;
      const natural = f.scrollHeight; const h = Math.min(natural, maxHeight ?? natural);
      let s: Side = side;
      if (s === "bottom" && a.bottom + offset + h > vh - m && a.top - offset - h > a.bottom) s = "top";
      else if (s === "top" && a.top - offset - h < m && vh - a.bottom > a.top) s = "bottom";
      else if (s === "right" && a.right + offset + w > vw - m) s = "left";
      else if (s === "left" && a.left - offset - w < m) s = "right";
      let top: number, left: number;
      const across = (start: number, end: number, size: number) => (align === "start" ? start : align === "end" ? end - size : start + (end - start) / 2 - size / 2);
      if (s === "bottom" || s === "top") { top = s === "bottom" ? a.bottom + offset : a.top - offset - h; left = across(a.left, a.right, w); }
      else { left = s === "right" ? a.right + offset : a.left - offset - w; top = across(a.top, a.bottom, h); }
      left = Math.max(m, Math.min(left, vw - w - m));
      const room = s === "bottom" ? vh - top - m : s === "top" ? a.top - offset - m : vh - 2 * m;
      top = Math.max(m, Math.min(top, vh - Math.min(h, room) - m));
      setStyle({
        position: "fixed", top, left, width: width === "auto" ? undefined : w, minWidth: width === "anchor" ? a.width : undefined, maxHeight: Math.min(maxHeight ?? Infinity, room),
        ["--nd-origin" as string]: s === "bottom" ? "top" : s === "top" ? "bottom" : s === "right" ? "left" : "right",
        ["--nd-anchor-y" as string]: `${a.top + a.height / 2 - top}px`,
      });
    };
    place();
    const ro = new ResizeObserver(place); if (floating.current) ro.observe(floating.current);
    window.addEventListener("resize", place); window.addEventListener("scroll", place, true);
    return () => { ro.disconnect(); window.removeEventListener("resize", place); window.removeEventListener("scroll", place, true); };
  }, [open, side, align, offset, width, maxHeight, anchor, floating]);
  return style;
}
