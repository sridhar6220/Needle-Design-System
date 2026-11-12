import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactElement, type ReactNode } from "react";
import { createPortal } from "react-dom";
import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";
import { Icon } from "../../icons/Icon";
import { useDismiss } from "./useDismiss";
import { cx } from "../../utils";
import "./Menu.css";

export type MenuEntry =
  | { type?: "item"; key: string; label: ReactNode; icon?: LucideIcon; danger?: boolean; disabled?: boolean; selected?: boolean; hint?: ReactNode; onSelect?: () => void }
  | { type: "divider"; key: string }
  | { type: "label"; key: string; label: ReactNode };
export interface MenuProps {
  trigger: (p: { open: boolean; toggle: () => void; props: Record<string, unknown> }) => ReactElement;
  items: MenuEntry[]; align?: "start" | "end"; width?: number | string; placement?: "bottom" | "top"; className?: string;
}
/** Dropdown menu (DS "Dropdown"). Arrow keys move, Enter selects, Escape closes. */
export function Menu({ trigger, items, align = "start", width = 220, placement = "bottom", className }: MenuProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const wrap = useRef<HTMLDivElement>(null); const pop = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<React.CSSProperties>({ visibility: "hidden" });
  const close = useCallback(() => { setOpen(false); setActive(-1); }, []);
  useDismiss([wrap, pop], open, close);
  /* Floats in a top layer so scrolling panels and modals never clip it; flips up when there's no room below. */
  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const t = wrap.current?.getBoundingClientRect(); const m = pop.current; if (!t || !m) return;
      const w = width === "100%" ? t.width : typeof width === "number" ? width : m.offsetWidth;
      const h = Math.min(m.scrollHeight, 320); const gap = 6;
      const below = window.innerHeight - t.bottom - gap - 8, above = t.top - gap - 8;
      const up = placement === "top" ? above > h || above > below : below < h && above > below;
      let left = align === "end" ? t.right - w : t.left; left = Math.max(8, Math.min(left, window.innerWidth - w - 8));
      setPos({ position: "fixed", left, width: w, maxHeight: Math.max(120, up ? above : below), ...(up ? { bottom: window.innerHeight - t.top + gap } : { top: t.bottom + gap }), transformOrigin: `${align === "end" ? "right" : "left"} ${up ? "bottom" : "top"}` });
    };
    place();
    window.addEventListener("resize", place); window.addEventListener("scroll", place, true);
    return () => { window.removeEventListener("resize", place); window.removeEventListener("scroll", place, true); };
  }, [open, width, align, placement, items.length]);
  const actionable = items.map((it, i) => ((it.type ?? "item") === "item" && !(it as { disabled?: boolean }).disabled ? i : -1)).filter((i) => i >= 0);
  useEffect(() => { if (open) setActive(actionable[0] ?? -1); }, [open]); // eslint-disable-line
  const onKey = (e: React.KeyboardEvent) => {
    if (!open) { if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(true); } return; }
    const pos = actionable.indexOf(active);
    if (e.key === "ArrowDown") { e.preventDefault(); setActive(actionable[(pos + 1) % actionable.length]); }
    if (e.key === "ArrowUp") { e.preventDefault(); setActive(actionable[(pos - 1 + actionable.length) % actionable.length]); }
    if (e.key === "Enter") { e.preventDefault(); const it = items[active]; if (it && (it.type ?? "item") === "item") { (it as { onSelect?: () => void }).onSelect?.(); close(); } }
    if (e.key === "Tab") close();
  };
  return (
    <div ref={wrap} className={cx("nd-menuwrap", className)} onKeyDown={onKey}>
      {trigger({ open, toggle: () => setOpen((o) => !o), props: { "aria-haspopup": "menu", "aria-expanded": open } })}
      {open && createPortal(
        <div ref={pop} role="menu" className="nd-menu nd-menu--float" style={pos}>
          {items.map((it, i) => {
            if (it.type === "divider") return <div key={it.key} className="nd-menu__div" role="separator" />;
            if (it.type === "label") return <div key={it.key} className="nd-menu__label">{it.label}</div>;
            return (
              <button key={it.key} type="button" role="menuitem" disabled={it.disabled} onMouseEnter={() => setActive(i)}
                className={cx("nd-menu__item", i === active && "is-active", it.danger && "is-danger", it.selected && "is-selected")}
                onClick={() => { it.onSelect?.(); close(); }}>
                {it.icon && <Icon icon={it.icon} size={16} />}
                <span className="nd-menu__text">{it.label}</span>
                {it.hint && <span className="nd-menu__hint">{it.hint}</span>}
                {it.selected && <Icon icon={Check} size={16} className="nd-menu__check" />}
              </button>
            );
          })}
        </div>, document.body)}
    </div>
  );
}
