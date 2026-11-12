import type { Preview, Decorator } from "@storybook/react-vite";
import { createElement as h, useEffect, useState, type ReactNode } from "react";
import { DocsContainer, type DocsContainerProps } from "@storybook/addon-docs/blocks";
import { create } from "storybook/theming";
import "../src/styles/global.css";

type Theme = "light" | "dark" | "side";
const font = '"Poppins", system-ui, sans-serif';
const docsLight = create({ base: "light", colorSecondary: "#741ff3", appContentBg: "#ffffff", fontBase: font });
const docsDark = create({
  base: "dark", colorSecondary: "#a46ff8", appBg: "#0e0e11", appContentBg: "#0e0e11", appPreviewBg: "#0e0e11",
  appBorderColor: "#2a2a31", barBg: "#151519", inputBg: "#151519", textColor: "#f1f1f4", textMutedColor: "#9a9aa6", fontBase: font,
});
const setRoot = (t: Theme) => document.documentElement.setAttribute("data-theme", t === "dark" ? "dark" : "light");

/** Docs pages render outside the story decorator, so they follow the toolbar theme on their own. */
function ThemedDocsContainer(props: DocsContainerProps & { children?: ReactNode }) {
  type G = { globals: Record<string, unknown> };
  const ctx = props.context as unknown as {
    channel: { on: (e: string, f: (p: G) => void) => void; off: (e: string, f: (p: G) => void) => void };
    store?: { userGlobals?: { globals?: Record<string, unknown> } };
  };
  const [theme, setTheme] = useState<Theme>((ctx.store?.userGlobals?.globals?.theme as Theme) || "light");
  useEffect(() => {
    const on = ({ globals }: G) => setTheme((globals?.theme as Theme) || "light");
    ctx.channel.on("globalsUpdated", on);
    return () => ctx.channel.off("globalsUpdated", on);
  }, [ctx.channel]);
  useEffect(() => setRoot(theme), [theme]);
  return h(DocsContainer, { ...props, theme: theme === "dark" ? docsDark : docsLight }, props.children);
}

/** Applies the toolbar theme. "Side by side" renders the story in light and dark. */
const withTheme: Decorator = (Story, ctx) => {
  const theme = (ctx.globals.theme as Theme) || "light";
  useEffect(() => setRoot(theme), [theme]);
  if (theme !== "side" || ctx.viewMode === "docs") return h(Story);
  const pane = (t: "light" | "dark") =>
    h("div", { "data-theme": t, style: { background: "var(--bg-canvas)", color: "var(--text)", padding: 24, minHeight: "100%" } },
      h("div", { style: { font: "500 11px/16px var(--font-sans)", letterSpacing: ".06em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: 16 } }, t),
      h(Story));
  return h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "100vh", margin: "-1rem" } }, pane("light"), pane("dark"));
};

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Colour theme",
      toolbar: {
        title: "Theme", icon: "mirror", dynamicTitle: true,
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
          { value: "side", title: "Side by side", icon: "sidebyside" },
        ],
      },
    },
  },
  initialGlobals: { theme: "light" },
  decorators: [withTheme],
  parameters: {
    layout: "centered",
    docs: { container: ThemedDocsContainer },
    controls: { matchers: { color: /(background|color)$/i } },
    options: { storySort: { order: ["Introduction", "Foundations", "Components", "Patterns"] } },
    a11y: { test: "todo" },
    backgrounds: { disable: true },
  },
};
export default preview;
