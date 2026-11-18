import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "../../icons";
import { IconButton } from "../Button/Button";
import { cx } from "../../utils";
import "./Modal.css";
export interface ModalProps { open: boolean; onClose: () => void; title?: ReactNode; description?: ReactNode; children?: ReactNode; footer?: ReactNode; size?: "sm" | "md" | "lg"; dismissible?: boolean; }
/** S = 480, M = 640, L = 880. Traps focus loosely, closes on Escape and backdrop click. */
export function Modal({ open, onClose, title, description, children, footer, size = "sm", dismissible = true }: ModalProps) {
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const t = setTimeout(() => panel.current?.querySelector<HTMLElement>("[data-autofocus], input, textarea, button:not([data-close])")?.focus(), 30);
    const key = (e: KeyboardEvent) => { if (e.key === "Escape" && dismissible) onClose(); };
    document.addEventListener("keydown", key);
    return () => { clearTimeout(t); document.removeEventListener("keydown", key); prev?.focus?.(); };
  }, [open, onClose, dismissible]);
  if (!open) return null;
  return createPortal(
    <div className="nd-modal__backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget && dismissible) onClose(); }}>
      <div ref={panel} role="dialog" aria-modal="true" aria-label={typeof title === "string" ? title : undefined} className={cx("nd-modal", `nd-modal--${size}`)}>
        {(title || dismissible) && (
          <div className="nd-modal__head">
            <div>{title && <h2 className="nd-modal__title">{title}</h2>}{description && <p className="nd-modal__desc">{description}</p>}</div>
            {dismissible && <IconButton data-close icon={X} label="Close" size="sm" onClick={onClose} />}
          </div>
        )}
        {children && <div className="nd-modal__body">{children}</div>}
        {footer && <div className="nd-modal__foot">{footer}</div>}
      </div>
    </div>, document.body);
}
