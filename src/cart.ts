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
      itemCurrency: item.currency ?? "gp",
      quantity: 1,
      playerId,
      playerName,
      playerColor,
    });
  }

  await setStoreMetadata({ cart: { entries } });
}

export async function removeOneFromCart(
  itemName: string,
  playerId: string
): Promise<void> {
  const data = await getStoreMetadata();
  const entries: CartEntry[] = [];

  for (const e of data.cart.entries) {
    if (e.itemName === itemName && e.playerId === playerId) {
      if (e.quantity > 1) {
        entries.push({ ...e, quantity: e.quantity - 1 });
      }
    } else {
      entries.push(e);
    }
  }

  await setStoreMetadata({ cart: { entries } });
}

export async function clearCart(): Promise<void> {
  await setStoreMetadata({ cart: { entries: [] } });
}

export interface CurrencyBreakdown {
  pp: number;
  gp: number;
  sp: number;
  cp: number;
}

const TO_COPPER: Record<string, number> = {
  cp: 1,
  sp: 10,
  gp: 100,
  pp: 1000,
};

function toCopper(amount: number, currency: string): number {
  return amount * (TO_COPPER[currency] ?? 100);
}

function computeBreakdown(entries: CartEntry[]): CurrencyBreakdown {
  let ppTotal = 0;
  let nonPpCopper = 0;

  for (const e of entries) {
    const currency = e.itemCurrency ?? "gp";
    const lineTotal = e.itemPrice * e.quantity;
    if (currency === "pp") {
      ppTotal += lineTotal;
    } else {
      nonPpCopper += toCopper(lineTotal, currency);
    }
  }

  const gp = Math.floor(nonPpCopper / 100);
  const remaining = nonPpCopper % 100;
  const sp = Math.floor(remaining / 10);
  const cp = remaining % 10;

  return { pp: ppTotal, gp, sp, cp };
}

export function getPlayerBreakdown(
  entries: CartEntry[],
  playerId: string
): CurrencyBreakdown {
  return computeBreakdown(entries.filter((e) => e.playerId === playerId));
}

export function getTotalBreakdown(entries: CartEntry[]): CurrencyBreakdown {
  return computeBreakdown(entries);
}
