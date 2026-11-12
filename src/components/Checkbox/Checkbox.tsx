import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cx } from "../../utils";
import "./Checkbox.css";
export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> { label?: ReactNode; description?: ReactNode; }
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox({ label, description, className, id, ...rest }, ref) {
  const a = useId(); const fid = id || a;
  return (
    <label className={cx("nd-check", rest.disabled && "is-disabled", className)} htmlFor={fid}>
      <span className="nd-check__box">
        <input ref={ref} id={fid} type="checkbox" {...rest} />
        <svg viewBox="0 0 16 16" aria-hidden><path d="M4 8.2 6.6 10.8 12 5.4" /></svg>
      </span>
      {(label || description) && <span className="nd-check__text">{label}{description && <small>{description}</small>}</span>}
    </label>
  );
});
