import { useEffect, type RefObject } from "react";
/** Close on outside pointer down or Escape. Pass every element that counts as "inside" (trigger, floating panel). */
export function useDismiss(refs: RefObject<HTMLElement | null> | RefObject<HTMLElement | null>[], open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const list = Array.isArray(refs) ? refs : [refs];
    const down = (e: PointerEvent) => { if (!list.some((r) => r.current?.contains(e.target as Node))) onClose(); };
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("pointerdown", down); document.addEventListener("keydown", key);
    return () => { document.removeEventListener("pointerdown", down); document.removeEventListener("keydown", key); };
  }, [open, onClose, refs]);
}
