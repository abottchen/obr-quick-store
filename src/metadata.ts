import OBR, { Metadata } from "@owlbear-rodeo/sdk";
import { CONFIG_KEY, CART_KEY_PREFIX, METADATA_KEY, DEFAULT_CONFIG } from "./constants";
import type { StoreConfig, PlayerCart, CartEntry, CartState } from "./types";

// --- Config operations ---

export async function getConfigMetadata(): Promise<StoreConfig> {
  const metadata = await OBR.room.getMetadata();
  return extractConfig(metadata);
}

function extractConfig(metadata: Metadata): StoreConfig {
  const config = metadata[CONFIG_KEY] as Partial<StoreConfig> | undefined;
  if (config) {
    return { ...DEFAULT_CONFIG, ...config };
  }

  // Migration: fall back to legacy single-key format
  const legacy = metadata[METADATA_KEY] as { config?: Partial<StoreConfig> } | undefined;
  if (legacy?.config) {
    return { ...DEFAULT_CONFIG, ...legacy.config };
  }

  return { ...DEFAULT_CONFIG };
}

export async function setConfigMetadata(config: StoreConfig): Promise<void> {
  await OBR.room.setMetadata({ [CONFIG_KEY]: config });
}

let configQueue: Promise<void> = Promise.resolve();

export function updateConfigMetadata(
  updater: (current: StoreConfig) => StoreConfig
): Promise<void> {
  const operation = configQueue.then(async () => {
    const current = await getConfigMetadata();
    const updated = updater(current);
    await OBR.room.setMetadata({ [CONFIG_KEY]: updated });
  });
  configQueue = operation.catch(() => {});
  return operation;
}

// --- Per-player cart operations ---

export async function getPlayerCart(playerId: string): Promise<PlayerCart | null> {
  const metadata = await OBR.room.getMetadata();
  const cart = metadata[CART_KEY_PREFIX + playerId] as PlayerCart | undefined;
  return cart ?? null;
}

export async function setPlayerCart(playerId: string, cart: PlayerCart): Promise<void> {
  await OBR.room.setMetadata({ [CART_KEY_PREFIX + playerId]: cart });
}

export async function clearAllCarts(): Promise<void> {
  const metadata = await OBR.room.getMetadata();
  const clearKeys: Record<string, undefined> = {};
  for (const key of Object.keys(metadata)) {
    if (key.startsWith(CART_KEY_PREFIX)) {
      clearKeys[key] = undefined;
    }
  }
  if (Object.keys(clearKeys).length > 0) {
    await OBR.room.setMetadata(clearKeys);
  }
}

// --- Aggregation ---

function getAllCartsFromMetadata(metadata: Metadata): CartState {
  const entries: CartEntry[] = [];

  for (const [key, value] of Object.entries(metadata)) {
    if (!key.startsWith(CART_KEY_PREFIX)) continue;
    const playerId = key.slice(CART_KEY_PREFIX.length);
    const cart = value as PlayerCart | undefined;
    if (!cart?.entries) continue;

    for (const entry of cart.entries) {
      entries.push({
        ...entry,
        playerId,
        playerName: cart.playerName,
        playerColor: cart.playerColor,
      });
    }
  }

  return { entries };
}

// --- Subscription ---

export function onStoreDataChange(
  callback: (config: StoreConfig, cart: CartState) => void
): () => void {
  return OBR.room.onMetadataChange((metadata) => {
    const config = extractConfig(metadata);
    const cart = getAllCartsFromMetadata(metadata);
    callback(config, cart);
  });
}
