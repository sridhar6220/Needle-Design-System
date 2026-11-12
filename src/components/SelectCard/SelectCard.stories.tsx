import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Rocket, Building2 } from "lucide-react";
import { SelectCard } from "./SelectCard";
import { Icon } from "../../icons/Icon";
const meta: Meta = { title: "Components/SelectCard", parameters: { layout: "padded" } };
export default meta;
export const BusinessType: StoryObj = {
  render: () => { const [v, s] = useState("startup"); const m = (I: typeof Rocket) => <span style={{ display: "grid", placeItems: "center", width: 56, height: 56, borderRadius: 16, background: "var(--accent-soft)", color: "var(--accent-text)" }}><Icon icon={I} size={24} /></span>; return (
    <div role="radiogroup" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 720 }}>
      <SelectCard selected={v === "startup"} onSelect={() => s("startup")} media={m(Rocket)} title="Startup" description="One person wears every hat." />
      <SelectCard selected={v === "ent"} onSelect={() => s("ent")} media={m(Building2)} title="Enterprise" description="Specialised teams for each function." />
    </div>); },
};
