import { useId, type ReactNode } from "react";
import { cx } from "../../utils";
import "./Switch.css";
export interface SwitchProps { checked: boolean; onChange: (v: boolean) => void; label?: ReactNode; disabled?: boolean; size?: "sm" | "md"; className?: string; labelPosition?: "left" | "right"; }
export function Switch({ checked, onChange, label, disabled, size = "md", className, labelPosition = "right" }: SwitchProps) {
  const id = useId();
  const sw = <button id={id} type="button" role="switch" aria-checked={checked} disabled={disabled} onClick={() => onChange(!checked)} className={cx("nd-switch", `nd-switch--${size}`, checked && "is-on")}><span /></button>;
  if (!label) return sw;
  return <label htmlFor={id} className={cx("nd-switch-row", labelPosition === "left" && "is-left", disabled && "is-disabled", className)}>{labelPosition === "left" && <span>{label}</span>}{sw}{labelPosition === "right" && <span>{label}</span>}</label>;
}
