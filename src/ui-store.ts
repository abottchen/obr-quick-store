import OBR from "@owlbear-rodeo/sdk";
import { RARITY_COLORS, CURRENCY_COLORS, BROADCAST_CHANNEL, POPOVER_STORE_ID } from "./constants";
import { getConfigMetadata, onStoreDataChange } from "./metadata";
import { fetchCatalog } from "./catalog";
import { addToCart, removeOneFromCart, getPlayerBreakdown, getTotalBreakdown } from "./cart";
import type { CurrencyBreakdown } from "./cart";
import type { StoreData, StoreItem, CartEntry } from "./types";

let isMinimized = false;
let descriptionPopup: HTMLElement | null = null;
const collapsedGroups = new Set<string>();
let groupsInitialized = false;
let searchTerm = "";
let drawerOpen = false;
let prevCartKey = ""; // signature of last cart render — drives slide-in animation
let currentCatalog: StoreItem[] = [];

export async function initStorefront(container: HTMLElement): Promise<void> {
  const config = await getConfigMetadata();
  const catalog = await fetchCatalog(config.catalogUrl);
  const role = await OBR.player.getRole();
  renderStorefront(container, { catalog, config, cart: { entries: [] } }, role === "GM");

  onStoreDataChange(async (updatedConfig, updatedCart) => {
    const freshCatalog = await fetchCatalog(updatedConfig.catalogUrl);
    renderStorefront(container, { catalog: freshCatalog, config: updatedConfig, cart: updatedCart }, role === "GM");
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

let coinCounter = 0;

function coinHtml(amount: number, currency: string): string {
  const delay = ((coinCounter++ * 0.7) % 4).toFixed(1);
  const color = CURRENCY_COLORS[currency] ?? CURRENCY_COLORS.gp;
  return `<span class="coin"><span class="coin-icon coin-icon-${currency}" style="--sheen-delay: ${delay}s"></span><span style="color: ${color}">${amount}</span></span>`;
}

function renderBreakdown(breakdown: CurrencyBreakdown): string {
  const parts: string[] = [];
  if (breakdown.pp > 0) parts.push(coinHtml(breakdown.pp, "pp"));
  if (breakdown.gp > 0) parts.push(coinHtml(breakdown.gp, "gp"));
  if (breakdown.sp > 0) parts.push(coinHtml(breakdown.sp, "sp"));
  if (breakdown.cp > 0) parts.push(coinHtml(breakdown.cp, "cp"));
  return parts.length > 0 ? parts.join(" ") : coinHtml(0, "gp");
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
  currentCatalog = data.catalog;
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    items = items.filter((item) =>
      item.name.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term)
    );
  }
  const grouped = groupItemsByGrouping(items);
  const adjustment = data.config.priceAdjustment;

  const itemsScroll = container.querySelector<HTMLElement>(".items-scroll");
  const drawerContent = container.querySelector<HTMLElement>(".cart-drawer-content");
  const prevScroll = itemsScroll?.scrollTop ?? 0;
  const prevCartScroll = drawerContent?.scrollTop ?? 0;

  const totalQty = data.cart.entries.reduce((sum, e) => sum + e.quantity, 0);
  const totalBreakdown = renderBreakdown(getTotalBreakdown(data.cart.entries));
  const drawerCollapsedClass = drawerOpen && totalQty > 0 ? "" : "collapsed";

  container.innerHTML = `
    <div class="storefront">
      <div class="store-header">
        <div class="store-header-info">
          <h1>${escape(data.config.storeName || "Shop")}</h1>
          <p>${escape(data.config.npcName || "Shopkeeper")}</p>
        </div>
        <div class="store-header-controls">
          <button class="btn-icon" id="minimize-btn" title="${isMinimized ? "Maximize" : "Minimize"}">
            ${isMinimized ? "&#x25A1;" : "&#x2012;"}
          </button>
          <button class="btn-icon" id="close-store-btn" title="Close">&#x2715;</button>
        </div>
      </div>
      <div class="store-body ${isMinimized ? "minimized" : ""}">
        <div class="toolbar">
          <input type="text" id="search-input" placeholder="Search items..." value="${escapeAttr(searchTerm)}" />
          <button class="toolbar-btn" id="collapse-all-btn" title="Collapse / expand all groups">${allCollapsed(grouped) ? "&#x25BC; All" : "&#x25B6; All"}</button>
        </div>
        <div class="items-list-header">
          <span class="col-icon"></span>
          <span class="col-name">Name</span>
          <span class="col-price">Price</span>
        </div>
        <div class="items-scroll-wrapper" id="items-scroll-wrapper">
          <div class="items-scroll">
            ${renderItemRows(grouped, adjustment, data.cart.entries)}
          </div>
        </div>
        <div class="cart-drawer ${drawerCollapsedClass}" id="cart-drawer">
          <div class="cart-drawer-handle" id="cart-handle">
            <div class="cart-drawer-handle-left">
              <span class="cart-title">Cart</span>
              <span class="cart-count-badge" id="cart-count">${totalQty}</span>
            </div>
            <div style="display: flex; align-items: center;">
              <span class="cart-total-preview">${totalQty > 0 ? totalBreakdown : "&mdash;"}</span>
              <span class="cart-drawer-arrow">&#x25BC;</span>
            </div>
          </div>
          <div class="cart-drawer-content">
            ${renderCartContent(data.cart.entries)}
          </div>
          ${totalQty > 0 ? `<div class="cart-grand-total"><span>Total</span><span id="grand-total-value">${totalBreakdown}</span></div>` : ""}
        </div>
      </div>
    </div>
  `;

  const newItemsScroll = container.querySelector<HTMLElement>(".items-scroll");
  const newDrawerContent = container.querySelector<HTMLElement>(".cart-drawer-content");
  if (newItemsScroll) newItemsScroll.scrollTop = prevScroll;
  if (newDrawerContent) newDrawerContent.scrollTop = prevCartScroll;

  if (searchTerm) {
    const searchInput = container.querySelector<HTMLInputElement>("#search-input");
    if (searchInput) {
      searchInput.focus();
      searchInput.setSelectionRange(searchTerm.length, searchTerm.length);
    }
  }

  bindStorefrontEvents(container, data, isGM);
  initScrollFades(container);
}

function allCollapsed(grouped: Map<string, StoreItem[]>): boolean {
  if (grouped.size === 0) return false;
  for (const key of grouped.keys()) {
    if (!collapsedGroups.has(key)) return false;
  }
  return true;
}

function renderItemRows(
  grouped: Map<string, StoreItem[]>,
  adjustment: number,
  _cartEntries: CartEntry[]
): string {
  if (grouped.size === 0) {
    return `<p style="text-align: center; color: var(--text-dim); font-style: italic; padding: 20px;">No items available.</p>`;
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
    const expandedClass = isCollapsed ? "" : "expanded";
    const maxH = isCollapsed ? "0" : `${items.length * 60 + 16}px`;

    html += `<div class="grouping-header" data-group="${escapeAttr(grouping)}">
      <span class="grouping-arrow ${expandedClass}">&#x25B6;</span>
      ${escape(grouping)}
      <span class="grouping-count">${items.length}</span>
    </div>`;
    html += `<div class="grouping-items ${isCollapsed ? "collapsed" : ""}" style="max-height: ${maxH};" data-group-items="${escapeAttr(grouping)}">`;

    for (const item of items) {
      const price = adjustPrice(item.price, adjustment);
      const rarityClass = item.rarity !== "common" ? ` rarity-${item.rarity.replace(" ", "-")}` : "";
      const rarityColor = RARITY_COLORS[item.rarity] ?? RARITY_COLORS.common;
      const letterColor = item.rarity !== "common" ? rarityColor : "rgba(255,255,255,0.6)";
      const imageContent = item.image
        ? `<img src="${escapeAttr(item.image)}" alt="${escapeAttr(item.name)}" />`
        : item.name.charAt(0).toUpperCase();
      const imageStyle = item.rarity !== "common"
        ? `border-color: ${hexToRgba(rarityColor, 0.4)}; color: ${letterColor};`
        : `color: ${letterColor};`;

      html += `<div class="item-row${rarityClass}" data-item-name="${escapeAttr(item.name)}" data-item-price="${price}">
        <div class="item-image" style="${imageStyle}">${imageContent}</div>
        <span class="item-name">${escape(item.name)}</span>
        <span class="item-price">${coinHtml(price, item.currency ?? "gp")}</span>
      </div>`;
    }
    html += `</div>`;
  }
  return html;
}

function renderCartContent(entries: CartEntry[]): string {
  if (entries.length === 0) {
    prevCartKey = "";
    return `<div class="cart-empty">The shopkeeper awaits your selection&hellip;</div>`;
  }

  const playerIds = [...new Set(entries.map((e) => e.playerId))];
  const cartKey = playerIds
    .map((pid) =>
      entries
        .filter((e) => e.playerId === pid)
        .map((e) => `${e.itemName}:${e.quantity}`)
        .join(",")
    )
    .join("|");

  // For each player+item pair, decide whether to apply slide-in based on whether it
  // existed in the previous cart key.
  const prevSet = new Set(
    prevCartKey.split(/[,|]/).map((s) => s.split(":")[0]).filter(Boolean)
  );

  let html = "";
  for (const pid of playerIds) {
    const playerEntries = entries.filter((e) => e.playerId === pid);
    const first = playerEntries[0];
    const subtotal = renderBreakdown(getPlayerBreakdown(entries, pid));

    html += `<div class="cart-player-group">`;
    html += `<div class="cart-player-name">
      <span class="cart-player-dot" style="background: ${escapeAttr(first.playerColor)}"></span>
      ${escape(first.playerName)}
    </div>`;

    for (const entry of playerEntries) {
      const item = currentCatalog.find((i) => i.name === entry.itemName);
      const rarity = item?.rarity ?? "common";
      const rarityColor = RARITY_COLORS[rarity] ?? RARITY_COLORS.common;
      const slideClass = prevSet.has(entry.itemName) ? "" : " slide-in";
      const pipShadow = rarity === "legendary" ? ` box-shadow: 0 0 4px ${rarityColor};` : "";

      html += `<div class="cart-item${slideClass}"
        data-cart-item="${escapeAttr(entry.itemName)}"
        data-cart-player="${escapeAttr(entry.playerId)}"
        style="border-left-color: ${rarityColor};">
        <span class="cart-item-rarity-pip" style="background: ${rarityColor};${pipShadow}"></span>
        <span class="cart-item-name">${escape(entry.itemName)}</span>
        <div class="cart-item-controls">
          <button class="cart-qty-btn minus" data-remove-item="${escapeAttr(entry.itemName)}" data-remove-player="${escapeAttr(entry.playerId)}">&minus;</button>
          <span class="cart-item-qty">${entry.quantity}</span>
          <button class="cart-qty-btn plus" data-add-item="${escapeAttr(entry.itemName)}" data-add-player="${escapeAttr(entry.playerId)}">+</button>
        </div>
        <span class="cart-item-price">${coinHtml(entry.itemPrice * entry.quantity, entry.itemCurrency ?? "gp")}</span>
      </div>`;
    }

    html += `<div class="cart-subtotal">
      <span>Subtotal</span>
      <span>${subtotal}</span>
    </div>`;
    html += `</div>`;
  }

  prevCartKey = cartKey;
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
      height: isMinimized ? 110 : 950,
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

function initScrollFades(container: HTMLElement): void {
  const wrapper = container.querySelector<HTMLElement>("#items-scroll-wrapper");
  const scrollEl = container.querySelector<HTMLElement>(".items-scroll");
  if (!wrapper || !scrollEl) return;

  const update = (): void => {
    const { scrollTop, scrollHeight, clientHeight } = scrollEl;
    wrapper.classList.toggle("fade-top", scrollTop > 10);
    wrapper.classList.toggle("fade-bottom", scrollTop < scrollHeight - clientHeight - 10);
  };

  scrollEl.addEventListener("scroll", update);
  // Initial check after layout
  setTimeout(update, 100);
}

export function openDrawer(container: HTMLElement): void {
  drawerOpen = true;
  container.querySelector<HTMLElement>("#cart-drawer")?.classList.remove("collapsed");
}

export function closeDrawer(container: HTMLElement): void {
  drawerOpen = false;
  container.querySelector<HTMLElement>("#cart-drawer")?.classList.add("collapsed");
}

export function nudgeCartHandle(container: HTMLElement): void {
  if (drawerOpen) return;
  const handle = container.querySelector<HTMLElement>("#cart-handle");
  if (!handle) return;
  handle.classList.remove("nudge");
  void handle.offsetHeight; // restart animation
  handle.classList.add("nudge");
}

export function bounceCartCount(container: HTMLElement): void {
  const badge = container.querySelector<HTMLElement>("#cart-count");
  if (!badge) return;
  badge.classList.remove("bounce");
  void badge.offsetHeight;
  badge.classList.add("bounce");
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
  const normalized = hex.replace("#", "");
  const full = normalized.length === 3
    ? normalized.split("").map((c) => c + c).join("")
    : normalized;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
