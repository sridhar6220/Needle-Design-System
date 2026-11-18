import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import type { LucideIcon } from "../../icons";
import { Icon } from "../../icons/Icon";
import { Spinner } from "../Spinner/Spinner";
import { cx } from "../../utils";
import "./Button.css";

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "link" | "ghost" | "danger";
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  /** "md" = Regular (36px), "sm" = Mini (28px), "lg" = 44px for page level CTAs. */
  size?: "sm" | "md" | "lg";
  iconLeft?: LucideIcon;
  iconRight?: LucideIcon;
  loading?: boolean;
  fullWidth?: boolean;
  children?: ReactNode;
}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", iconLeft, iconRight, loading, fullWidth, disabled, className, children, ...rest }, ref) {
  const is = size === "sm" ? 16 : 20;
  return (
    <button ref={ref} className={cx("nd-btn", `nd-btn--${variant}`, `nd-btn--${size}`, fullWidth && "nd-btn--full", loading && "is-loading", className)}
      disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {loading && <span className="nd-btn__spin"><Spinner size={size === "sm" ? "xs" : "sm"} /></span>}
      {iconLeft && <Icon icon={iconLeft} size={is} />}
      {children != null && <span className="nd-btn__label">{children}</span>}
      {iconRight && <Icon icon={iconRight} size={is} />}
    </button>
  );
});

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  label: string;
  variant?: "outline" | "ghost" | "solid";
  size?: "sm" | "md";
  active?: boolean;
}
/** Square-ish icon button. `label` is required for screen readers and the native tooltip. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, label, variant = "ghost", size = "md", active, className, ...rest }, ref) {
  return (
    <button ref={ref} aria-label={label} title={label} aria-pressed={active || undefined}
      className={cx("nd-iconbtn", `nd-iconbtn--${variant}`, `nd-iconbtn--${size}`, active && "is-active", className)} {...rest}>
      <Icon icon={icon} size={size === "sm" ? 16 : 20} />
    </button>
  );
});
