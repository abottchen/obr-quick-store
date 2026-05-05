import OBR from "@owlbear-rodeo/sdk";
import { getPlayerCart, setPlayerCart, clearAllCarts } from "./metadata";
import type { CartEntry, PlayerCartEntry, StoreItem } from "./types";

// Serial queue to prevent same-client races (e.g. rapid clicks).
// Each cart mutation awaits the previous one before reading state.
let cartQueue: Promise<void> = Promise.resolve();

function enqueue(fn: () => Promise<void>): Promise<void> {
  const operation = cartQueue.then(fn);
  cartQueue = operation.catch(() => {});
  return operation;
}

export function addToCart(
  item: StoreItem,
  adjustedPrice: number
): Promise<void> {
  return enqueue(async () => {
    const playerId = OBR.player.id;
    const [playerName, playerColor] = await Promise.all([
      OBR.player.getName(),
      OBR.player.getColor(),
    ]);

    const current = await getPlayerCart(playerId);
    const entries: PlayerCartEntry[] = current ? [...current.entries] : [];

    const existing = entries.find((e) => e.itemName === item.name);
    if (existing) {
      existing.quantity += 1;
    } else {
      entries.push({
        itemName: item.name,
        itemPrice: adjustedPrice,
        itemCurrency: item.currency ?? "gp",
        quantity: 1,
      });
    }

    await setPlayerCart(playerId, { entries, playerName, playerColor });
  });
}

export function removeOneFromCart(
  itemName: string,
  playerId: string
): Promise<void> {
  return enqueue(async () => {
    const current = await getPlayerCart(playerId);
    if (!current) return;

    const entries: PlayerCartEntry[] = [];
    for (const e of current.entries) {
      if (e.itemName === itemName) {
        if (e.quantity > 1) {
          entries.push({ ...e, quantity: e.quantity - 1 });
        }
      } else {
        entries.push(e);
      }
    }

    await setPlayerCart(playerId, {
      entries,
      playerName: current.playerName,
      playerColor: current.playerColor,
    });
  });
}

export function removeItemFromCart(
  itemName: string,
  playerId: string
): Promise<void> {
  return enqueue(async () => {
    const current = await getPlayerCart(playerId);
    if (!current) return;

    const entries = current.entries.filter((e) => e.itemName !== itemName);
    await setPlayerCart(playerId, {
      entries,
      playerName: current.playerName,
      playerColor: current.playerColor,
    });
  });
}

export async function clearCart(): Promise<void> {
  await clearAllCarts();
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
