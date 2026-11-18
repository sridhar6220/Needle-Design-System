import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Inbox, Smartphone } from "../../icons";
import { Modal } from "./Modal";
import { Button } from "../Button/Button";
import { TextField, TextArea } from "../TextField/TextField";
import { ToastProvider, useToast } from "../Toast/Toast";
import { Badge, Tag } from "../Tag/Tag";
import { Tooltip } from "../Tooltip/Tooltip";
import { Banner } from "../Banner/Banner";
import { EmptyState } from "../EmptyState/EmptyState";
import { Avatar } from "../Avatar/Avatar";
import { Spinner } from "../Spinner/Spinner";
const meta: Meta = { title: "Components/Feedback & overlays", parameters: { layout: "padded" } };
export default meta;
type S = StoryObj;
export const PublishModal: S = {
  render: () => { const [o, so] = useState(true); return (<>
    <Button onClick={() => so(true)}>Publish</Button>
    <Modal open={o} onClose={() => so(false)} title="Add title and description" description="Before publishing, add a title and a short note about what changed in this version."
      footer={<><Button variant="secondary" onClick={() => so(false)}>Cancel</Button><Button onClick={() => so(false)}>Publish</Button></>}>
      <div style={{ display: "grid", gap: 16 }}><TextField label="Title" required defaultValue="Diwali clearance sale" /><TextArea label="Description" placeholder="Description about this version of the app" /></div>
    </Modal></>); },
};
function ToastDemo() {
  const t = useToast();
  return <div style={{ display: "flex", gap: 8 }}>
    <Button onClick={() => t({ title: "Saved as draft", description: "You can pick up where you left off." })}>Success</Button>
    <Button variant="secondary" onClick={() => t({ tone: "error", title: "Couldn't publish", description: "Check your connection and try again." })}>Error</Button>
    <Button variant="secondary" onClick={() => t({ tone: "info", title: "Widget deleted", action: { label: "Undo", onClick: () => {} } })}>With action</Button>
  </div>;
}
export const Toasts: S = { render: () => <ToastProvider><ToastDemo /></ToastProvider> };
export const BadgesAndTags: S = {
  render: () => <div style={{ display: "grid", gap: 16 }}>
    <div style={{ display: "flex", gap: 8 }}><Badge tone="success" dot>Published</Badge><Badge tone="warning" dot>Draft</Badge><Badge tone="error">Failed</Badge><Badge tone="info">Info</Badge><Badge tone="accent">New</Badge><Badge>Archived</Badge></div>
    <div style={{ display: "flex", gap: 8 }}><Tag onRemove={() => {}}>Men</Tag><Tag onRemove={() => {}}>Women</Tag><Tag>Kids</Tag></div>
  </div>,
};
export const Banners: S = {
  render: () => <div style={{ display: "grid", gap: 12, maxWidth: 560 }}>
    <Banner tone="info" action={{ label: "View details", onClick: () => {} }}>Your app is in preview. Publish to make it live.</Banner>
    <Banner tone="success" onClose={() => {}}>Version 29 restored.</Banner>
    <Banner tone="warning">You have unsaved changes on this page.</Banner>
    <Banner tone="error">The image is larger than 5 MB.</Banner>
    <Banner tone="info" variant="solid" action={{ label: "View details", onClick: () => {} }}>This is an info banner, shown at the top of the product.</Banner>
  </div>,
};
export const Misc: S = {
  render: () => <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
    <Tooltip content="Preview app"><Button variant="secondary">Hover me</Button></Tooltip>
    <div style={{ display: "flex", gap: 8 }}><Avatar name="Sridhar S" size="xs" /><Avatar name="Ganesh Kumar" /><Avatar name="Manoj" size="md" /><Avatar name="Vilva" size="lg" /></div>
    <div style={{ display: "flex", gap: 12, color: "var(--accent)" }}><Spinner size="xs" /><Spinner /><Spinner size="md" /><Spinner size="lg" /></div>
  </div>,
};
export const EmptyStates: S = {
  render: () => <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
    <EmptyState icon={Smartphone} title="No apps built yet" actions={<Button>+ Create new app</Button>}>Start your first app. Pick a template, let AI style it from your store, or build from scratch.</EmptyState>
    <EmptyState compact icon={Inbox} title="No widgets match “video”">Try a different word, or browse all categories.</EmptyState>
  </div>,
};
