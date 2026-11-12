import { cx } from "../../utils";
import "./Avatar.css";
const palette = ["#741ff3", "#fb6030", "#1548ff", "#4baa00", "#fca026", "#e5002a", "#560ce4", "#0032e6"];
export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
const px: Record<AvatarSize, number> = { xs: 24, sm: 32, md: 40, lg: 48, xl: 64 };
/** Alphabet avatar with a stable colour per name, or a photo when `src` is set. */
export function Avatar({ name, src, size = "sm", className }: { name: string; src?: string; size?: AvatarSize; className?: string }) {
  const s = px[size];
  const initials = name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "?";
  const bg = palette[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % palette.length];
  return (
    <span className={cx("nd-avatar", className)} style={{ width: s, height: s, fontSize: s * 0.4, background: src ? undefined : bg }} title={name}>
      {src ? <img src={src} alt={name} /> : initials}
    </span>
  );
}
