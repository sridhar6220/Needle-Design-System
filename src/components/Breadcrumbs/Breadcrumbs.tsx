import { ChevronRight } from "../../icons";
import { Icon } from "../../icons/Icon";
import "./Breadcrumbs.css";
export interface Crumb { label: string; onClick?: () => void; }
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="nd-crumbs"><ol>
      {items.map((c, i) => {
        const last = i === items.length - 1;
        return (
          <li key={i}>
            {last ? <span aria-current="page">{c.label}</span> : <button type="button" onClick={c.onClick}>{c.label}</button>}
            {!last && <Icon icon={ChevronRight} size={16} />}
          </li>
        );
      })}
    </ol></nav>
  );
}
