import { useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useFloating } from "../Popover/useFloating";
import { cx } from "../../utils";
import "./Tooltip.css";
/** Small dark tooltip on hover and keyboard focus. Rendered above everything so panels never clip it. */
export function Tooltip({ content, side = "top", children, className }: { content: ReactNode; side?: "top" | "bottom" | "left" | "right"; children: ReactNode; className?: string }) {
  const [on, setOn] = useState(false);
  const anchor = useRef<HTMLSpanElement>(null); const tip = useRef<HTMLSpanElement>(null);
  const style = useFloating(anchor, tip, on, { side, align: "center", offset: 8 });
  return (
    <span ref={anchor} className={cx("nd-tipwrap", className)} onMouseEnter={() => setOn(true)} onMouseLeave={() => setOn(false)} onFocus={() => setOn(true)} onBlur={() => setOn(false)} onPointerDown={() => setOn(false)}>
      {children}
      {on && createPortal(<span ref={tip} role="tooltip" className="nd-tip" style={style}>{content}</span>, document.body)}
    </span>
  );
}
