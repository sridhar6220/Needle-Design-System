import type { ReactNode } from "react";
import { RadioMark } from "../Radio/Radio";
import { cx } from "../../utils";
import "./SelectCard.css";
export interface SelectCardProps { selected: boolean; onSelect: () => void; title: ReactNode; description?: ReactNode; media?: ReactNode; badge?: ReactNode; layout?: "stack" | "row"; disabled?: boolean; className?: string; }
/** A large selectable option (onboarding choices, templates). Acts as a radio. */
export function SelectCard({ selected, onSelect, title, description, media, badge, layout = "stack", disabled, className }: SelectCardProps) {
  return (
    <button type="button" role="radio" aria-checked={selected} disabled={disabled} onClick={onSelect}
      className={cx("nd-scard", `nd-scard--${layout}`, selected && "is-on", className)}>
      <span className="nd-scard__mark"><RadioMark checked={selected} /></span>
      {media && <span className="nd-scard__media">{media}</span>}
      <span className="nd-scard__text">
        <span className="nd-scard__title">{title}{badge}</span>
        {description && <span className="nd-scard__desc">{description}</span>}
      </span>
    </button>
  );
}
