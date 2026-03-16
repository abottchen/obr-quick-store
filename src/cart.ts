import OBR from "@owlbear-rodeo/sdk";
import { getStoreMetadata, setStoreMetadata } from "./metadata";
import type { CartEntry, StoreItem } from "./types";

export async function addToCart(
  item: StoreItem,
  adjustedPrice: number
): Promise<void> {
  const playerId = OBR.player.id;
  const [playerName, playerColor] = await Promise.all([
    OBR.player.getName(),
    OBR.player.getColor(),
  ]);

  const data = await getStoreMetadata();
  const entries = [...data.cart.entries];

  const existing = entries.find(
    (e) => e.itemName === item.name && e.playerId === playerId
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    entries.push({
      itemName: item.name,
      itemPrice: adjustedPrice,
      quantity: 1,
      playerId,
      playerName,
      playerColor,
    });
  }

  await setStoreMetadata({ cart: { entries } });
}

export async function removeFromCart(
  itemName: string,
  playerId: string
): Promise<void> {
  const data = await getStoreMetadata();
  const entries = data.cart.entries.filter(
    (e) => !(e.itemName === itemName && e.playerId === playerId)
  );
  await setStoreMetadata({ cart: { entries } });
}

export async function clearCart(): Promise<void> {
  await setStoreMetadata({ cart: { entries: [] } });
}

export function getPlayerSubtotal(
  entries: CartEntry[],
  playerId: string
): number {
  return entries
    .filter((e) => e.playerId === playerId)
    .reduce((sum, e) => sum + e.itemPrice * e.quantity, 0);
}

export function getTotal(entries: CartEntry[]): number {
  return entries.reduce((sum, e) => sum + e.itemPrice * e.quantity, 0);
}
