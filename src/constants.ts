export const EXTENSION_ID = "com.abottchen.obr-quick-store";
export const METADATA_KEY = `${EXTENSION_ID}/data`; // Legacy key, kept for migration
export const CONFIG_KEY = `${EXTENSION_ID}/config`;
export const CART_KEY_PREFIX = `${EXTENSION_ID}/cart/`;
export const BROADCAST_CHANNEL = `${EXTENSION_ID}/store-control`;
export const POPOVER_STORE_ID = `${EXTENSION_ID}/storefront`;

export const RARITY_COLORS: Record<string, string> = {
  common: "#7a7a7a",
  uncommon: "#4db87a",
  rare: "#4a9edb",
  "very rare": "#a87bdb",
  legendary: "#e8943a",
};

export const CURRENCY_COLORS: Record<string, string> = {
  gp: "#e8c84a",
  sp: "#b8b8b8",
  cp: "#c47d3a",
  pp: "#c8c8d4",
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

