import type { Meta, StoryObj } from "@storybook/react-vite";
import { Plus, Heart, Eye, Bell, Repeat, ArrowRight } from "../../icons";
import { Button, IconButton } from "./Button";
const meta: Meta<typeof Button> = {
  title: "Components/Button", component: Button, tags: ["autodocs"],
  args: { children: "Publish", variant: "primary", size: "md" },
  argTypes: { variant: { control: "inline-radio", options: ["primary", "secondary", "tertiary", "link", "ghost", "danger"] }, size: { control: "inline-radio", options: ["sm", "md", "lg"] } },
};
export default meta;
type S = StoryObj<typeof Button>;
export const Playground: S = {};
const v = ["primary", "secondary", "tertiary", "link", "ghost", "danger"] as const;
export const AllVariants: S = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, auto)", gap: 16, alignItems: "center" }}>
      {v.map((x) => [<Button key={x} variant={x}>Button</Button>, <Button key={x + "s"} variant={x} size="sm">Mini</Button>, <Button key={x + "i"} variant={x} iconLeft={Plus}>Add widget</Button>, <Button key={x + "d"} variant={x} disabled>Disabled</Button>])}
    </div>
  ),
};
export const Loading: S = { args: { loading: true, children: "Publishing" } };
export const WithIcon: S = { args: { iconRight: ArrowRight, children: "Continue", size: "lg" } };
export const IconButtons: S = {
  render: () => (
    <div style={{ display: "flex", gap: 12 }}>
      <IconButton icon={Repeat} label="Switch store" /><IconButton icon={Eye} label="Preview" /><IconButton icon={Bell} label="Notifications" />
      <IconButton icon={Heart} label="Like" variant="outline" /><IconButton icon={Heart} label="Active" active /><IconButton icon={Plus} label="Add" variant="solid" />
    </div>
  ),
};
