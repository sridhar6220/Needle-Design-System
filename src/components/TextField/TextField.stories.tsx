import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Link2 } from "lucide-react";
import { TextField, SearchField, TextArea } from "./TextField";
import { Select } from "../Select/Select";
const meta: Meta = { title: "Components/Inputs", parameters: { layout: "padded" } };
export default meta;
type S = StoryObj;
const grid = { display: "grid", gridTemplateColumns: "repeat(3, 280px)", gap: 24 } as const;
export const States: S = {
  render: () => (
    <div style={grid}>
      <TextField label="Brand name" required placeholder="Enter your business name" />
      <TextField label="Brand name" required defaultValue="Vilva" />
      <TextField label="Link" iconLeft={Link2} placeholder="https://" hint="Opens inside the app" />
      <TextField label="Brand name" required defaultValue="" placeholder="Enter your business name" error="Brand name is required" />
      <TextField label="Store URL" disabled defaultValue="vilva.myshopify.com" />
      <TextField label="Divider height" type="number" defaultValue={8} suffix="px" />
    </div>
  ),
};
export const Search: S = { render: () => { const [v, s] = useState(""); return <div style={{ width: 280 }}><SearchField value={v} onChange={s} placeholder="Search widgets" /></div>; } };
export const Dropdown: S = {
  render: () => { const [v, s] = useState<string>(); return <div style={{ width: 280, height: 280 }}><Select label="Industry" required value={v} onChange={s} options={["Fashion", "Grocery", "Food", "Electronics", "Beauty"].map((x) => ({ value: x, label: x }))} /></div>; },
};
export const Paragraph: S = {
  render: () => { const [v, s] = useState(""); return <div style={{ width: 420 }}><TextArea label="Description" required maxLength={200} value={v} onChange={(e) => s(e.target.value)} placeholder="Description about this version of the app" /></div>; },
};
