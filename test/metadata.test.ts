import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockOBR, resetOBR, getMetadataSnapshot } from "./obr-mock";

vi.mock("@owlbear-rodeo/sdk", () => ({ default: mockOBR }));

import {
  getConfigMetadata,
  setConfigMetadata,
  updateConfigMetadata,
  getPlayerCart,
  setPlayerCart,
  clearAllCarts,
  onStoreDataChange,
} from "../src/metadata";
import { CONFIG_KEY, CART_KEY_PREFIX, METADATA_KEY } from "../src/constants";
import type { StoreConfig, PlayerCart } from "../src/types";

describe("config metadata", () => {
  beforeEach(() => resetOBR());

  it("returns defaults when no config exists", async () => {
    const config = await getConfigMetadata();
    expect(config.storeName).toBe("");
    expect(config.npcName).toBe("");
    expect(config.priceAdjustment).toBe(100);
    expect(config.isOpen).toBe(false);
    expect(config.activeGroupings).toEqual([]);
  });

  it("reads config from CONFIG_KEY", async () => {
    await mockOBR.room.setMetadata({
      [CONFIG_KEY]: { storeName: "The Rusty Blade", priceAdjustment: 120 },
    });

    const config = await getConfigMetadata();
    expect(config.storeName).toBe("The Rusty Blade");
    expect(config.priceAdjustment).toBe(120);
    // Defaults still filled in for missing fields
    expect(config.npcName).toBe("");
  });

  it("migrates from legacy METADATA_KEY when CONFIG_KEY is absent", async () => {
    await mockOBR.room.setMetadata({
      [METADATA_KEY]: {
        config: { storeName: "Old Shop", npcName: "Gundren" },
        cart: { entries: [] },
      },
    });

    const config = await getConfigMetadata();
    expect(config.storeName).toBe("Old Shop");
    expect(config.npcName).toBe("Gundren");
  });

  it("prefers CONFIG_KEY over legacy METADATA_KEY", async () => {
    await mockOBR.room.setMetadata({
      [CONFIG_KEY]: { storeName: "New Shop" },
      [METADATA_KEY]: { config: { storeName: "Old Shop" } },
    });

    const config = await getConfigMetadata();
    expect(config.storeName).toBe("New Shop");
  });

  it("setConfigMetadata writes to CONFIG_KEY", async () => {
    const config: StoreConfig = {
      catalogUrl: "./data/items.json",
      activeGroupings: ["weapons"],
      priceAdjustment: 80,
      npcName: "Volo",
      storeName: "Volo's Bargains",
      isOpen: true,
    };
    await setConfigMetadata(config);

    const meta = getMetadataSnapshot();
    expect(meta[CONFIG_KEY]).toEqual(config);
  });

  it("updateConfigMetadata applies updater to current state", async () => {
    await setConfigMetadata({
      catalogUrl: "./data/items.json",
      activeGroupings: [],
      priceAdjustment: 100,
      npcName: "",
      storeName: "Shop",
      isOpen: false,
    });

    await updateConfigMetadata((current) => ({
      ...current,
      isOpen: true,
      storeName: "Open Shop",
    }));

    const config = await getConfigMetadata();
    expect(config.isOpen).toBe(true);
    expect(config.storeName).toBe("Open Shop");
    expect(config.priceAdjustment).toBe(100); // Untouched field preserved
  });

  it("updateConfigMetadata serializes concurrent calls", async () => {
    await setConfigMetadata({
      catalogUrl: "",
      activeGroupings: [],
      priceAdjustment: 100,
      npcName: "",
      storeName: "",
      isOpen: false,
    });

    // Fire two updates concurrently — both should apply
    const p1 = updateConfigMetadata((c) => ({ ...c, storeName: "First" }));
    const p2 = updateConfigMetadata((c) => ({ ...c, npcName: "Second" }));
    await Promise.all([p1, p2]);

    const config = await getConfigMetadata();
    expect(config.storeName).toBe("First");
    expect(config.npcName).toBe("Second");
  });
});

