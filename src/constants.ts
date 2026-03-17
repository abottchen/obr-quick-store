export const EXTENSION_ID = "com.abottchen.obr-quick-store";
export const METADATA_KEY = `${EXTENSION_ID}/data`;
export const BROADCAST_CHANNEL = `${EXTENSION_ID}/store-control`;
export const POPOVER_STORE_ID = `${EXTENSION_ID}/storefront`;

export const RARITY_COLORS: Record<string, string> = {
  common: "#6b6b6b",
  uncommon: "#1a7a1a",
  rare: "#1a3a7a",
  "very rare": "#5a1a7a",
  legendary: "#7a4a1a",
};

export const CURRENCY_COLORS: Record<string, string> = {
  gp: "#ffd700",
  sp: "#c0c0c0",
  cp: "#b87333",
  pp: "#d0d0d8",
};

export const DEFAULT_CONFIG = {
  activeGroupings: [] as string[],
  priceAdjustment: 100,
  npcName: "",
  storeName: "",
  isOpen: false,
};

export const DEFAULT_CART = {
  entries: [] as [],
};
