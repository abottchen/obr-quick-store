import OBR from "@owlbear-rodeo/sdk";
import { RARITY_COLORS, CURRENCY_COLORS, BROADCAST_CHANNEL, POPOVER_STORE_ID } from "./constants";
import { onStoreMetadataChange, setStoreMetadata, getStoreMetadata } from "./metadata";
import { addToCart, removeOneFromCart, getPlayerBreakdown, getTotalBreakdown } from "./cart";
import type { CurrencyBreakdown } from "./cart";
import type { QuickStoreMetadata, StoreItem, CartEntry } from "./types";

let isMinimized = false;
let descriptionPopup: HTMLElement | null = null;

export async function initStorefront(container: HTMLElement): Promise<void> {
  const data = await getStoreMetadata();
  const role = await OBR.player.getRole();
  renderStorefront(container, data, role === "GM");

  onStoreMetadataChange((updated) => {
    renderStorefront(container, updated, role === "GM");
  });

  OBR.broadcast.onMessage(BROADCAST_CHANNEL, (event) => {
    const msg = event.data as { action: string };
    if (msg.action === "close") {
      OBR.popover.close(POPOVER_STORE_ID);
    }
  });

  document.addEventListener("click", dismissDescription);
}

function adjustPrice(basePrice: number, adjustment: number): number {
  return Math.round((basePrice * adjustment) / 100);
}

function currencySpan(amount: number, currency: string): string {
  const color = CURRENCY_COLORS[currency] ?? CURRENCY_COLORS.gp;
  return `<span style="color: ${color}">${amount} ${currency}</span>`;
}

function renderBreakdown(breakdown: CurrencyBreakdown): string {
  const parts: string[] = [];
  if (breakdown.pp > 0) parts.push(currencySpan(breakdown.pp, "pp"));
  if (breakdown.gp > 0) parts.push(currencySpan(breakdown.gp, "gp"));
  if (breakdown.sp > 0) parts.push(currencySpan(breakdown.sp, "sp"));
  if (breakdown.cp > 0) parts.push(currencySpan(breakdown.cp, "cp"));
  return parts.length > 0 ? parts.join(" ") : currencySpan(0, "gp");
}

function getActiveItems(data: QuickStoreMetadata): StoreItem[] {
  const active = new Set(data.config.activeGroupings);
  return data.catalog.filter((item) => active.has(item.itemGrouping));
}

function groupItemsByGrouping(items: StoreItem[]): Map<string, StoreItem[]> {
  const groups = new Map<string, StoreItem[]>();
  for (const item of items) {
    const group = groups.get(item.itemGrouping) ?? [];
    group.push(item);
    groups.set(item.itemGrouping, group);
  }
  return groups;
}

