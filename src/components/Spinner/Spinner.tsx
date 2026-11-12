import "./Spinner.css";
export type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";
const px: Record<SpinnerSize, number> = { xs: 14, sm: 20, md: 24, lg: 32, xl: 48 };
/** xs/sm in buttons and fields, md in modals and drawers, lg/xl for full page loads. */
export function Spinner({ size = "sm", label = "Loading" }: { size?: SpinnerSize; label?: string }) {
  const s = px[size];
  return (
    <span className="nd-spinner" role="status" style={{ width: s, height: s }}>
      <svg viewBox="0 0 24 24" width={s} height={s}><circle cx="12" cy="12" r="9.5" /></svg>
      <span className="nd-sr-only">{label}</span>
    </span>
  );
}
