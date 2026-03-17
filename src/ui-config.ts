import OBR from "@owlbear-rodeo/sdk";
import { getStoreMetadata, setStoreMetadata } from "./metadata";
import { generateNpcName, generateStoreName } from "./names";
import { setupImportHandler } from "./import-catalog";
import { clearCart } from "./cart";
import { BROADCAST_CHANNEL, METADATA_KEY } from "./constants";
import type { QuickStoreMetadata } from "./types";

function getGroupings(data: QuickStoreMetadata): string[] {
  const groupings = new Set(data.catalog.flatMap((item) => item.itemGrouping));
  return [...groupings].sort();
}

function renderGroupingsChecklist(
  data: QuickStoreMetadata
): string {
  const groupings = getGroupings(data);
  if (groupings.length === 0) {
    return `<p class="no-catalog">No catalog imported yet. Import items to get started.</p>`;
  }
  return groupings
    .map(
      (g) => `
      <label class="grouping-checkbox">
        <input type="checkbox" value="${g}" ${data.config.activeGroupings.includes(g) ? "checked" : ""} data-grouping />
        ${g}
      </label>`
    )
    .join("");
}

export function renderConfigUI(
  container: HTMLElement,
  data: QuickStoreMetadata
): void {
  const statusClass = data.config.isOpen ? "open" : "closed";
  const statusText = data.config.isOpen ? "Store is open" : "Store is closed";

  container.innerHTML = `
    <div class="config-header">
      <div class="config-header-row">
        <h1>Quick Store</h1>
        <div class="config-header-actions">
          <button class="btn-icon" id="import-btn" title="Import Catalog">&#x1F4C1;</button>
          ${
            data.config.isOpen
              ? `<button class="btn-icon btn-icon-danger" id="close-store" title="Close Store">&#x23F9;</button>`
              : `<button class="btn-icon btn-icon-primary" id="open-store" title="Open Store">&#x25B6;</button>`
          }
        </div>
      </div>
      <p>Configure and present shops to your players</p>
    </div>

    <div class="store-status ${statusClass}">
      <span class="status-dot"></span>
      <span>${statusText}</span>
    </div>

    <div class="section">
      <div class="section-title">Store Name</div>
      <div class="input-row">
        <input type="text" id="store-name" value="${escapeAttr(data.config.storeName)}" placeholder="Enter store name..." />
        <button class="btn-secondary btn-small" id="random-store-name">Random</button>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Shopkeeper</div>
      <div class="input-row">
        <input type="text" id="npc-name" value="${escapeAttr(data.config.npcName)}" placeholder="Enter NPC name..." />
        <button class="btn-secondary btn-small" id="random-npc-name">Random</button>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Price Adjustment</div>
      <div class="input-row">
        <input type="number" id="price-adjustment" value="${data.config.priceAdjustment}" min="1" max="1000" step="5" />
        <span style="color: #888; font-size: 12px; flex-shrink: 0">%</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Item Groups</div>
      <div class="groupings-list" id="groupings-list">
        ${renderGroupingsChecklist(data)}
      </div>
    </div>

    <div class="section debug-section">
      <div class="section-title">Debug</div>
      <div class="input-row">
        <button class="btn-secondary btn-small" id="view-metadata-btn">View Metadata</button>
        <button class="btn-secondary btn-small btn-danger-text" id="clear-metadata-btn">Clear Metadata</button>
      </div>
    </div>

    <input type="file" id="file-input" accept=".json" style="display: none" />

    <div class="metadata-overlay" id="metadata-overlay" style="display: none">
      <div class="metadata-modal">
        <div class="metadata-modal-header">
          <span>Room Metadata</span>
          <button class="btn-icon" id="close-metadata-btn">&#x2715;</button>
        </div>
        <pre class="metadata-modal-body" id="metadata-modal-body"></pre>
      </div>
    </div>
  `;

  bindConfigEvents(container, data);
}

function bindConfigEvents(
  container: HTMLElement,
  data: QuickStoreMetadata
): void {
  const storeNameInput = container.querySelector<HTMLInputElement>("#store-name")!;
  const npcNameInput = container.querySelector<HTMLInputElement>("#npc-name")!;
  const priceInput = container.querySelector<HTMLInputElement>("#price-adjustment")!;
  const fileInput = container.querySelector<HTMLInputElement>("#file-input")!;

  container.querySelector("#random-store-name")!.addEventListener("click", () => {
    storeNameInput.value = generateStoreName();
    saveConfig(container, data);
  });

  container.querySelector("#random-npc-name")!.addEventListener("click", () => {
    npcNameInput.value = generateNpcName();
    saveConfig(container, data);
  });

  storeNameInput.addEventListener("change", () => saveConfig(container, data));
  npcNameInput.addEventListener("change", () => saveConfig(container, data));
  priceInput.addEventListener("change", () => saveConfig(container, data));

  container.querySelectorAll<HTMLInputElement>("[data-grouping]").forEach((cb) => {
    cb.addEventListener("change", () => saveConfig(container, data));
  });

  const openBtn = container.querySelector("#open-store");
  const closeBtn = container.querySelector("#close-store");

  openBtn?.addEventListener("click", async () => {
    await saveConfig(container, data);
    await setStoreMetadata({
      config: { ...(await getStoreMetadata()).config, isOpen: true },
    });
    await OBR.broadcast.sendMessage(
      BROADCAST_CHANNEL,
      { action: "open" },
      { destination: "ALL" }
    );
  });

  closeBtn?.addEventListener("click", async () => {
    await setStoreMetadata({
      config: { ...(await getStoreMetadata()).config, isOpen: false },
    });
    await clearCart();
    await OBR.broadcast.sendMessage(
      BROADCAST_CHANNEL,
      { action: "close" },
      { destination: "ALL" }
    );
  });

  container.querySelector("#import-btn")!.addEventListener("click", () => {
    fileInput.click();
  });

  setupImportHandler(fileInput, async () => {
    const fresh = await getStoreMetadata();
    renderConfigUI(container, fresh);
  });

  const overlay = container.querySelector<HTMLElement>("#metadata-overlay")!;
  const modalBody = container.querySelector<HTMLElement>("#metadata-modal-body")!;

  container.querySelector("#view-metadata-btn")!.addEventListener("click", async () => {
    const current = await getStoreMetadata();
    modalBody.textContent = JSON.stringify(current, null, 2);
    overlay.style.display = "flex";
  });

  container.querySelector("#close-metadata-btn")!.addEventListener("click", () => {
    overlay.style.display = "none";
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.style.display = "none";
  });

  container.querySelector("#clear-metadata-btn")!.addEventListener("click", async () => {
    await OBR.room.setMetadata({ [METADATA_KEY]: undefined });
    await OBR.notification.show("Metadata cleared.", "SUCCESS");
    const fresh = await getStoreMetadata();
    renderConfigUI(container, fresh);
  });
}

async function saveConfig(
  container: HTMLElement,
  _data: QuickStoreMetadata
): Promise<void> {
  const storeName = container.querySelector<HTMLInputElement>("#store-name")!.value;
  const npcName = container.querySelector<HTMLInputElement>("#npc-name")!.value;
  const priceAdjustment = parseInt(
    container.querySelector<HTMLInputElement>("#price-adjustment")!.value,
    10
  ) || 100;

  const activeGroupings: string[] = [];
  container.querySelectorAll<HTMLInputElement>("[data-grouping]").forEach((cb) => {
    if (cb.checked) activeGroupings.push(cb.value);
  });

  const current = await getStoreMetadata();
  await setStoreMetadata({
    config: {
      ...current.config,
      storeName,
      npcName,
      priceAdjustment,
      activeGroupings,
    },
  });
}

export function renderPlayerMessage(container: HTMLElement): void {
  container.innerHTML = `
    <div class="player-only-msg">
      <h2>Quick Store</h2>
      <p>This panel is for the GM to configure shops.<br/>
      The storefront will appear when the GM opens a store.</p>
    </div>
  `;
}

function escapeAttr(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}