function renderStorefront(
  container: HTMLElement,
  data: QuickStoreMetadata,
  isGM: boolean
): void {
  const items = getActiveItems(data);
  const grouped = groupItemsByGrouping(items);
  const adjustment = data.config.priceAdjustment;

  const itemsList = container.querySelector<HTMLElement>("#items-list");
  const prevScroll = itemsList?.scrollTop ?? 0;

  container.innerHTML = `
    <div class="storefront">
      <div class="store-header">
        <div class="store-header-info">
          <h1>${escape(data.config.storeName || "Shop")}</h1>
          <p>${escape(data.config.npcName || "Shopkeeper")}</p>
        </div>
        <div class="store-header-controls">
          ${isGM ? `<button class="btn-icon btn-small" id="close-store-btn" title="Close Store">&#x2715;</button>` : ""}
          <button class="btn-icon" id="minimize-btn" title="${isMinimized ? "Maximize" : "Minimize"}">
            ${isMinimized ? "&#x25A1;" : "&#x2012;"}
          </button>
        </div>
      </div>
      <div class="store-body ${isMinimized ? "minimized" : ""}">
        <div class="items-list-header">
          <span class="col-icon"></span>
          <span class="col-name">Name</span>
          <span class="col-price">Price</span>
          <span class="col-qty">#</span>
        </div>
        <div class="items-list" id="items-list">
          ${renderItemRows(grouped, adjustment, data.cart.entries)}
        </div>
        ${renderCart(data.cart.entries, adjustment)}
      </div>
    </div>
  `;

  const newItemsList = container.querySelector<HTMLElement>("#items-list");
  if (newItemsList) newItemsList.scrollTop = prevScroll;

  bindStorefrontEvents(container, data, isGM);
}

function renderItemRows(
  grouped: Map<string, StoreItem[]>,
  adjustment: number,
  cartEntries: CartEntry[]
): string {
  if (grouped.size === 0) {
    return `<p style="text-align: center; color: #666; font-style: italic; padding: 20px;">No items available.</p>`;
  }

  let html = "";
  for (const [grouping, items] of grouped) {
    html += `<div class="grouping-header">${escape(grouping)}</div>`;
    for (const item of items) {
      const price = adjustPrice(item.price, adjustment);
      const color = RARITY_COLORS[item.rarity] ?? RARITY_COLORS.common;
      const imageContent = item.image
        ? `<img src="${escapeAttr(item.image)}" alt="${escapeAttr(item.name)}" />`
        : item.name.charAt(0).toUpperCase();

      const playerCartQty = cartEntries
        .filter((e) => e.itemName === item.name)
        .reduce((sum, e) => sum + e.quantity, 0);

      html += `
        <div class="item-row"
             style="border-left-color: ${color}"
             data-item-name="${escapeAttr(item.name)}"
             data-item-price="${price}">
          <div class="item-image" style="background: ${color}">${imageContent}</div>
          <span class="item-name">${escape(item.name)}</span>
          <span class="item-price">${currencySpan(price, item.currency ?? "gp")}</span>
          <span class="item-qty">${playerCartQty > 0 ? playerCartQty : ""}</span>
        </div>
      `;
    }
  }
  return html;
}

function renderCart(entries: CartEntry[], _adjustment: number): string {
  if (entries.length === 0) {
    return `
      <div class="cart-panel">
        <div class="cart-title">Cart</div>
        <div class="cart-empty">No items in cart yet. Click items to add them.</div>
      </div>
    `;
  }

  const playerIds = [...new Set(entries.map((e) => e.playerId))];
  let html = `<div class="cart-panel"><div class="cart-title">Cart</div>`;

  for (const pid of playerIds) {
    const playerEntries = entries.filter((e) => e.playerId === pid);
    const first = playerEntries[0];
    const subtotal = getPlayerBreakdown(entries, pid);

    html += `<div class="cart-player-group">`;
    html += `<div class="cart-player-name">
      <span class="cart-player-dot" style="background: ${escapeAttr(first.playerColor)}"></span>
      ${escape(first.playerName)}
    </div>`;

    for (const entry of playerEntries) {
      html += `
        <div class="cart-item" data-cart-item="${escapeAttr(entry.itemName)}" data-cart-player="${escapeAttr(entry.playerId)}">
          <span class="cart-item-name">${escape(entry.itemName)}</span>
          <span class="cart-item-qty">x${entry.quantity}</span>
          <span class="cart-item-price">${currencySpan(entry.itemPrice * entry.quantity, entry.itemCurrency ?? "gp")}</span>
          <button class="cart-item-remove" data-remove-item="${escapeAttr(entry.itemName)}" data-remove-player="${escapeAttr(entry.playerId)}" title="Remove one">&#x2715;</button>
        </div>
      `;
    }

    html += `
      <div class="cart-subtotal">
        <span>Subtotal</span>
        <span>${renderBreakdown(subtotal)}</span>
      </div>
    </div>`;
  }

  const total = getTotalBreakdown(entries);
  html += `
    <div class="cart-total">
      <span>Total</span>
      <span>${renderBreakdown(total)}</span>
    </div>
  </div>`;

  return html;
}

function bindStorefrontEvents(
  container: HTMLElement,
  data: QuickStoreMetadata,
  isGM: boolean
): void {
  container.querySelector("#minimize-btn")?.addEventListener("click", () => {
    isMinimized = !isMinimized;
    renderStorefront(container, data, isGM);
  });

  if (isGM) {
    container.querySelector("#close-store-btn")?.addEventListener("click", async () => {
      await setStoreMetadata({
        config: { ...(await getStoreMetadata()).config, isOpen: false },
      });
      await setStoreMetadata({ cart: { entries: [] } });
      await OBR.broadcast.sendMessage(
        BROADCAST_CHANNEL,
        { action: "close" },
        { destination: "ALL" }
      );
    });
  }

  container.querySelectorAll<HTMLElement>(".item-row").forEach((card) => {
    card.addEventListener("click", async () => {
      const itemName = card.dataset.itemName!;
      const item = data.catalog.find((i) => i.name === itemName);
      if (!item) return;
      const price = adjustPrice(item.price, data.config.priceAdjustment);
      await addToCart(item, price);
    });

    card.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      const itemName = card.dataset.itemName!;
      const item = data.catalog.find((i) => i.name === itemName);
      if (!item) return;
      showDescription(item, e.clientX, e.clientY);
    });
  });

  container.querySelectorAll<HTMLElement>(".cart-item-remove").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const itemName = (btn as HTMLElement).dataset.removeItem!;
      const playerId = (btn as HTMLElement).dataset.removePlayer!;
      const currentPlayerId = OBR.player.id;
      const role = await OBR.player.getRole();
      if (playerId === currentPlayerId || role === "GM") {
        await removeOneFromCart(itemName, playerId);
      }
    });
  });
}

function showDescription(item: StoreItem, x: number, y: number): void {
  dismissDescription();

  const color = RARITY_COLORS[item.rarity] ?? RARITY_COLORS.common;
  const popup = document.createElement("div");
  popup.className = "description-popup";

  const maxX = window.innerWidth - 260;
  const maxY = window.innerHeight - 150;
  popup.style.left = `${Math.min(x, maxX)}px`;
  popup.style.top = `${Math.min(y, maxY)}px`;

  popup.innerHTML = `
    <h3>${escape(item.name)}</h3>
    <div class="desc-type">${escape(item.type)}</div>
    <div class="desc-rarity" style="color: ${color}">${escape(item.rarity)}</div>
    <p>${escape(item.description)}</p>
  `;

  document.body.appendChild(popup);
  descriptionPopup = popup;
}

function dismissDescription(): void {
  if (descriptionPopup) {
    descriptionPopup.remove();
    descriptionPopup = null;
  }
}

function escape(str: string): string {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function escapeAttr(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}
