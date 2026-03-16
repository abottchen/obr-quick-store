# Quick Store

An [Owlbear Rodeo](https://www.owlbear.rodeo/) extension that lets GMs present interactive storefronts to players during tabletop RPG sessions.

## Features

- **GM Configuration Panel** — Select item groups, set price adjustments, name the store and shopkeeper (or randomize them)
- **Interactive Storefront** — Floating popover displayed to all players with item cards colored by rarity
- **Shared Cart** — Players click items to add them to a synced cart with per-player subtotals and a grand total
- **Item Descriptions** — Right-click any item card to view its full description
- **Minimize/Maximize** — Each player can collapse the storefront to a title bar without affecting others
- **Catalog Import** — Upload a JSON file to define your own item catalog

## Installation

1. Open Owlbear Rodeo and go to the extensions menu
2. Paste the following manifest URL:

```
https://abottchen.github.io/obr-quick-store/manifest.json
```

## Usage

### As the GM

1. Click the **Quick Store** button in the toolbar to open the configuration panel
2. Import a catalog JSON file or use the built-in starter items
3. Select which item groups to include in the store
4. Set a price adjustment percentage (e.g., 150% for a markup, 75% for a discount)
5. Enter or randomize the store name and shopkeeper name
6. Click **Open Store** to present the storefront to all players
7. Click **Close Store** when shopping is done

### As a Player

1. Browse items in the storefront when the GM opens a store
2. Left-click an item to add it to your cart
3. Right-click an item to view its description
4. Right-click a cart entry to remove it
5. Use the minimize button to collapse the storefront out of the way

## Catalog Format

Import a JSON file containing an array of items:

```json
[
  {
    "name": "Healing Potion",
    "type": "Potion",
    "rarity": "common",
    "description": "Restores 2d4+2 hit points.",
    "image": "",
    "price": 50,
    "itemGrouping": "Potions"
  }
]
```

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Item display name |
| `type` | string | Category label (e.g., "Weapon", "Armor", "Potion") |
| `rarity` | string | One of: `common`, `uncommon`, `rare`, `very rare`, `legendary` |
| `description` | string | Shown on right-click |
| `image` | string | URL to an item image (optional, leave empty for a placeholder) |
| `price` | number | Base price in gold pieces |
| `itemGrouping` | string | Group name for filtering (e.g., "Weapons", "Potions") |

## Development

```bash
npm install
npm run dev
```

The dev server runs with CORS configured for `https://www.owlbear.rodeo`. Use the Owlbear Rodeo extension dev tools to load the local manifest.

## Building

```bash
npm run build
```

Output is written to `dist/`. Deployment to GitHub Pages is handled automatically via GitHub Actions on push to `main`.
