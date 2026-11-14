import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Pipette } from "lucide-react";
import { Field } from "../TextField/Field";
import { useDismiss } from "../Menu/useDismiss";
import { useFloating } from "../Popover/useFloating";
import { createPortal } from "react-dom";
import { cx } from "../../utils";
import "../TextField/TextField.css";
import "./ColorField.css";

const HEX = /^#([0-9a-f]{6})$/i;
const PRESETS = ["#741FF3", "#1548FF", "#0E7C86", "#1F6F5C", "#4BAA00", "#B8863E", "#FCA026", "#FB6030", "#C0262D", "#E8476A", "#7A4B94", "#131313", "#555555", "#9D9D9D", "#E9E4DA", "#FFFFFF"];

type HSV = { h: number; s: number; v: number };
/** WCAG relative luminance and contrast ratio. */
const lum = (hex: string) => { const n = parseInt(hex.slice(1), 16); const c = [n >> 16, (n >> 8) & 255, n & 255].map((x) => { const v = x / 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
export const contrast = (a: string, b: string) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
function hexToHsv(hex: string): HSV {
  const n = parseInt(hex.slice(1), 16); const r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0; if (d) h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return { h: (h * 60 + 360) % 360, s: max ? d / max : 0, v: max };
}
function hsvToHex({ h, s, v }: HSV) {
  const f = (n: number) => { const k = (n + h / 60) % 6; return v - v * s * Math.max(0, Math.min(k, 4 - k, 1)); };
  return "#" + [f(5), f(3), f(1)].map((x) => Math.round(x * 255).toString(16).padStart(2, "0")).join("").toUpperCase();
}
function useDrag(onMove: (x: number, y: number) => void) {
  return useCallback((e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget; const rect = el.getBoundingClientRect();
    const move = (ev: PointerEvent | React.PointerEvent) => onMove(Math.min(1, Math.max(0, (ev.clientX - rect.left) / rect.width)), Math.min(1, Math.max(0, (ev.clientY - rect.top) / rect.height)));
    move(e); el.setPointerCapture(e.pointerId);
    const up = () => { el.removeEventListener("pointermove", move as never); el.removeEventListener("pointerup", up); };
    el.addEventListener("pointermove", move as never); el.addEventListener("pointerup", up);
  }, [onMove]);
}

/** Full colour picker: saturation/brightness area, hue slider, hex, eyedropper and presets. */
export function ColorPicker({ value, onChange, presets = PRESETS, isOk = () => true }: { value: string; onChange: (hex: string) => void; presets?: string[]; isOk?: (hex: string) => boolean }) {
  const [hsv, setHsv] = useState<HSV>(() => hexToHsv(HEX.test(value) ? value : "#741FF3"));
  const last = useRef(value);
  useEffect(() => { if (value !== last.current && HEX.test(value)) { setHsv(hexToHsv(value)); last.current = value; } }, [value]);
  const emit = (n: HSV) => { setHsv(n); const hex = hsvToHex(n); last.current = hex; onChange(hex); };
  const area = useDrag((x, y) => emit({ ...hsv, s: x, v: 1 - y }));
  const hue = useDrag((x) => emit({ ...hsv, h: x * 359.9 }));
  const eye = typeof window !== "undefined" && "EyeDropper" in window;
  const pickScreen = async () => { try { const r = await new (window as unknown as { EyeDropper: new () => { open: () => Promise<{ sRGBHex: string }> } }).EyeDropper().open(); const hex = r.sRGBHex.toUpperCase(); setHsv(hexToHsv(hex)); last.current = hex; onChange(hex); } catch { /* cancelled */ } };
  const key = (e: React.KeyboardEvent, axis: "s" | "v" | "h") => {
    const step = e.shiftKey ? 0.1 : 0.02; const d = e.key === "ArrowRight" || e.key === "ArrowUp" ? step : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -step : 0; if (!d) return; e.preventDefault();
    if (axis === "h") emit({ ...hsv, h: (hsv.h + d * 360 + 360) % 360 });
    else emit({ ...hsv, [axis]: Math.min(1, Math.max(0, hsv[axis] + d)) });
  };
  return (
    <div className="nd-cp">
      <div className="nd-cp__area" style={{ backgroundColor: `hsl(${hsv.h} 100% 50%)` }} onPointerDown={area} role="slider" tabIndex={0} aria-label="Saturation and brightness" aria-valuetext={hsvToHex(hsv)} onKeyDown={(e) => key(e, e.key === "ArrowUp" || e.key === "ArrowDown" ? "v" : "s")}>
        <span className="nd-cp__knob" style={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%`, background: hsvToHex(hsv) }} />
      </div>
      <div className="nd-cp__row">
        {eye && <button type="button" className="nd-cp__eye" onClick={pickScreen} aria-label="Pick a colour from the screen" title="Pick from screen"><Pipette size={16} /></button>}
        <div className="nd-cp__hue" onPointerDown={hue} role="slider" tabIndex={0} aria-label="Hue" aria-valuenow={Math.round(hsv.h)} aria-valuemin={0} aria-valuemax={360} onKeyDown={(e) => key(e, "h")}>
          <span className="nd-cp__knob nd-cp__knob--hue" style={{ left: `${(hsv.h / 360) * 100}%`, background: `hsl(${hsv.h} 100% 50%)` }} />
        </div>
      </div>
      <div className="nd-cp__presets">
        {presets.map((p) => { const ok = isOk(p); return <button key={p} type="button" disabled={!ok} aria-label={ok ? p : `${p}, too low contrast`} title={ok ? p : "Too light to read on white"} className={cx(p.toLowerCase() === value.toLowerCase() && "is-on", !ok && "is-bad")} style={{ background: p }} onClick={() => { setHsv(hexToHsv(p)); last.current = p; onChange(p); }} />; })}
      </div>
    </div>
  );
}

export interface ColorFieldProps {
  value: string; onChange: (hex: string) => void; label?: ReactNode; swatches?: string[]; size?: "sm" | "md"; className?: string;
  /** Minimum contrast against `against` (default white). Colours below it are refused with an explanation. */
  minContrast?: number; against?: string;
}
/** Hex input with a swatch that opens the full colour picker. */
export function ColorField({ value, onChange: commitOk, label, swatches, size = "md", className, minContrast, against = "#FFFFFF" }: ColorFieldProps) {
  const id = useId(); const wrap = useRef<HTMLDivElement>(null); const pop = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState(value.toUpperCase()); const [open, setOpen] = useState(false);
  const popStyle = useFloating(wrap, pop, open, { side: "bottom", align: "start", width: 264 });
  const [bad, setBad] = useState<string>();
  const isOk = useCallback((hex: string) => !minContrast || contrast(hex, against) >= minContrast, [minContrast, against]);
  const onChange = (hex: string) => { if (isOk(hex)) { setBad(undefined); commitOk(hex); } else setBad(hex); };
  useEffect(() => setDraft(value.toUpperCase()), [value]);
  useDismiss([wrap, pop], open, useCallback(() => setOpen(false), []));
  const commit = (v: string) => { const h = (v.startsWith("#") ? v : "#" + v).toUpperCase(); if (HEX.test(h) && isOk(h)) onChange(h); else { if (HEX.test(h)) setBad(h); setDraft(value.toUpperCase()); } };
  return (
    <Field id={id} label={label} className={className}>
      <div className="nd-color__wrap" ref={wrap}>
        <div className={cx("nd-input", `nd-input--${size}`, "nd-color", open && "is-open", bad && "is-error")}>
          <button type="button" className="nd-color__chip" style={{ background: value }} onClick={() => setOpen(!open)} aria-label="Open colour picker" aria-expanded={open} />
          <input id={id} value={draft} maxLength={7} spellCheck={false} onChange={(e) => setDraft(e.target.value)} onFocus={() => setOpen(true)} onBlur={(e) => commit(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { commit((e.target as HTMLInputElement).value); setOpen(false); } }} />
        </div>
        {open && createPortal(<div ref={pop} className="nd-color__pop" style={popStyle} role="dialog" aria-label="Colour picker"><ColorPicker value={bad ?? value} onChange={onChange} isOk={isOk} presets={swatches ? [...new Set([...swatches, ...PRESETS])].slice(0, 16) : undefined} /></div>, document.body)}
      </div>
      {bad && <p className="nd-field__msg is-error" role="alert">{bad} is too light ({contrast(bad, against).toFixed(1)}:1). Text and buttons in this colour need at least {minContrast}:1 against white. Pick a deeper shade.</p>}
      {swatches && (
        <div className="nd-color__swatches">
          {swatches.filter(isOk).map((s) => <button key={s} type="button" aria-label={s} className={cx(s.toLowerCase() === value.toLowerCase() && "is-on")} style={{ background: s }} onClick={() => onChange(s.toUpperCase())} />)}
          <button type="button" className="nd-color__more" aria-label="More colours" onClick={() => setOpen(true)} />
        </div>
      )}
    </Field>
  );
}
