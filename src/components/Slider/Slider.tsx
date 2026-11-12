import { useId, type ReactNode } from "react";
import "./Slider.css";
export interface SliderProps { value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number; label?: ReactNode; unit?: string; className?: string; }
/** Range input with a value readout. Used for radius, height and spacing controls. */
export function Slider({ value, onChange, min = 0, max = 100, step = 1, label, unit = "px", className }: SliderProps) {
  const id = useId();
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className={`nd-slider ${className ?? ""}`}>
      {label && <div className="nd-slider__top"><label htmlFor={id} className="nd-field__label">{label}</label><output htmlFor={id}>{value}{unit}</output></div>}
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} style={{ "--p": `${pct}%` } as React.CSSProperties} />
    </div>
  );
}
