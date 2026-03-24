import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockOBR, resetOBR, setPlayer, getMetadataSnapshot } from "./obr-mock";

vi.mock("@owlbear-rodeo/sdk", () => ({ default: mockOBR }));

import { addToCart, removeOneFromCart, clearCart, getPlayerBreakdown, getTotalBreakdown } from "../src/cart";
import { CART_KEY_PREFIX } from "../src/constants";
import type { StoreItem, CartEntry } from "../src/types";

function makeItem(overrides: Partial<StoreItem> = {}): StoreItem {
  return {
    name: "Longsword",
    type: "Weapon",
    rarity: "common",
    description: "A standard longsword",
    image: "",
    price: 15,
    currency: "gp",
    itemGrouping: ["weapons"],
    ...overrides,
  };
}

describe("addToCart", () => {
  beforeEach(() => resetOBR());

  it("adds a new item to an empty cart", async () => {
    await addToCart(makeItem(), 15);

    const meta = getMetadataSnapshot();
    const cart = meta[CART_KEY_PREFIX + "player-1"] as any;
    expect(cart).toBeDefined();
    expect(cart.entries).toHaveLength(1);
    expect(cart.entries[0].itemName).toBe("Longsword");
    expect(cart.entries[0].quantity).toBe(1);
    expect(cart.entries[0].itemPrice).toBe(15);
    expect(cart.entries[0].itemCurrency).toBe("gp");
    expect(cart.playerName).toBe("Test Player");
    expect(cart.playerColor).toBe("#ff0000");
  });

  it("increments quantity when adding the same item again", async () => {
    await addToCart(makeItem(), 15);
    await addToCart(makeItem(), 15);

    const meta = getMetadataSnapshot();
    const cart = meta[CART_KEY_PREFIX + "player-1"] as any;
    expect(cart.entries).toHaveLength(1);
    expect(cart.entries[0].quantity).toBe(2);
  });

  it("adds different items as separate entries", async () => {
    await addToCart(makeItem({ name: "Longsword" }), 15);
    await addToCart(makeItem({ name: "Shield" }), 10);

    const meta = getMetadataSnapshot();
    const cart = meta[CART_KEY_PREFIX + "player-1"] as any;
    expect(cart.entries).toHaveLength(2);
    expect(cart.entries[0].itemName).toBe("Longsword");
    expect(cart.entries[1].itemName).toBe("Shield");
  });

  it("uses the adjusted price, not the item base price", async () => {
    await addToCart(makeItem({ price: 100 }), 75);

    const meta = getMetadataSnapshot();
    const cart = meta[CART_KEY_PREFIX + "player-1"] as any;
    expect(cart.entries[0].itemPrice).toBe(75);
  });

  it("writes to separate keys for different players", async () => {
    setPlayer({ id: "player-1", name: "Alice", color: "#ff0000" });
    await addToCart(makeItem({ name: "Longsword" }), 15);

    setPlayer({ id: "player-2", name: "Bob", color: "#0000ff" });
    await addToCart(makeItem({ name: "Shield" }), 10);

    const meta = getMetadataSnapshot();
    const cart1 = meta[CART_KEY_PREFIX + "player-1"] as any;
    const cart2 = meta[CART_KEY_PREFIX + "player-2"] as any;

    expect(cart1.entries).toHaveLength(1);
    expect(cart1.entries[0].itemName).toBe("Longsword");
    expect(cart1.playerName).toBe("Alice");

    expect(cart2.entries).toHaveLength(1);
    expect(cart2.entries[0].itemName).toBe("Shield");
    expect(cart2.playerName).toBe("Bob");
  });

  it("does not clobber another player's cart when adding", async () => {
    setPlayer({ id: "player-1", name: "Alice" });
    await addToCart(makeItem({ name: "Longsword" }), 15);

    setPlayer({ id: "player-2", name: "Bob" });
    await addToCart(makeItem({ name: "Shield" }), 10);

    // Verify player-1's cart is still intact
    const meta = getMetadataSnapshot();
    const cart1 = meta[CART_KEY_PREFIX + "player-1"] as any;
    expect(cart1.entries).toHaveLength(1);
    expect(cart1.entries[0].itemName).toBe("Longsword");
  });
});

