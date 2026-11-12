import type { Meta, StoryObj } from "@storybook/react-vite";
import * as L from "lucide-react";
import { Icon } from "../icons/Icon";
import "./foundations.css";

const meta: Meta = { title: "Foundations", parameters: { layout: "padded" } };
export default meta;
type S = StoryObj;

const ramps: [string, string, number[]][] = [
  ["Primary · Purple", "purple", [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]],
  ["Secondary · Yellow (warning)", "yellow", [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]],
  ["Tertiary · Orange", "orange", [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]],
  ["Neutral · Grey", "grey", [0, 25, 50, 100, 150, 200, 300, 400, 500, 600, 700, 800, 900, 1000]],
  ["Success · Green", "green", [50, 100, 200, 500, 700, 800]],
  ["Error · Red", "red", [50, 100, 200, 400, 500, 700]],
  ["Info · Blue", "blue", [50, 100, 200, 400, 500, 700]],
];
const read = (v: string) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();

export const Colors: S = {
  render: () => (
    <div className="fd">
      <h1>Colour</h1>
      <p className="fd-lead">Vajro purple <code>#741FF3</code> drives every interactive state. Two grey scales in the 2023 file (DS sheet vs. shipped screens) are merged into one neutral ramp.</p>
      {ramps.map(([name, key, steps]) => (
        <section key={key}><h3>{name}</h3>
          <div className="fd-ramp">{steps.map((s) => (
            <div key={s} className="fd-sw"><span style={{ background: `var(--${key}-${s})` }} /><b>{s}</b><small>{read(`--${key}-${s}`)}</small></div>
          ))}</div>
        </section>
      ))}
      <section><h3>Semantic (switch the toolbar theme)</h3>
        <div className="fd-sem">{["bg-canvas", "bg-app", "bg-surface", "bg-subtle", "bg-muted", "text", "text-secondary", "text-tertiary", "text-placeholder", "border", "border-strong", "accent", "accent-hover", "accent-soft", "accent-text", "success-solid", "warning-solid", "error-solid", "info-solid"].map((t) => (
          <div key={t}><span style={{ background: `var(--${t})` }} /><code>--{t}</code></div>
        ))}</div>
      </section>
    </div>
  ),
};

const type: [string, string, string, number][] = [
  ["Display", "4xl", "SemiBold", 600], ["Heading 1", "3xl", "SemiBold", 600], ["Heading 2", "2xl", "SemiBold", 600], ["Heading 3", "xl", "SemiBold", 600],
  ["Title", "lg", "Medium", 500], ["Body", "md", "Regular", 400], ["Body strong", "md", "Medium", 500], ["Caption", "sm", "Regular", 400], ["Micro", "xs", "Medium", 500],
];
export const Typography: S = {
  render: () => (
    <div className="fd">
      <h1>Typography</h1>
      <p className="fd-lead">Poppins throughout. Scale taken from what the shipped screens actually use (14/20 body, 12/20 captions).</p>
      <div className="fd-type">{type.map(([n, k, w, wt]) => (
        <div key={n}><small>{n} · {read(`--text-${k}`)}/{read(`--lh-${k}`)} · {w}</small>
          <p style={{ fontSize: `var(--text-${k})`, lineHeight: `var(--lh-${k})`, fontWeight: wt, margin: 0 }}>Build your store's app in minutes</p></div>
      ))}</div>
    </div>
  ),
};

export const RadiusAndElevation: S = {
  name: "Radius & elevation",
  render: () => (
    <div className="fd">
      <h1>Radius & elevation</h1>
      <div className="fd-row">{["xs", "sm", "md", "lg", "xl", "2xl", "pill"].map((r) => <div key={r} className="fd-box" style={{ borderRadius: `var(--radius-${r})` }}>{r}<small>{read(`--radius-${r}`)}</small></div>)}</div>
      <div className="fd-row">{["xs", "sm", "md", "lg", "device"].map((s) => <div key={s} className="fd-box fd-box--shadow" style={{ boxShadow: `var(--shadow-${s})` }}>{s}</div>)}</div>
    </div>
  ),
};

const iconNames = ["ArrowDown","ArrowUp","ArrowLeft","ArrowRight","User","Users","UserMinus","UserPlus","UserCheck","UserX","BellOff","Trash2","ChevronRight","ChevronDown","ChevronLeft","ChevronUp","TrendingDown","TrendingUp","Maximize","Maximize2","HelpCircle","Truck","ShoppingCart","ShoppingBag","MessageSquare","Search","Eye","Bell","Lock","Unlock","Camera","Video","Mic","Film","Image","Clock","ExternalLink","Volume2","Filter","Share","Upload","Download","LogIn","LogOut","Smartphone","Flag","CreditCard","Star","Gift","PenTool","File","FileText","Bookmark","Headphones","MapPin","Calendar","Settings","Move","ThumbsUp","ThumbsDown","Phone","Globe","Edit","Crop","Tag","Home","Heart","Mail","Clipboard","Link2","Award","Plus","Grid","AlertTriangle","XCircle","X","Info","Check","MoreHorizontal","Repeat","GripVertical","Copy","Layers","Undo2","Redo2"] as const;
export const Icons: S = {
  render: () => (
    <div className="fd">
      <h1>Icons</h1>
      <p className="fd-lead">Feather-style strokes via <code>lucide-react</code>, matching the DS set 1:1. Stroke follows the DS grid: 12px → 1, 16px → 1.3, 20px → 1.6.</p>
      <div className="fd-icons">{iconNames.map((n) => { const I = (L as unknown as Record<string, L.LucideIcon>)[n]; return I ? <div key={n}><Icon icon={I} size={20} /><small>{n}</small></div> : null; })}</div>
    </div>
  ),
};
