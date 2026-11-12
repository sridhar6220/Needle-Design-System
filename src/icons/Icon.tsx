import type { LucideIcon, LucideProps } from "lucide-react";
/** Needle icons are Feather-style strokes. Stroke follows the DS grid: 12px → 1, 16px → 1.3, 20px+ → 1.6. */
export type IconSize = 12 | 16 | 20 | 24;
const stroke: Record<IconSize, number> = { 12: 1, 16: 1.3, 20: 1.6, 24: 1.6 };
export interface IconProps extends Omit<LucideProps, "size"> { icon: LucideIcon; size?: IconSize; }
export function Icon({ icon: I, size = 20, ...rest }: IconProps) {
  return <I size={size} strokeWidth={stroke[size]} absoluteStrokeWidth aria-hidden {...rest} />;
}