describe("player cart operations", () => {
  beforeEach(() => resetOBR());

  it("returns null for nonexistent cart", async () => {
    const cart = await getPlayerCart("nobody");
    expect(cart).toBeNull();
  });

  it("writes and reads a player cart", async () => {
    const cart: PlayerCart = {
      entries: [{ itemName: "Longsword", itemPrice: 15, itemCurrency: "gp", quantity: 1 }],
      playerName: "Alice",
      playerColor: "#ff0000",
    };

    await setPlayerCart("player-1", cart);
    const result = await getPlayerCart("player-1");

    expect(result).toEqual(cart);
  });

  it("different players have independent carts", async () => {
    await setPlayerCart("player-1", {
      entries: [{ itemName: "Longsword", itemPrice: 15, itemCurrency: "gp", quantity: 1 }],
      playerName: "Alice",
      playerColor: "#ff0000",
    });
    await setPlayerCart("player-2", {
      entries: [{ itemName: "Shield", itemPrice: 10, itemCurrency: "gp", quantity: 1 }],
      playerName: "Bob",
      playerColor: "#0000ff",
    });

    const cart1 = await getPlayerCart("player-1");
    const cart2 = await getPlayerCart("player-2");
    expect(cart1!.entries[0].itemName).toBe("Longsword");
    expect(cart2!.entries[0].itemName).toBe("Shield");
  });

  it("clearAllCarts removes all cart keys", async () => {
    await setPlayerCart("player-1", {
      entries: [{ itemName: "Sword", itemPrice: 10, itemCurrency: "gp", quantity: 1 }],
      playerName: "Alice",
      playerColor: "#f00",
    });
    await setPlayerCart("player-2", {
      entries: [{ itemName: "Bow", itemPrice: 25, itemCurrency: "gp", quantity: 1 }],
      playerName: "Bob",
      playerColor: "#00f",
    });

    await clearAllCarts();

    expect(await getPlayerCart("player-1")).toBeNull();
    expect(await getPlayerCart("player-2")).toBeNull();
  });

  it("clearAllCarts preserves config metadata", async () => {
    await mockOBR.room.setMetadata({ [CONFIG_KEY]: { storeName: "Shop" } });
    await setPlayerCart("player-1", {
      entries: [{ itemName: "Sword", itemPrice: 10, itemCurrency: "gp", quantity: 1 }],
      playerName: "Alice",
      playerColor: "#f00",
    });

    await clearAllCarts();

    const meta = getMetadataSnapshot();
    expect(meta[CONFIG_KEY]).toEqual({ storeName: "Shop" });
  });
});

describe("onStoreDataChange", () => {
  beforeEach(() => resetOBR());

  it("fires callback with merged config and cart on metadata change", async () => {
    const calls: Array<{ config: any; cart: any }> = [];
    onStoreDataChange((config, cart) => {
      calls.push({ config, cart });
    });

    // Set config
    await mockOBR.room.setMetadata({
      [CONFIG_KEY]: { storeName: "Test Shop", priceAdjustment: 100 },
    });

    expect(calls).toHaveLength(1);
    expect(calls[0].config.storeName).toBe("Test Shop");

    // Add a player cart
    await mockOBR.room.setMetadata({
      [CART_KEY_PREFIX + "player-1"]: {
        entries: [{ itemName: "Sword", itemPrice: 10, itemCurrency: "gp", quantity: 2 }],
        playerName: "Alice",
        playerColor: "#ff0000",
      },
    });

    expect(calls).toHaveLength(2);
    expect(calls[1].cart.entries).toHaveLength(1);
    expect(calls[1].cart.entries[0].playerId).toBe("player-1");
    expect(calls[1].cart.entries[0].playerName).toBe("Alice");
    expect(calls[1].cart.entries[0].itemName).toBe("Sword");
    expect(calls[1].cart.entries[0].quantity).toBe(2);
  });

  it("merges multiple player carts into a single CartState", async () => {
    const calls: Array<{ cart: any }> = [];
    onStoreDataChange((_config, cart) => {
      calls.push({ cart });
    });

    await mockOBR.room.setMetadata({
      [CART_KEY_PREFIX + "player-1"]: {
        entries: [{ itemName: "Sword", itemPrice: 10, itemCurrency: "gp", quantity: 1 }],
        playerName: "Alice",
        playerColor: "#ff0000",
      },
      [CART_KEY_PREFIX + "player-2"]: {
        entries: [{ itemName: "Bow", itemPrice: 25, itemCurrency: "gp", quantity: 3 }],
        playerName: "Bob",
        playerColor: "#0000ff",
      },
    });

    const cart = calls[calls.length - 1].cart;
    expect(cart.entries).toHaveLength(2);

    const alice = cart.entries.find((e: any) => e.playerId === "player-1");
    const bob = cart.entries.find((e: any) => e.playerId === "player-2");
    expect(alice.itemName).toBe("Sword");
    expect(bob.itemName).toBe("Bow");
    expect(bob.quantity).toBe(3);
  });

  it("returns unsubscribe function that stops callbacks", async () => {
    let callCount = 0;
    const unsub = onStoreDataChange(() => { callCount++; });

    await mockOBR.room.setMetadata({ [CONFIG_KEY]: { storeName: "A" } });
    expect(callCount).toBe(1);

    unsub();
    await mockOBR.room.setMetadata({ [CONFIG_KEY]: { storeName: "B" } });
    expect(callCount).toBe(1); // No additional call
  });
});