describe("removeOneFromCart", () => {
  beforeEach(() => resetOBR());

  it("decrements quantity when more than one", async () => {
    await addToCart(makeItem(), 15);
    await addToCart(makeItem(), 15);
    await removeOneFromCart("Longsword", "player-1");

    const meta = getMetadataSnapshot();
    const cart = meta[CART_KEY_PREFIX + "player-1"] as any;
    expect(cart.entries).toHaveLength(1);
    expect(cart.entries[0].quantity).toBe(1);
  });

  it("removes the entry entirely when quantity reaches zero", async () => {
    await addToCart(makeItem(), 15);
    await removeOneFromCart("Longsword", "player-1");

    const meta = getMetadataSnapshot();
    const cart = meta[CART_KEY_PREFIX + "player-1"] as any;
    expect(cart.entries).toHaveLength(0);
  });

  it("does nothing for a nonexistent player cart", async () => {
    await removeOneFromCart("Longsword", "player-nonexistent");
    // Should not throw, no metadata key created
    const meta = getMetadataSnapshot();
    expect(meta[CART_KEY_PREFIX + "player-nonexistent"]).toBeUndefined();
  });

  it("does not affect other items in the same cart", async () => {
    await addToCart(makeItem({ name: "Longsword" }), 15);
    await addToCart(makeItem({ name: "Shield" }), 10);
    await removeOneFromCart("Longsword", "player-1");

    const meta = getMetadataSnapshot();
    const cart = meta[CART_KEY_PREFIX + "player-1"] as any;
    expect(cart.entries).toHaveLength(1);
    expect(cart.entries[0].itemName).toBe("Shield");
  });

  it("GM can remove from another player's cart", async () => {
    setPlayer({ id: "player-2", name: "Bob" });
    await addToCart(makeItem({ name: "Longsword" }), 15);

    // GM (different player) removes from player-2's cart
    setPlayer({ id: "gm-1", name: "GM", role: "GM" });
    await removeOneFromCart("Longsword", "player-2");

    const meta = getMetadataSnapshot();
    const cart = meta[CART_KEY_PREFIX + "player-2"] as any;
    expect(cart.entries).toHaveLength(0);
  });
});

describe("clearCart", () => {
  beforeEach(() => resetOBR());

  it("removes all player cart keys", async () => {
    setPlayer({ id: "player-1", name: "Alice" });
    await addToCart(makeItem({ name: "Longsword" }), 15);

    setPlayer({ id: "player-2", name: "Bob" });
    await addToCart(makeItem({ name: "Shield" }), 10);

    await clearCart();

    const meta = getMetadataSnapshot();
    expect(meta[CART_KEY_PREFIX + "player-1"]).toBeUndefined();
    expect(meta[CART_KEY_PREFIX + "player-2"]).toBeUndefined();
  });

  it("does not affect config metadata", async () => {
    const configKey = "com.abottchen.obr-quick-store/config";
    await mockOBR.room.setMetadata({ [configKey]: { storeName: "Test Shop" } });

    setPlayer({ id: "player-1" });
    await addToCart(makeItem(), 15);
    await clearCart();

    const meta = getMetadataSnapshot();
    expect(meta[configKey]).toEqual({ storeName: "Test Shop" });
  });
});

