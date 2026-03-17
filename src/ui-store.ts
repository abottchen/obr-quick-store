import OBR from "@owlbear-rodeo/sdk";
import { RARITY_COLORS, CURRENCY_COLORS, BROADCAST_CHANNEL, POPOVER_STORE_ID } from "./constants";
import { onStoreMetadataChange, getStoreMetadata } from "./metadata";
import { fetchCatalog } from "./catalog";
import { addToCart, removeOneFromCart, getPlayerBreakdown, getTotalBreakdown } from "./cart";
import type { CurrencyBreakdown } from "./cart";
import type { StoreData, StoreItem, CartEntry } from "./types";

let isMinimized = false;
let descriptionPopup: HTMLElement | null = null;
const collapsedGroups = new Set<string>();
let groupsInitialized = false;
let searchTerm = "";

export async function initStorefront(container: HTMLElement): Promise<void> {
  const meta = await getStoreMetadata();
  const catalog = await fetchCatalog(meta.config.catalogUrl);
  const role = await OBR.player.getRole();
  renderStorefront(container, { catalog, ...meta }, role === "GM");

  onStoreMetadataChange(async (updated) => {
    const freshCatalog = await fetchCatalog(updated.config.catalogUrl);
    renderStorefront(container, { catalog: freshCatalog, ...updated }, role === "GM");
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

function getActiveItems(data: StoreData): StoreItem[] {
  const active = new Set(data.config.activeGroupings);
  return data.catalog.filter((item) => item.itemGrouping.some((g) => active.has(g)));
}

function groupItemsByGrouping(items: StoreItem[]): Map<string, StoreItem[]> {
  const groups = new Map<string, StoreItem[]>();
  for (const item of items) {
    const group = groups.get(item.type) ?? [];
    group.push(item);
    groups.set(item.type, group);
  }
  for (const items of groups.values()) {
    items.sort((a, b) => a.name.localeCompare(b.name));
  }
  return groups;
}

function renderStorefront(
  container: HTMLElement,
  data: StoreData,
  isGM: boolean
): void {
  let items = getActiveItems(data);
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    items = items.filter((item) =>
      item.name.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term)
    );
  }
  const grouped = groupItemsByGrouping(items);
  const adjustment = data.config.priceAdjustment;

  const itemsList = container.querySelector<HTMLElement>("#items-list");
  const cartPanel = container.querySelector<HTMLElement>(".cart-panel");
  const prevScroll = itemsList?.scrollTop ?? 0;
  const prevCartScroll = cartPanel?.scrollTop ?? 0;

  container.innerHTML = `
    <div class="storefront">
      <div class="store-header">
        <div class="store-header-info">
          <h1>${escape(data.config.storeName || "Shop")}</h1>
          <p>${escape(data.config.npcName || "Shopkeeper")}</p>
        </div>
        <div class="store-header-controls">
          <button class="btn-icon btn-small" id="close-store-btn" title="Close">&#x2715;</button>
          <button class="btn-icon" id="minimize-btn" title="${isMinimized ? "Maximize" : "Minimize"}">
            ${isMinimized ? "&#x25A1;" : "&#x2012;"}
          </button>
        </div>
      </div>
      <div class="store-body ${isMinimized ? "minimized" : ""}">
        <div class="search-bar">
          <input type="text" id="search-input" placeholder="Search items..." value="${escapeAttr(searchTerm)}" />
        </div>
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
  const newCartPanel = container.querySelector<HTMLElement>(".cart-panel");
  if (newItemsList) newItemsList.scrollTop = prevScroll;
  if (newCartPanel) newCartPanel.scrollTop = prevCartScroll;

  if (searchTerm) {
    const searchInput = container.querySelector<HTMLInputElement>("#search-input");
    if (searchInput) {
      searchInput.focus();
      searchInput.setSelectionRange(searchTerm.length, searchTerm.length);
    }
  }

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

  if (!groupsInitialized) {
    for (const grouping of grouped.keys()) {
      collapsedGroups.add(grouping);
    }
    groupsInitialized = true;
  }

  let html = "";
  for (const [grouping, items] of grouped) {
    const isCollapsed = searchTerm ? false : collapsedGroups.has(grouping);
    const arrow = isCollapsed ? "&#x25B6;" : "&#x25BC;";
    html += `<div class="grouping-header" data-group="${escapeAttr(grouping)}"><span class="grouping-arrow">${arrow}</span> ${escape(grouping)} <span class="grouping-count">(${items.length})</span></div>`;
    html += `<div class="grouping-items ${isCollapsed ? "collapsed" : ""}">`;
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
             style="border-left-color: ${color};${item.rarity !== "common" ? ` background: linear-gradient(to right, ${hexToRgba(color, 0.4)} 0%, ${hexToRgba(color, 0)} 70%)` : ""}"
             data-item-name="${escapeAttr(item.name)}"
             data-item-price="${price}">
          <div class="item-image" style="background: ${color}">${imageContent}</div>
          <span class="item-name">${escape(item.name)}</span>
          <span class="item-price">${currencySpan(price, item.currency ?? "gp")}</span>
          <span class="item-qty">${playerCartQty > 0 ? playerCartQty : ""}</span>
        </div>
      `;
    }
    html += `</div>`;
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
  data: StoreData,
  isGM: boolean
): void {
  container.querySelector<HTMLInputElement>("#search-input")?.addEventListener("input", (e) => {
    searchTerm = (e.target as HTMLInputElement).value;
    renderStorefront(container, data, isGM);
  });

  container.querySelectorAll<HTMLElement>(".grouping-header").forEach((header) => {
    header.addEventListener("click", () => {
      const group = header.dataset.group!;
      if (collapsedGroups.has(group)) {
        collapsedGroups.delete(group);
      } else {
        collapsedGroups.add(group);
      }
      renderStorefront(container, data, isGM);
    });
  });

  container.querySelector("#minimize-btn")?.addEventListener("click", async () => {
    isMinimized = !isMinimized;
    const baseUrl = new URL(".", document.location.href).href;
    await OBR.popover.open({
      id: POPOVER_STORE_ID,
      url: `${baseUrl}store.html`,
      height: isMinimized ? 90 : 950,
      width: 750,
      anchorPosition: { top: 50, left: window.innerWidth * 0.5 },
      anchorOrigin: { horizontal: "CENTER", vertical: "TOP" },
      disableClickAway: true,
      hidePaper: false,
    });
    renderStorefront(container, data, isGM);
  });

  container.querySelector("#close-store-btn")?.addEventListener("click", () => {
    OBR.popover.close(POPOVER_STORE_ID);
  });

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

  const maxX = window.innerWidth - 390;
  const maxY = window.innerHeight - 225;
  popup.style.left = `${Math.min(x, maxX)}px`;
  popup.style.top = `${Math.min(y, maxY)}px`;

  const imageHtml = item.image
    ? `<img class="desc-image" src="${escapeAttr(item.image)}" alt="${escapeAttr(item.name)}" />`
    : "";

  popup.innerHTML = `
    <div class="desc-header">
      ${imageHtml}
      <div class="desc-header-info">
        <h3>${escape(item.name)}</h3>
        <div class="desc-type">${escape(item.type)}</div>
        <div class="desc-rarity" style="color: ${color}">${escape(item.rarity)}</div>
      </div>
    </div>
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

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
