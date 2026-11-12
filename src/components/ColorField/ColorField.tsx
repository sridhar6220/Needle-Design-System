import { useId, useState, useEffect, type ReactNode } from "react";
import { Field } from "../TextField/Field";
import { cx } from "../../utils";
import "../TextField/TextField.css";
import "./ColorField.css";
const HEX = /^#([0-9a-f]{6})$/i;
export interface ColorFieldProps { value: string; onChange: (hex: string) => void; label?: ReactNode; swatches?: string[]; size?: "sm" | "md"; className?: string; }
/** Hex input with a native picker swatch and optional presets. */
export function ColorField({ value, onChange, label, swatches, size = "md", className }: ColorFieldProps) {
  const id = useId();
  const [draft, setDraft] = useState(value.toUpperCase());
  useEffect(() => setDraft(value.toUpperCase()), [value]);
  const commit = (v: string) => { const h = v.startsWith("#") ? v : "#" + v; if (HEX.test(h)) onChange(h.toUpperCase()); else setDraft(value.toUpperCase()); };
  return (
    <Field id={id} label={label} className={className}>
      <div className={cx("nd-input", `nd-input--${size}`, "nd-color")}>
        <label className="nd-color__chip" style={{ background: value }}>
          <input type="color" value={value} onChange={(e) => onChange(e.target.value.toUpperCase())} aria-label="Pick colour" />
        </label>
        <input id={id} value={draft} maxLength={7} spellCheck={false} onChange={(e) => setDraft(e.target.value)} onBlur={(e) => commit(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") commit((e.target as HTMLInputElement).value); }} />
      </div>
      {swatches && (
        <div className="nd-color__swatches">
          {swatches.map((s) => <button key={s} type="button" aria-label={s} className={cx(s.toLowerCase() === value.toLowerCase() && "is-on")} style={{ background: s }} onClick={() => onChange(s.toUpperCase())} />)}
        </div>
      )}
    </Field>
  );
}
