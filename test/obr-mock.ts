/**
 * In-memory mock of the @owlbear-rodeo/sdk default export (OBR).
 *
 * Provides controllable room metadata storage and player identity
 * so that tests can exercise metadata.ts and cart.ts without a real
 * OBR runtime.
 *
 * Usage in tests:
 *   import { mockOBR, resetOBR } from "./obr-mock";
 *   vi.mock("@owlbear-rodeo/sdk", () => ({ default: mockOBR }));
 *   beforeEach(() => resetOBR());
 */

import type { Metadata } from "@owlbear-rodeo/sdk";

let metadata: Metadata = {};
let metadataListeners: Array<(metadata: Metadata) => void> = [];

let currentPlayer = {
  id: "player-1",
  name: "Test Player",
  color: "#ff0000",
  role: "PLAYER" as string,
};

export function resetOBR() {
  metadata = {};
  metadataListeners = [];
  currentPlayer = {
    id: "player-1",
    name: "Test Player",
    color: "#ff0000",
    role: "PLAYER",
  };
}

export function setPlayer(opts: Partial<typeof currentPlayer>) {
  Object.assign(currentPlayer, opts);
}

export function getMetadataSnapshot(): Metadata {
  return { ...metadata };
}

export const mockOBR = {
  player: {
    get id() {
      return currentPlayer.id;
    },
    getName: async () => currentPlayer.name,
    getColor: async () => currentPlayer.color,
    getRole: async () => currentPlayer.role,
    getId: async () => currentPlayer.id,
  },
  room: {
    getMetadata: async (): Promise<Metadata> => ({ ...metadata }),
    setMetadata: async (partial: Partial<Metadata>): Promise<void> => {
      for (const [key, value] of Object.entries(partial)) {
        if (value === undefined) {
          delete metadata[key];
        } else {
          metadata[key] = value;
        }
      }
      // Notify listeners with a copy, just like real OBR
      const snapshot = { ...metadata };
      for (const listener of metadataListeners) {
        listener(snapshot);
      }
    },
    onMetadataChange: (callback: (metadata: Metadata) => void): (() => void) => {
      metadataListeners.push(callback);
      return () => {
        metadataListeners = metadataListeners.filter((l) => l !== callback);
      };
    },
  },
  broadcast: {
    sendMessage: async () => {},
    onMessage: () => {},
  },
  popover: {
    open: async () => {},
    close: async () => {},
  },
  notification: {
    show: async () => {},
  },
  onReady: (callback: () => void) => callback(),
};
