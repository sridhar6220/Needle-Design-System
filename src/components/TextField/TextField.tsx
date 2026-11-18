import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import type { LucideIcon } from "../../icons";
import { Search, X } from "../../icons";
import { Icon } from "../../icons/Icon";
import { Field } from "./Field";
import { cx } from "../../utils";

interface Common { label?: ReactNode; hint?: ReactNode; error?: ReactNode; trailing?: ReactNode; }
export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">, Common {
  iconLeft?: LucideIcon; suffix?: ReactNode; size?: "sm" | "md";
}
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, hint, error, trailing, iconLeft, suffix, size = "md", required, className, id, ...rest }, ref) {
  const auto = useId(); const fid = id || auto;
  return (
    <Field id={fid} label={label} required={required} hint={hint} error={error} trailing={trailing} className={className}>
      <div className={cx("nd-input", `nd-input--${size}`, error && "is-error", rest.disabled && "is-disabled")}>
        {iconLeft && <Icon icon={iconLeft} size={size === "sm" ? 16 : 20} className="nd-input__icon" />}
        <input ref={ref} id={fid} required={required} aria-invalid={!!error || undefined}
          aria-describedby={error || hint ? `${fid}-msg` : undefined} {...rest} />
        {suffix && <span className="nd-input__suffix">{suffix}</span>}
      </div>
    </Field>
  );
});

export interface SearchFieldProps extends Omit<TextFieldProps, "iconLeft" | "onChange"> {
  value: string; onChange: (v: string) => void;
}
export function SearchField({ value, onChange, placeholder = "Search", ...rest }: SearchFieldProps) {
  return (
    <TextField {...rest} iconLeft={Search} value={value} placeholder={placeholder} type="search"
      onChange={(e) => onChange(e.target.value)}
      suffix={value ? <button type="button" className="nd-input__clear" aria-label="Clear search" onClick={() => onChange("")}><Icon icon={X} size={16} /></button> : undefined} />
  );
}

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, Common { maxLength?: number; }
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { label, hint, error, trailing, required, className, id, maxLength, value, ...rest }, ref) {
  const auto = useId(); const fid = id || auto;
  const count = typeof value === "string" ? value.length : undefined;
  return (
    <Field id={fid} label={label} required={required} error={error} className={className}
      trailing={trailing ?? (maxLength && count != null ? <span className="nd-field__count">{count}/{maxLength}</span> : undefined)}
      hint={hint}>
      <div className={cx("nd-input", "nd-input--area", error && "is-error", rest.disabled && "is-disabled")}>
        <textarea ref={ref} id={fid} required={required} maxLength={maxLength} value={value} aria-invalid={!!error || undefined} {...rest} />
      </div>
    </Field>
  );
});
