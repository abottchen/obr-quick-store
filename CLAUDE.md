# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev Commands

```bash
npm run dev      # Vite dev server (CORS configured for https://www.owlbear.rodeo)
npm run build    # tsc type-check + Vite bundle to dist/
npx tsc --noEmit # Type-check only
```

No test framework is configured.

## Architecture

This is an **Owlbear Rodeo extension** — a browser-based plugin for the OBR tabletop RPG platform. It provides GMs with an interactive storefront to sell items to players during sessions. The only runtime dependency is `@owlbear-rodeo/sdk`.

### Two Entry Points

The extension runs in two separate popover windows, each with its own HTML entry point and bootstrap module:

- **Config panel** (`index.html` → `src/main.ts`) — GM toolbar button opens this. GMs see store configuration (name, NPC, price adjustment, item group filters, open/close). Players see a "GM only" message. Also listens for broadcast messages to open the storefront popover.
- **Storefront** (`store.html` → `src/store.ts`) — Opened as a second popover when GM opens the store. Shows the item list and shared cart to all players.

### State Management

All shared state lives in **OBR room metadata** under key `com.abottchen.obr-quick-store/data`, shaped as `QuickStoreMetadata` (defined in `types.ts`): catalog, config, and cart. There is no external state library — `metadata.ts` wraps get/set/subscribe on OBR's metadata API.

Inter-client signaling (open/close store) uses OBR's broadcast channel (`com.abottchen.obr-quick-store/store-control`).

### Key Modules

| Module | Role |
|--------|------|
| `metadata.ts` | Get/set/subscribe to room metadata (the single source of truth) |
| `ui-config.ts` | GM config panel rendering and event binding |
| `ui-store.ts` | Storefront rendering: item list (grouped by `type`), cart, descriptions |
| `cart.ts` | Cart add/remove, currency conversion (pp/gp/sp/cp ↔ copper base), subtotals |
| `import-catalog.ts` | JSON catalog import with field validation |
| `types.ts` | All shared interfaces |
| `constants.ts` | Extension ID, rarity/currency color maps, default config |
| `styles.ts`, `styles-config.ts`, `styles-store.ts` | CSS-in-JS strings injected at runtime |

### Data Model

- **`StoreItem.itemGrouping`** is a `string[]` — controls which items appear when a group is active (any match = shown). Items are *displayed* grouped by their `type` field, not by itemGrouping.
- **Price adjustment** is applied at render time (`basePrice * adjustment / 100`), not stored on cart entries.
- **Cart entries** are per-player (keyed by OBR `playerId`). All players see the full cart; GMs can remove any entry.

### Styling

Dark theme with rarity-colored item borders/gradients and currency-colored price text. Styles are string constants injected into `<style>` tags — no CSS files or preprocessors.

### Deployment

GitHub Pages at `abottchen.github.io/obr-quick-store`. Vite uses relative base path (`./`). Built output goes to `dist/`. Deployment is automated via GitHub Actions on push to `main`.
