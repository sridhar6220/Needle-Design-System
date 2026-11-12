import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Checkbox } from "./Checkbox";
import { Radio, RadioGroup } from "../Radio/Radio";
import { Switch } from "../Switch/Switch";
import { SegmentedControl } from "../SegmentedControl/SegmentedControl";
import { Slider } from "../Slider/Slider";
import { ColorField } from "../ColorField/ColorField";
const meta: Meta = { title: "Components/Selection controls", parameters: { layout: "padded" } };
export default meta;
type S = StoryObj;
export const Checkboxes: S = { render: () => <div style={{ display: "grid", gap: 12 }}><Checkbox label="Show product title" defaultChecked /><Checkbox label="Show add to cart button" /><Checkbox label="Disabled" disabled /><Checkbox label="Disabled on" disabled defaultChecked /></div> };
export const Radios: S = {
  render: () => { const [v, s] = useState("small"); return (
    <RadioGroup label="Brand size" value={v} onChange={s} direction="row">
      <Radio value="small" label="Small (1-10)" /><Radio value="medium" label="Medium (1-50)" /><Radio value="large" label="Large (100+)" /><Radio value="x" label="Disabled" disabled />
    </RadioGroup>); },
};
export const Switches: S = { render: () => { const [a, sa] = useState(true); const [b, sb] = useState(false); return <div style={{ display: "grid", gap: 12, width: 260 }}><Switch checked={a} onChange={sa} label="Widget title" labelPosition="left" /><Switch checked={b} onChange={sb} label="Widget shadow" labelPosition="left" /><Switch checked size="sm" onChange={() => {}} label="Small" /><Switch checked={false} disabled onChange={() => {}} label="Disabled" /></div>; } };
export const Segmented: S = {
  render: () => { const [a, sa] = useState("square"); const [b, sb] = useState("fill"); return (
    <div style={{ display: "grid", gap: 16, width: 300 }}>
      <SegmentedControl value={a} onChange={sa} options={[{ value: "square", label: "Square" }, { value: "rect", label: "Rectangle" }]} />
      <SegmentedControl fullWidth size="sm" value={b} onChange={sb} options={[{ value: "fill", label: "Fill" }, { value: "cover", label: "Cover" }, { value: "contain", label: "Contain" }]} />
    </div>); },
};
export const Sliders: S = { render: () => { const [v, s] = useState(8); return <div style={{ width: 280 }}><Slider label="Widget radius" value={v} onChange={s} max={24} /></div>; } };
export const Colour: S = { render: () => { const [v, s] = useState("#B8863E"); return <div style={{ width: 280 }}><ColorField label="Brand colour" value={v} onChange={s} swatches={["#741FF3", "#B8863E", "#131313", "#FB6030", "#1548FF", "#4BAA00"]} /></div>; } };
