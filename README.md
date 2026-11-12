# Needle · Vajro design system

Vajro's web design system, rebuilt as code from the original 2023 Figma library. Tokens, icons and React components, documented in Storybook with light and dark themes.

Used by the [Vajro App Builder prototype](https://github.com/sridhar6220/Vajro).

## Run it

```bash
npm install
npm run storybook        # http://localhost:6007
npm run build-storybook  # static site in storybook-static/
```

## Structure

- `src/tokens/tokens.css` · primitives (purple, yellow, orange, grey, green, red, blue) and semantic tokens for light and dark
- `src/components/*` · one folder per component (`.tsx`, `.css`, stories)
- `src/icons/Icon.tsx` · Feather-style icons via `lucide-react`, stroke matched to the DS grid
- `src/index.ts` · public exports

## Changes from the 2023 Figma file

1. One neutral grey scale (the DS sheet and the screens used two)
2. Fixed layer names: secondary/tertiary swatches were named `Primary/*`
3. Warning maps to the yellow palette
4. Softer 1px input borders with a purple focus ring
5. Dark theme at the token layer
6. Empty states designed from scratch
7. Motion: sliding indicators, spring switches, rising toasts

## Deploy

Vercel reads `vercel.json`: `npm ci`, `npm run build-storybook`, output `storybook-static`.

---
Designed and directed by Sridhar Swaminathan · [sridharsniper.com](https://www.sridharsniper.com)
