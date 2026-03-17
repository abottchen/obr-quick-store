import OBR from "@owlbear-rodeo/sdk";
import type { StoreItem } from "./types";

const VALID_RARITIES = ["common", "uncommon", "rare", "very rare", "legendary"];
const VALID_CURRENCIES = ["gp", "sp", "cp", "pp"];

let cachedUrl: string | null = null;
let cachedCatalog: StoreItem[] = [];

function validateCatalog(data: unknown): data is StoreItem[] {
  if (!Array.isArray(data)) return false;
  return data.every(
    (item) =>
      typeof item.name === "string" &&
      typeof item.type === "string" &&
      typeof item.rarity === "string" &&
      VALID_RARITIES.includes(item.rarity) &&
      typeof item.description === "string" &&
      typeof item.price === "number" &&
      Array.isArray(item.itemGrouping) &&
      item.itemGrouping.every((g: unknown) => typeof g === "string") &&
      (item.currency === undefined || VALID_CURRENCIES.includes(item.currency))
  );
}

export async function fetchCatalog(
  url: string,
  forceRefresh = false
): Promise<StoreItem[]> {
  if (!forceRefresh && url === cachedUrl && cachedCatalog.length > 0) {
    return cachedCatalog;
  }

  try {
    const fetchUrl = forceRefresh
      ? `${url}${url.includes("?") ? "&" : "?"}t=${Date.now()}`
      : url;
    const response = await fetch(fetchUrl, { cache: "no-cache" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    if (!validateCatalog(data)) {
      await OBR.notification.show(
        "Invalid catalog format at the configured URL.",
        "ERROR"
      );
      return cachedCatalog;
    }
    cachedUrl = url;
    cachedCatalog = data;
    return data;
  } catch (err) {
    await OBR.notification.show(
      `Failed to fetch catalog: ${err instanceof Error ? err.message : "unknown error"}`,
      "ERROR"
    );
    return cachedCatalog;
  }
}

export function clearCatalogCache(): void {
  cachedUrl = null;
  cachedCatalog = [];
}
