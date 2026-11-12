export const cx = (...a: unknown[]) => a.filter((x) => typeof x === "string" && x).join(" ");
let n = 0;
export const uid = (p = "nd") => `${p}-${++n}`;
