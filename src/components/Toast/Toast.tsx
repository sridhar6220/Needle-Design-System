import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from "../../icons";
import { Icon } from "../../icons/Icon";
import "./Toast.css";
export type ToastTone = "success" | "error" | "warning" | "info";
export interface ToastInput { title: ReactNode; description?: ReactNode; tone?: ToastTone; action?: { label: string; onClick: () => void }; duration?: number; }
type T = ToastInput & { id: number; leaving?: boolean };
const Ctx = createContext<(t: ToastInput) => void>(() => {});
export const useToast = () => useContext(Ctx);
const icons = { success: CheckCircle2, error: AlertCircle, warning: TriangleAlert, info: Info };
let seq = 0;
/** Wrap the app once; call `useToast()(…)` anywhere. Dark toasts as in the DS, bottom centre. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [list, setList] = useState<T[]>([]);
  const dismiss = useCallback((id: number) => {
    setList((l) => l.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    setTimeout(() => setList((l) => l.filter((t) => t.id !== id)), 200);
  }, []);
  const push = useCallback((t: ToastInput) => {
    const id = ++seq; setList((l) => [...l.slice(-2), { ...t, id }]);
    setTimeout(() => dismiss(id), t.duration ?? 4000);
  }, [dismiss]);
  return (
    <Ctx.Provider value={push}>
      {children}
      {createPortal(
        <div className="nd-toasts" aria-live="polite">
          {list.map((t) => (
            <div key={t.id} className={`nd-toast nd-toast--${t.tone ?? "success"}${t.leaving ? " is-leaving" : ""}`} role="status">
              <span className="nd-toast__icon"><Icon icon={icons[t.tone ?? "success"]} size={20} /></span>
              <div className="nd-toast__body"><strong>{t.title}</strong>{t.description && <span>{t.description}</span>}</div>
              {t.action && <button className="nd-toast__action" onClick={() => { t.action!.onClick(); dismiss(t.id); }}>{t.action.label}</button>}
              <button className="nd-toast__x" aria-label="Dismiss" onClick={() => dismiss(t.id)}><Icon icon={X} size={16} /></button>
            </div>
          ))}
        </div>, document.body)}
    </Ctx.Provider>
  );
}
