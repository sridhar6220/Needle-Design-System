import type { ReactNode } from "react";
import { cx } from "../../utils";
import "./TextField.css";
export interface FieldProps {
  id: string; label?: ReactNode; required?: boolean; hint?: ReactNode; error?: ReactNode;
  trailing?: ReactNode; className?: string; children: ReactNode;
}
/** Label, control, then hint or error. Shared by every input type. */
export function Field({ id, label, required, hint, error, trailing, className, children }: FieldProps) {
  return (
    <div className={cx("nd-field", className)}>
      {(label || trailing) && (
        <div className="nd-field__top">
          {label && <label className="nd-field__label" htmlFor={id}>{label}{required && <span className="nd-field__req" aria-hidden> *</span>}</label>}
          {trailing}
        </div>
      )}
      {children}
      {error ? <p className="nd-field__msg is-error" id={`${id}-msg`} role="alert">{error}</p>
        : hint ? <p className="nd-field__msg" id={`${id}-msg`}>{hint}</p> : null}
    </div>
  );
}
