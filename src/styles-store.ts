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
    padding: 15px 18px;
    background: #1a1a2e;
    border-bottom: 3px solid #bb86fc;
    flex-shrink: 0;
  }
  .store-header-info h1 {
    font-size: 24px;
    color: #bb86fc;
    margin-bottom: 2px;
  }
  .store-header-info p {
    font-size: 16px;
    color: #aaa;
  }
  .store-header-controls {
    display: flex;
    gap: 9px;
    align-items: center;
  }
  .btn-icon {
    background: transparent;
    color: #aaa;
    font-size: 24px;
    padding: 6px 12px;
    border-radius: 6px;
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
    width: 9px;
  }
  .items-list::-webkit-scrollbar-thumb {
    background: #444;
    border-radius: 4px;
  }
  .items-list-header {
    display: flex;
    align-items: center;
    padding: 9px 15px;
    background: #1a1a2e;
    border-bottom: 1px solid #444;
    font-size: 15px;
    font-weight: 600;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.75px;
    flex-shrink: 0;
  }
  .items-list-header .col-icon { width: 42px; flex-shrink: 0; }
  .items-list-header .col-name { flex: 1; padding-left: 9px; }
  .items-list-header .col-price { width: 120px; text-align: right; flex-shrink: 0; }
  .items-list-header .col-qty { width: 45px; text-align: center; flex-shrink: 0; }
  .item-row {
    display: flex;
    align-items: center;
    padding: 9px 15px;
    cursor: pointer;
    transition: background 0.1s;
    user-select: none;
    position: relative;
    border-left: 4px solid transparent;
  }
  .item-row:hover {
    background: rgba(255, 255, 255, 0.05);
  }
  .item-row:active {
    background: rgba(255, 255, 255, 0.1);
  }
  .item-row .item-image {
    width: 36px;
    height: 36px;
    border-radius: 6px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: rgba(255, 255, 255, 0.6);
    background: rgba(0, 0, 0, 0.3);
  }
  .item-row .item-image img {
    width: 100%;
    height: 100%;
    border-radius: 6px;
    object-fit: cover;
  }
  .item-row .item-name {
    flex: 1;
    font-size: 19px;
    font-weight: 500;
    color: #e0e0e0;
    padding-left: 9px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .item-row .item-price {
    width: 120px;
    text-align: right;
    font-size: 19px;
    font-weight: 600;
    flex-shrink: 0;
    white-space: nowrap;
  }
  .item-row .item-qty {
    width: 45px;
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    color: #bb86fc;
    flex-shrink: 0;
  }
  .cart-panel {
    border-top: 3px solid #bb86fc;
    background: #1a1a2e;
    padding: 15px 18px;
    flex-shrink: 0;
    max-height: 300px;
    overflow-y: auto;
  }
  .cart-panel::-webkit-scrollbar {
    width: 9px;
  }
  .cart-panel::-webkit-scrollbar-thumb {
    background: #444;
    border-radius: 4px;
  }
  .cart-title {
    font-size: 18px;
    font-weight: 600;
    color: #bb86fc;
    text-transform: uppercase;
    letter-spacing: 0.75px;
    margin-bottom: 9px;
  }
  .cart-empty {
    font-size: 18px;
    color: #666;
    font-style: italic;
  }
  .cart-player-group {
    margin-bottom: 9px;
  }
  .cart-player-name {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .cart-player-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .cart-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 18px;
    padding: 3px 0 3px 18px;
    color: #ccc;
  }
  .cart-item-name {
    flex: 1;
  }
  .cart-item-qty {
    color: #888;
    margin: 0 9px;
  }
  .cart-item-price {
    font-weight: 600;
    min-width: 75px;
    text-align: right;
  }
  .cart-item-remove {
    background: transparent;
    color: #666;
    border: none;
    font-size: 16px;
    padding: 3px 6px;
    margin-left: 6px;
    cursor: pointer;
    border-radius: 4px;
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
    font-size: 18px;
    padding: 4px 0 4px 18px;
    color: #aaa;
    border-top: 1px solid #333;
    margin-top: 4px;
  }
  .cart-total {
    display: flex;
    justify-content: space-between;
    font-size: 21px;
    font-weight: 700;
    padding-top: 9px;
    margin-top: 9px;
    border-top: 3px solid #444;
    color: #e0e0e0;
  }
  .description-popup {
    position: fixed;
    background: #2a2a4a;
    border: 1px solid #bb86fc;
    border-radius: 12px;
    padding: 18px;
    max-width: 375px;
    z-index: 1000;
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.6);
  }
  .description-popup h3 {
    font-size: 19px;
    color: #bb86fc;
    margin-bottom: 3px;
  }
  .description-popup .desc-type {
    font-size: 16px;
    color: #888;
    margin-bottom: 9px;
  }
  .description-popup .desc-rarity {
    font-size: 15px;
    text-transform: uppercase;
    letter-spacing: 0.75px;
    margin-bottom: 9px;
    font-weight: 600;
  }
  .description-popup p {
    font-size: 18px;
    color: #ccc;
    line-height: 1.4;
  }
  .grouping-header {
    font-size: 16px;
    font-weight: 600;
    color: #bb86fc;
    text-transform: uppercase;
    letter-spacing: 0.75px;
    padding: 12px 15px 6px;
    border-bottom: 1px solid #333;
    background: rgba(26, 26, 46, 0.5);
  }
`;
