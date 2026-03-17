export const STORE_STYLES = `
  .storefront {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
  .store-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    background: #1a1a2e;
    border-bottom: 2px solid #bb86fc;
    flex-shrink: 0;
  }
  .store-header-info h1 {
    font-size: 16px;
    color: #bb86fc;
    margin-bottom: 1px;
  }
  .store-header-info p {
    font-size: 11px;
    color: #aaa;
  }
  .store-header-controls {
    display: flex;
    gap: 6px;
    align-items: center;
  }
  .btn-icon {
    background: transparent;
    color: #aaa;
    font-size: 16px;
    padding: 4px 8px;
    border-radius: 4px;
    line-height: 1;
  }
  .btn-icon:hover {
    background: #333;
    color: #e0e0e0;
  }
  .store-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .store-body.minimized {
    display: none;
  }
  .items-list {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    flex: 1;
  }
  .items-list::-webkit-scrollbar {
    width: 6px;
  }
  .items-list::-webkit-scrollbar-thumb {
    background: #444;
    border-radius: 3px;
  }
  .items-list-header {
    display: flex;
    align-items: center;
    padding: 6px 10px;
    background: #1a1a2e;
    border-bottom: 1px solid #444;
    font-size: 10px;
    font-weight: 600;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    flex-shrink: 0;
  }
  .items-list-header .col-icon { width: 28px; flex-shrink: 0; }
  .items-list-header .col-name { flex: 1; padding-left: 6px; }
  .items-list-header .col-price { width: 80px; text-align: right; flex-shrink: 0; }
  .items-list-header .col-qty { width: 30px; text-align: center; flex-shrink: 0; }
  .item-row {
    display: flex;
    align-items: center;
    padding: 6px 10px;
    cursor: pointer;
    transition: background 0.1s;
    user-select: none;
    position: relative;
    border-left: 3px solid transparent;
  }
  .item-row:hover {
    background: rgba(255, 255, 255, 0.05);
  }
  .item-row:active {
    background: rgba(255, 255, 255, 0.1);
  }
  .item-row .item-image {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
    background: rgba(0, 0, 0, 0.3);
  }
  .item-row .item-image img {
    width: 100%;
    height: 100%;
    border-radius: 4px;
    object-fit: cover;
  }
  .item-row .item-name {
    flex: 1;
    font-size: 13px;
    font-weight: 500;
    color: #e0e0e0;
    padding-left: 6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .item-row .item-price {
    width: 80px;
    text-align: right;
    font-size: 13px;
    font-weight: 600;
    flex-shrink: 0;
    white-space: nowrap;
  }
  .item-row .item-qty {
    width: 30px;
    text-align: center;
    font-size: 12px;
    font-weight: 600;
    color: #bb86fc;
    flex-shrink: 0;
  }
  .cart-panel {
    border-top: 2px solid #bb86fc;
    background: #1a1a2e;
    padding: 10px 12px;
    flex-shrink: 0;
    max-height: 200px;
    overflow-y: auto;
  }
  .cart-panel::-webkit-scrollbar {
    width: 6px;
  }
  .cart-panel::-webkit-scrollbar-thumb {
    background: #444;
    border-radius: 3px;
  }
  .cart-title {
    font-size: 12px;
    font-weight: 600;
    color: #bb86fc;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 6px;
  }
  .cart-empty {
    font-size: 12px;
    color: #666;
    font-style: italic;
  }
  .cart-player-group {
    margin-bottom: 6px;
  }
  .cart-player-name {
    font-size: 11px;
    font-weight: 600;
    margin-bottom: 3px;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .cart-player-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .cart-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    padding: 2px 0 2px 12px;
    color: #ccc;
  }
  .cart-item-name {
    flex: 1;
  }
  .cart-item-qty {
    color: #888;
    margin: 0 6px;
  }
  .cart-item-price {
    font-weight: 600;
    min-width: 50px;
    text-align: right;
  }
  .cart-item-remove {
    background: transparent;
    color: #666;
    border: none;
    font-size: 11px;
    padding: 2px 4px;
    margin-left: 4px;
    cursor: pointer;
    border-radius: 3px;
    line-height: 1;
    flex-shrink: 0;
  }
  .cart-item-remove:hover {
    color: #c0392b;
    background: rgba(192, 57, 43, 0.15);
  }
  .cart-subtotal {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    padding: 3px 0 3px 12px;
    color: #aaa;
    border-top: 1px solid #333;
    margin-top: 3px;
  }
  .cart-total {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    font-weight: 700;
    padding-top: 6px;
    margin-top: 6px;
    border-top: 2px solid #444;
    color: #e0e0e0;
  }
  .description-popup {
    position: fixed;
    background: #2a2a4a;
    border: 1px solid #bb86fc;
    border-radius: 8px;
    padding: 12px;
    max-width: 250px;
    z-index: 1000;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
  }
  .description-popup h3 {
    font-size: 13px;
    color: #bb86fc;
    margin-bottom: 2px;
  }
  .description-popup .desc-type {
    font-size: 11px;
    color: #888;
    margin-bottom: 6px;
  }
  .description-popup .desc-rarity {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 6px;
    font-weight: 600;
  }
  .description-popup p {
    font-size: 12px;
    color: #ccc;
    line-height: 1.4;
  }
  .grouping-header {
    font-size: 11px;
    font-weight: 600;
    color: #bb86fc;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 8px 10px 4px;
    border-bottom: 1px solid #333;
    background: rgba(26, 26, 46, 0.5);
  }
`;
