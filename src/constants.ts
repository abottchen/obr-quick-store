export const EXTENSION_ID = "com.abottchen.obr-quick-store";
export const METADATA_KEY = `${EXTENSION_ID}/data`;
export const BROADCAST_CHANNEL = `${EXTENSION_ID}/store-control`;
export const POPOVER_STORE_ID = `${EXTENSION_ID}/storefront`;

export const RARITY_COLORS: Record<string, string> = {
  common: "#6b6b6b",
  uncommon: "#2ecc71",
  rare: "#3498db",
  "very rare": "#9b59b6",
  legendary: "#e67e22",
};

export const CURRENCY_COLORS: Record<string, string> = {
  gp: "#ffd700",
  sp: "#c0c0c0",
  cp: "#b87333",
  pp: "#d0d0d8",
};

export const DEFAULT_CATALOG_URL = "./data/items.json";

export const DEFAULT_CONFIG = {
  catalogUrl: DEFAULT_CATALOG_URL,
  activeGroupings: [] as string[],
  priceAdjustment: 100,
  npcName: "",
  storeName: "",
  isOpen: false,
};

export const DEFAULT_CART = {
  entries: [] as [],
};
