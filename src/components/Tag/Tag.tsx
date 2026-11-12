import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Icon } from "../../icons/Icon";
import { cx } from "../../utils";
import "./Tag.css";
export type Tone = "neutral" | "accent" | "success" | "warning" | "error" | "info";
/** Status label (DS "Labels"): Success, Warning, Error, Info, Archived (neutral). */
export function Badge({ tone = "neutral", dot, children, className }: { tone?: Tone; dot?: boolean; children: ReactNode; className?: string }) {
  return <span className={cx("nd-badge", `nd-badge--${tone}`, className)}>{dot && <i />}{children}</span>;
}
/** Removable chip (DS "Tags"). */
export function Tag({ children, onRemove, className }: { children: ReactNode; onRemove?: () => void; className?: string }) {
  return <span className={cx("nd-tag", className)}>{children}{onRemove && <button type="button" aria-label="Remove" onClick={onRemove}><Icon icon={X} size={12} /></button>}</span>;
}
