import { addons } from "storybook/manager-api";
import { create } from "storybook/theming";
addons.setConfig({
  theme: create({
    base: "light",
    brandTitle: "Needle · Vajro design system",
    brandUrl: "https://www.sridharsniper.com",
    brandTarget: "_blank",
    colorSecondary: "#741ff3",
    fontBase: '"Poppins", system-ui, sans-serif',
  }),
});
