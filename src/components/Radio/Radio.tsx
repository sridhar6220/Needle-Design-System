import { createContext, useContext, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cx } from "../../utils";
import "../Checkbox/Checkbox.css";
import "./Radio.css";
const Ctx = createContext<{ name: string; value?: string; onChange?: (v: string) => void } | null>(null);
export interface RadioGroupProps { value?: string; onChange?: (v: string) => void; name?: string; label?: ReactNode; direction?: "row" | "column"; children: ReactNode; className?: string; }
export function RadioGroup({ value, onChange, name, label, direction = "column", children, className }: RadioGroupProps) {
  const auto = useId();
  return (
    <div role="radiogroup" aria-label={typeof label === "string" ? label : undefined} className={cx("nd-radiogroup", `nd-radiogroup--${direction}`, className)}>
      {label && <span className="nd-field__label">{label}</span>}
      <div className="nd-radiogroup__items"><Ctx.Provider value={{ name: name || auto, value, onChange }}>{children}</Ctx.Provider></div>
    </div>
  );
}
export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "value"> { value: string; label?: ReactNode; description?: ReactNode; }
export function Radio({ value, label, description, className, ...rest }: RadioProps) {
  const g = useContext(Ctx);
  return (
    <label className={cx("nd-radio", rest.disabled && "is-disabled", className)}>
      <span className="nd-radio__dot">
        <input type="radio" name={g?.name} value={value} checked={g ? g.value === value : undefined} onChange={() => g?.onChange?.(value)} {...rest} />
      </span>
      {(label || description) && <span className="nd-radio__text">{label}{description && <small>{description}</small>}</span>}
    </label>
  );
}
/** Bare radio indicator for custom selectable cards. */
export function RadioMark({ checked }: { checked: boolean }) { return <span className={cx("nd-radiomark", checked && "is-on")} aria-hidden />; }
