import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { Icon } from "../../icons/Icon";
import { cx } from "../../utils";
import "./NavItem.css";
export interface NavItemProps extends ButtonHTMLAttributes<HTMLButtonElement> { icon?: LucideIcon; active?: boolean; expandable?: boolean; expanded?: boolean; sub?: boolean; trailing?: ReactNode; }
/** Vertical tab / sidebar item, with optional sub-items (DS "Vertical tabs"). */
export function NavItem({ icon, active, expandable, expanded, sub, trailing, children, className, ...rest }: NavItemProps) {
  return (
    <button type="button" aria-current={active ? "page" : undefined} aria-expanded={expandable ? !!expanded : undefined}
      className={cx("nd-nav", active && "is-active", sub && "is-sub", className)} {...rest}>
      {icon && <Icon icon={icon} size={20} />}
      <span className="nd-nav__label">{children}</span>
      {trailing}
      {expandable && <Icon icon={ChevronDown} size={16} className={cx("nd-nav__chev", expanded && "is-open")} />}
    </button>
  );
}
