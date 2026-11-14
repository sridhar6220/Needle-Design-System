import { useCallback, useRef, useState, type ReactElement, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useDismiss } from "../Menu/useDismiss";
import { useFloating, type FloatingOptions } from "./useFloating";
import { cx } from "../../utils";
import "./Popover.css";

export interface PopoverProps extends FloatingOptions {
  trigger: (p: { open: boolean; toggle: () => void; props: Record<string, unknown> }) => ReactElement;
  children: ReactNode | ((close: () => void) => ReactNode);
  className?: string; label?: string;
}
/** A floating panel anchored to its trigger. Renders above everything, flips at screen edges. */
export function Popover({ trigger, children, className, label, side = "bottom", align = "start", width = "auto", maxHeight, offset }: PopoverProps) {
  const [open, setOpen] = useState(false);
  const anchor = useRef<HTMLSpanElement>(null); const pop = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss([anchor, pop], open, close);
  const style = useFloating(anchor, pop, open, { side, align, width, maxHeight, offset });
  return (
    <span ref={anchor} className="nd-popwrap">
      {trigger({ open, toggle: () => setOpen((o) => !o), props: { "aria-haspopup": "dialog", "aria-expanded": open } })}
      {open && createPortal(<div ref={pop} role="dialog" aria-label={label} className={cx("nd-pop", className)} style={style}>{typeof children === "function" ? children(close) : children}</div>, document.body)}
    </span>
  );
}
