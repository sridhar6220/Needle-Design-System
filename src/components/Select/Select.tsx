import { useId, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Icon } from "../../icons/Icon";
import { Menu } from "../Menu/Menu";
import { Field } from "../TextField/Field";
import { cx } from "../../utils";
import "../TextField/TextField.css";
import "./Select.css";
export interface SelectOption { value: string; label: ReactNode; /** Options sharing a group get a small heading above them. */ group?: string; }
export interface SelectProps { options: SelectOption[]; value?: string; onChange: (v: string) => void; placeholder?: string; label?: ReactNode; required?: boolean; hint?: ReactNode; error?: ReactNode; disabled?: boolean; size?: "sm" | "md"; className?: string; }
/** DS "Dropdown field": a field that opens a Needle menu. */
export function Select({ options, value, onChange, placeholder = "Click to select", label, required, hint, error, disabled, size = "md", className }: SelectProps) {
  const id = useId();
  const cur = options.find((o) => o.value === value);
  return (
    <Field id={id} label={label} required={required} hint={hint} error={error} className={className}>
      <Menu width="100%" className="nd-select"
        items={options.flatMap((o, i) => [...(o.group && o.group !== options[i - 1]?.group ? [{ type: "label" as const, key: `g-${o.group}`, label: o.group }] : []), { key: o.value, label: o.label, selected: o.value === value, onSelect: () => onChange(o.value) }])}
        trigger={({ open, toggle, props }) => (
          <button id={id} type="button" disabled={disabled} onClick={toggle} {...props}
            className={cx("nd-input", `nd-input--${size}`, "nd-select__btn", open && "is-open", error && "is-error", disabled && "is-disabled")}>
            <span className={cx("nd-select__val", !cur && "is-ph")}>{cur ? cur.label : placeholder}</span>
            <Icon icon={ChevronDown} size={size === "sm" ? 16 : 20} className="nd-select__chev" />
          </button>
        )} />
    </Field>
  );
}