describe("concurrent operations", () => {
  beforeEach(() => resetOBR());

  it("two players adding sequentially don't clobber each other", async () => {
    // In real OBR, these are separate browser tabs writing to separate keys.
    // The architectural guarantee: writing to player-1's key never affects player-2's key.
    setPlayer({ id: "player-1", name: "Alice", color: "#ff0000" });
    await addToCart(makeItem({ name: "Longsword" }), 15);

    setPlayer({ id: "player-2", name: "Bob", color: "#0000ff" });
    await addToCart(makeItem({ name: "Shield" }), 10);

    const meta = getMetadataSnapshot();
    const cart1 = meta[CART_KEY_PREFIX + "player-1"] as any;
    const cart2 = meta[CART_KEY_PREFIX + "player-2"] as any;

    // Both carts exist independently with their respective items
    expect(cart1.entries).toHaveLength(1);
    expect(cart1.entries[0].itemName).toBe("Longsword");
    expect(cart2.entries).toHaveLength(1);
    expect(cart2.entries[0].itemName).toBe("Shield");
  });

  it("player adding while another player removes don't interfere", async () => {
    // Set up: player-2 already has an item
    setPlayer({ id: "player-2", name: "Bob", color: "#0000ff" });
    await addToCart(makeItem({ name: "Potion" }), 50);

    // player-1 adds (writes to player-1 key only)
    setPlayer({ id: "player-1", name: "Alice", color: "#ff0000" });
    await addToCart(makeItem({ name: "Longsword" }), 15);

    // player-2 removes (writes to player-2 key only)
    await removeOneFromCart("Potion", "player-2");

    const meta = getMetadataSnapshot();
    const cart1 = meta[CART_KEY_PREFIX + "player-1"] as any;
    const cart2 = meta[CART_KEY_PREFIX + "player-2"] as any;

    expect(cart1.entries).toHaveLength(1);
    expect(cart1.entries[0].itemName).toBe("Longsword");
    expect(cart2.entries).toHaveLength(0);
  });

  it("same player rapid-clicking adds all items (serialized by key isolation)", async () => {
    // Fire 5 adds concurrently for the same player and item
    const promises = [];
    for (let i = 0; i < 5; i++) {
      promises.push(addToCart(makeItem({ name: "Longsword" }), 15));
    }
    await Promise.all(promises);

    const meta = getMetadataSnapshot();
    const cart = meta[CART_KEY_PREFIX + "player-1"] as any;
    expect(cart.entries).toHaveLength(1);
    expect(cart.entries[0].quantity).toBe(5);
  });
});

describe("currency breakdown", () => {
  const entries: CartEntry[] = [
    { itemName: "Longsword", itemPrice: 15, itemCurrency: "gp", quantity: 2, playerId: "p1", playerName: "A", playerColor: "#f00" },
    { itemName: "Shield", itemPrice: 10, itemCurrency: "gp", quantity: 1, playerId: "p1", playerName: "A", playerColor: "#f00" },
    { itemName: "Potion", itemPrice: 50, itemCurrency: "gp", quantity: 1, playerId: "p2", playerName: "B", playerColor: "#00f" },
  ];

  it("calculates total breakdown across all players", () => {
    const total = getTotalBreakdown(entries);
    // 15*2 + 10 + 50 = 90 gp
    expect(total.gp).toBe(90);
    expect(total.sp).toBe(0);
    expect(total.cp).toBe(0);
    expect(total.pp).toBe(0);
  });

  it("calculates per-player breakdown", () => {
    const p1 = getPlayerBreakdown(entries, "p1");
    // 15*2 + 10 = 40 gp
    expect(p1.gp).toBe(40);

    const p2 = getPlayerBreakdown(entries, "p2");
    expect(p2.gp).toBe(50);
  });

  it("converts mixed currencies to gp/sp/cp", () => {
    const mixed: CartEntry[] = [
      { itemName: "Ale", itemPrice: 4, itemCurrency: "cp", quantity: 1, playerId: "p1", playerName: "A", playerColor: "#f00" },
      { itemName: "Rations", itemPrice: 5, itemCurrency: "sp", quantity: 1, playerId: "p1", playerName: "A", playerColor: "#f00" },
      { itemName: "Sword", itemPrice: 1, itemCurrency: "gp", quantity: 1, playerId: "p1", playerName: "A", playerColor: "#f00" },
    ];
    const total = getTotalBreakdown(mixed);
    // 4cp + 50cp + 100cp = 154cp = 1gp 5sp 4cp
    expect(total.gp).toBe(1);
    expect(total.sp).toBe(5);
    expect(total.cp).toBe(4);
    expect(total.pp).toBe(0);
  });

  it("keeps platinum separate from other currencies", () => {
    const withPP: CartEntry[] = [
      { itemName: "Diamond", itemPrice: 5, itemCurrency: "pp", quantity: 2, playerId: "p1", playerName: "A", playerColor: "#f00" },
      { itemName: "Sword", itemPrice: 15, itemCurrency: "gp", quantity: 1, playerId: "p1", playerName: "A", playerColor: "#f00" },
    ];
    const total = getTotalBreakdown(withPP);
    expect(total.pp).toBe(10);
    expect(total.gp).toBe(15);
  });

  it("returns zero breakdown for empty entries", () => {
    const total = getTotalBreakdown([]);
    expect(total.pp).toBe(0);
    expect(total.gp).toBe(0);
    expect(total.sp).toBe(0);
    expect(total.cp).toBe(0);
  });
});
