import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from "../../icons";
import { Icon } from "../../icons/Icon";
import { cx } from "../../utils";
import "./Banner.css";
const icons = { success: CheckCircle2, error: AlertCircle, warning: TriangleAlert, info: Info };
export interface BannerProps { tone?: keyof typeof icons; children: ReactNode; action?: { label: string; onClick: () => void }; onClose?: () => void; variant?: "soft" | "solid"; className?: string; }
/** Inline message (DS "Banners" + "Flash message"). */
export function Banner({ tone = "info", children, action, onClose, variant = "soft", className }: BannerProps) {
  return (
    <div role={tone === "error" ? "alert" : "status"} className={cx("nd-banner", `nd-banner--${tone}`, `nd-banner--${variant}`, className)}>
      <Icon icon={icons[tone]} size={20} />
      <div className="nd-banner__text">{children}</div>
      {action && <button type="button" className="nd-banner__action" onClick={action.onClick}>{action.label}</button>}
      {onClose && <button type="button" className="nd-banner__x" aria-label="Dismiss" onClick={onClose}><Icon icon={X} size={16} /></button>}
    </div>
  );
}
