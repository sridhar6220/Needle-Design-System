import type { LucideIcon, LucideProps } from "lucide-react";
/** Needle icons: Craftwork glyphs plus Lucide primitives (see ./index.ts), all on a 2px-at-24 line. Stroke follows the DS grid: 12px → 1, 16px → 1.3, 20px+ → 1.6. */
export type IconSize = 12 | 16 | 20 | 24;
const stroke: Record<IconSize, number> = { 12: 1, 16: 1.3, 20: 1.6, 24: 1.6 };
export interface IconProps extends Omit<LucideProps, "size"> {
  icon: LucideIcon; size?: IconSize;
  /** Filled style for pressed, selected and active states. Craftwork icons switch to their fill drawing; Lucide ones fill their shape. */
  filled?: boolean;
}
export function Icon({ icon: I, size = 20, filled, ...rest }: IconProps) {
  const cw = "craftwork" in I;
  const fillProps = filled ? (cw ? { variant: "fill" } : { fill: "currentColor" }) : {};
  return <I size={size} strokeWidth={stroke[size]} absoluteStrokeWidth aria-hidden {...fillProps} {...rest} />;
}
