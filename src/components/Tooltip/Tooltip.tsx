import { useState, type ReactNode } from "react";
import { cx } from "../../utils";
import "./Tooltip.css";
/** Small dark tooltip on hover and keyboard focus. */
export function Tooltip({ content, side = "top", children, className }: { content: ReactNode; side?: "top" | "bottom" | "left" | "right"; children: ReactNode; className?: string }) {
  const [on, setOn] = useState(false);
  return (
    <span className={cx("nd-tipwrap", className)} onMouseEnter={() => setOn(true)} onMouseLeave={() => setOn(false)} onFocus={() => setOn(true)} onBlur={() => setOn(false)}>
      {children}
      {on && <span role="tooltip" className={`nd-tip nd-tip--${side}`}>{content}</span>}
    </span>
  );
}
