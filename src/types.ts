export type Rarity = "common" | "uncommon" | "rare" | "very rare" | "legendary";
export type Currency = "gp" | "sp" | "cp" | "pp";

export interface StoreItem {
  name: string;
  type: string;
  rarity: Rarity;
  description: string;
  image: string;
  price: number;
  currency: Currency;
  itemGrouping: string[];
}

export interface StoreConfig {
  activeGroupings: string[];
  priceAdjustment: number;
  npcName: string;
  storeName: string;
  isOpen: boolean;
}

export interface CartEntry {
  itemName: string;
  itemPrice: number;
  itemCurrency: Currency;
  quantity: number;
  playerId: string;
  playerName: string;
  playerColor: string;
}

export interface CartState {
  entries: CartEntry[];
}

export interface QuickStoreMetadata {
  catalog: StoreItem[];
  config: StoreConfig;
  cart: CartState;
}
