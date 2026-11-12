import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Home, Smartphone, Settings, LayoutGrid } from "lucide-react";
import { Tabs } from "./Tabs";
import { NavItem } from "../NavItem/NavItem";
import { Breadcrumbs } from "../Breadcrumbs/Breadcrumbs";
import { Menu } from "../Menu/Menu";
import { Button } from "../Button/Button";
import { ChevronDown, Copy, Edit, Eye, Trash2, Send } from "lucide-react";
const meta: Meta = { title: "Components/Navigation", parameters: { layout: "padded" } };
export default meta;
type S = StoryObj;
export const UnderlineTabs: S = { render: () => { const [v, s] = useState("home"); return <Tabs value={v} onChange={s} items={["Home", "PDP", "PLP", "Cart"].map((x) => ({ value: x.toLowerCase(), label: x }))} />; } };
export const VerticalNav: S = {
  render: () => { const [v, s] = useState("builder"); const [o, so] = useState(true); return (
    <div style={{ width: 240, display: "grid", gap: 4 }}>
      <NavItem icon={Home} active={v === "home"} onClick={() => s("home")}>Dashboard</NavItem>
      <NavItem icon={Smartphone} expandable expanded={o} onClick={() => so(!o)}>App</NavItem>
      {o && <><NavItem sub active={v === "builder"} onClick={() => s("builder")}>App builder</NavItem><NavItem sub active={v === "brand"} onClick={() => s("brand")}>Branding</NavItem></>}
      <NavItem icon={LayoutGrid} active={v === "int"} onClick={() => s("int")}>Integrations</NavItem>
      <NavItem icon={Settings} active={v === "set"} onClick={() => s("set")}>Settings</NavItem>
    </div>); },
};
export const Crumbs: S = { render: () => <Breadcrumbs items={[{ label: "Home" }, { label: "App builder" }, { label: "Diwali clearance sale" }]} /> };
export const DropdownMenu: S = {
  render: () => (
    <div style={{ height: 260 }}>
      <Menu trigger={({ toggle, props }) => <Button variant="secondary" iconRight={ChevronDown} onClick={toggle} {...props}>Actions</Button>}
        items={[{ key: "e", label: "Edit", icon: Edit }, { key: "p", label: "Preview", icon: Eye }, { key: "d", label: "Duplicate", icon: Copy }, { key: "pub", label: "Publish app", icon: Send }, { key: "x", type: "divider" }, { key: "del", label: "Delete", icon: Trash2, danger: true }]} />
    </div>
  ),
};
