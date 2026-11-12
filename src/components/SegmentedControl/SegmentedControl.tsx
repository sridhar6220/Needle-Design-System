import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cx } from "../../utils";
import "./SegmentedControl.css";
export interface SegmentOption { value: string; label: ReactNode; disabled?: boolean; }
export interface SegmentedControlProps { options: SegmentOption[]; value: string; onChange: (v: string) => void; size?: "sm" | "md"; fullWidth?: boolean; ariaLabel?: string; className?: string; }
/** The DS "2 & 3 toggle buttons", generalised to any count, with a sliding thumb. */
export function SegmentedControl({ options, value, onChange, size = "md", fullWidth, ariaLabel, className }: SegmentedControlProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState<{ left: number; width: number } | null>(null);
  useLayoutEffect(() => {
    const el = ref.current?.querySelector<HTMLButtonElement>(`[data-value="${CSS.escape(value)}"]`);
    if (el) setThumb({ left: el.offsetLeft, width: el.offsetWidth });
  }, [value, options.length]);
  return (
    <div ref={ref} role="radiogroup" aria-label={ariaLabel} className={cx("nd-seg", `nd-seg--${size}`, fullWidth && "nd-seg--full", className)}>
      {thumb && <span className="nd-seg__thumb" style={{ transform: `translateX(${thumb.left - 3}px)`, width: thumb.width }} />}
      {options.map((o) => (
        <button key={o.value} type="button" role="radio" aria-checked={o.value === value} data-value={o.value} disabled={o.disabled}
          className={cx("nd-seg__opt", o.value === value && "is-on")} onClick={() => onChange(o.value)}>{o.label}</button>
      ))}
    </div>
  );
}
