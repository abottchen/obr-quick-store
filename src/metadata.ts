import OBR, { Metadata } from "@owlbear-rodeo/sdk";
import { METADATA_KEY, DEFAULT_CONFIG, DEFAULT_CART } from "./constants";
import type { QuickStoreMetadata } from "./types";

const DEFAULTS: QuickStoreMetadata = {
  config: { ...DEFAULT_CONFIG },
  cart: { ...DEFAULT_CART },
};

function extractStoreData(metadata: Metadata): QuickStoreMetadata {
  const raw = metadata[METADATA_KEY] as Partial<QuickStoreMetadata> | undefined;
  if (!raw) return { config: { ...DEFAULTS.config }, cart: { entries: [] } };
  return {
    config: { ...DEFAULTS.config, ...raw.config },
    cart: raw.cart ?? { entries: [] },
  };
}

export async function getStoreMetadata(): Promise<QuickStoreMetadata> {
  const metadata = await OBR.room.getMetadata();
  return extractStoreData(metadata);
}

export async function setStoreMetadata(
  partial: Partial<QuickStoreMetadata>
): Promise<void> {
  const current = await getStoreMetadata();
  const updated = { ...current, ...partial };
  await OBR.room.setMetadata({ [METADATA_KEY]: updated });
}

export function onStoreMetadataChange(
  callback: (data: QuickStoreMetadata) => void
): () => void {
  return OBR.room.onMetadataChange((metadata) => {
    callback(extractStoreData(metadata));
  });
}
