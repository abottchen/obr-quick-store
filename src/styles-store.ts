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
  .items-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 8px;
    padding: 10px;
    overflow-y: auto;
    flex: 1;
  }
  .items-grid::-webkit-scrollbar {
    width: 6px;
  }
  .items-grid::-webkit-scrollbar-thumb {
    background: #444;
    border-radius: 3px;
  }
  .item-card {
    border-radius: 8px;
    padding: 10px;
    cursor: pointer;
    transition: transform 0.1s, box-shadow 0.1s;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    position: relative;
    user-select: none;
  }
  .item-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  }
  .item-card:active {
    transform: translateY(0);
  }
  .item-card .item-image {
    width: 48px;
    height: 48px;
    border-radius: 6px;
    margin-bottom: 6px;
    object-fit: cover;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: rgba(255, 255, 255, 0.5);
  }
  .item-card .item-image img {
    width: 100%;
    height: 100%;
    border-radius: 6px;
    object-fit: cover;
  }
  .item-card .item-name {
    font-size: 12px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 2px;
    line-height: 1.2;
  }
  .item-card .item-type {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 4px;
  }
  .item-card .item-price {
    font-size: 13px;
    font-weight: 700;
    color: #ffd700;
  }
  .item-card .added-badge {
    position: absolute;
    top: 4px;
    right: 4px;
    background: #bb86fc;
    color: #1a1a2e;
    font-size: 10px;
    font-weight: 700;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
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
    color: #ffd700;
    font-weight: 600;
    min-width: 50px;
    text-align: right;
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
    color: #ffd700;
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
    grid-column: 1 / -1;
    font-size: 12px;
    font-weight: 600;
    color: #bb86fc;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 6px 0 2px;
    border-bottom: 1px solid #333;
  }
`;
