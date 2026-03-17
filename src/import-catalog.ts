import OBR from "@owlbear-rodeo/sdk";
import { setStoreMetadata } from "./metadata";
import type { StoreItem } from "./types";

const VALID_RARITIES = ["common", "uncommon", "rare", "very rare", "legendary"];
const VALID_CURRENCIES = ["gp", "sp", "cp", "pp"];

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
      typeof item.itemGrouping === "string" &&
      (item.currency === undefined || VALID_CURRENCIES.includes(item.currency))
  );
}

export function setupImportHandler(
  fileInput: HTMLInputElement,
  onImported: () => void
): void {
  fileInput.addEventListener("change", async () => {
    const file = fileInput.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!validateCatalog(data)) {
        await OBR.notification.show(
          "Invalid catalog format. Expected an array of items with name, type, rarity, description, price, and itemGrouping.",
          "ERROR"
        );
        fileInput.value = "";
        return;
      }

      await setStoreMetadata({ catalog: data });
      await OBR.notification.show(
        `Imported ${data.length} items successfully.`,
        "SUCCESS"
      );
      onImported();
    } catch {
      await OBR.notification.show(
        "Failed to parse JSON file.",
        "ERROR"
      );
    }

    fileInput.value = "";
  });
}
