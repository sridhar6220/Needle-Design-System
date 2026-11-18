import type { ReactNode } from "react";
import type { LucideIcon } from "../../icons";
import { Icon } from "../../icons/Icon";
import { cx } from "../../utils";
import "./EmptyState.css";
/** New in Needle (the 2023 file left this section blank). Icon in a soft ring, title, body, actions. */
export function EmptyState({ icon, illustration, title, children, actions, compact, className }: { icon?: LucideIcon; illustration?: ReactNode; title: ReactNode; children?: ReactNode; actions?: ReactNode; compact?: boolean; className?: string }) {
  return (
    <div className={cx("nd-empty", compact && "is-compact", className)}>
      {illustration ?? (icon && <span className="nd-empty__icon"><Icon icon={icon} size={24} /></span>)}
      <h3>{title}</h3>
      {children && <p>{children}</p>}
      {actions && <div className="nd-empty__actions">{actions}</div>}
    </div>
  );
}
