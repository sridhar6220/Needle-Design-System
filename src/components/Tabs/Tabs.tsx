import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cx } from "../../utils";
import "./Tabs.css";
export interface TabItem { value: string; label: ReactNode; badge?: ReactNode; }
export interface TabsProps { items: TabItem[]; value: string; onChange: (v: string) => void; className?: string; size?: "sm" | "md"; }
/** Underline tabs with an animated indicator. */
export function Tabs({ items, value, onChange, className, size = "md" }: TabsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [bar, setBar] = useState<{ left: number; width: number } | null>(null);
  useLayoutEffect(() => {
    const el = ref.current?.querySelector<HTMLElement>(`[data-value="${CSS.escape(value)}"]`);
    setBar(el ? { left: el.offsetLeft, width: el.offsetWidth } : null);
  }, [value, items]);
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0; if (!d) return;
    const n = items[(i + d + items.length) % items.length]; onChange(n.value);
    ref.current?.querySelector<HTMLElement>(`[data-value="${CSS.escape(n.value)}"]`)?.focus();
  };
  return (
    <div ref={ref} role="tablist" className={cx("nd-tabs", `nd-tabs--${size}`, className)}>
      {items.map((t, i) => (
        <button key={t.value} role="tab" type="button" data-value={t.value} aria-selected={t.value === value} tabIndex={t.value === value ? 0 : -1}
          className={cx("nd-tab", t.value === value && "is-on")} onClick={() => onChange(t.value)} onKeyDown={(e) => onKey(e, i)}>
          {t.label}{t.badge}
        </button>
      ))}
      {bar && <span className="nd-tabs__bar" style={{ transform: `translateX(${bar.left}px)`, width: bar.width }} />}
    </div>
  );
}
