export const STORE_STYLES = `
  /* ===== Keyframes ===== */
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.9) translateY(6px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes cartSlideIn {
    from { opacity: 0; transform: translateX(-12px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes flyToCart {
    0% { opacity: 1; transform: translate(0, 0) scale(1); }
    50% { opacity: 0.8; transform: translate(var(--fly-x, 0), var(--fly-y, -30px)) scale(0.6); }
    100% { opacity: 0; transform: translate(var(--fly-x, 0), var(--fly-y, 60px)) scale(0.3); }
  }
  @keyframes qtyPulse {
    0% { transform: scale(1); }
    40% { transform: scale(1.5); color: #a8f0ca; text-shadow: 0 0 8px rgba(131, 196, 164, 0.6); }
    100% { transform: scale(1); }
  }
  @keyframes qtyDecrease {
    0% { transform: scale(1); }
    40% { transform: scale(0.65); color: #ff8a7a; text-shadow: 0 0 8px rgba(196, 92, 79, 0.6); }
    100% { transform: scale(1); }
  }
  @keyframes goldPulseUp {
    0% { transform: scale(1); filter: brightness(1); }
    40% { transform: scale(1.12); filter: brightness(1.6); text-shadow: 0 0 6px rgba(232, 200, 74, 0.5); }
    100% { transform: scale(1); filter: brightness(1); }
  }
  @keyframes goldPulseDown {
    0% { transform: scale(1); filter: brightness(1); }
    40% { transform: scale(0.9); filter: brightness(1.6); text-shadow: 0 0 6px rgba(196, 92, 79, 0.5); }
    100% { transform: scale(1); filter: brightness(1); }
  }
  @keyframes rowFlash {
    0% { box-shadow: inset 0 0 0 1px var(--verdigris), 0 0 12px rgba(111, 170, 141, 0.2); }
    100% { box-shadow: inset 0 0 0 1px var(--border), 0 0 0px transparent; }
  }
  @keyframes cartCountBounce {
    0% { transform: scale(1); background: var(--verdigris-dim); }
    50% { transform: scale(1.4); background: var(--verdigris-bright); box-shadow: 0 0 10px rgba(131, 196, 164, 0.5); }
    100% { transform: scale(1); background: var(--verdigris-dim); }
  }
  @keyframes legendaryGlow {
    0%, 100% { box-shadow: 0 0 8px rgba(232, 148, 58, 0.35), 0 0 20px rgba(232, 148, 58, 0.15), inset 0 0 0 1px rgba(232, 148, 58, 0.2); }
    50% { box-shadow: 0 0 16px rgba(232, 148, 58, 0.55), 0 0 35px rgba(232, 148, 58, 0.25), inset 0 0 0 1px rgba(232, 148, 58, 0.35); }
  }
  @keyframes veryRareGlow {
    0%, 100% { box-shadow: 0 0 6px rgba(168, 123, 219, 0.25), 0 0 15px rgba(168, 123, 219, 0.1); }
    50% { box-shadow: 0 0 12px rgba(168, 123, 219, 0.45), 0 0 25px rgba(168, 123, 219, 0.15); }
  }
  @keyframes headerGradientShift {
    0% { background-position: 0% center; opacity: 0.4; }
    50% { background-position: 100% center; opacity: 0.75; }
    100% { background-position: 0% center; opacity: 0.4; }
  }
  @keyframes coinSheen {
    0% { transform: rotate(0deg); opacity: 0; }
    10% { opacity: 0.6; }
    30% { opacity: 0; }
    100% { transform: rotate(0deg); opacity: 0; }
  }
  @keyframes handleNudge {
    0% { transform: translateY(0); }
    30% { transform: translateY(-3px); }
    60% { transform: translateY(1px); }
    100% { transform: translateY(0); }
  }

  /* ===== Layout ===== */
  .storefront {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: var(--bg-surface);
  }

  .store-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 22px;
    background: linear-gradient(180deg, var(--bg-raised) 0%, var(--bg-surface) 100%);
    border-bottom: 1px solid var(--border);
    position: relative;
    flex-shrink: 0;
  }
  .store-header::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg,
      transparent 0%,
      var(--stone-mid) 10%,
      var(--stone-warm) 25%,
      var(--verdigris-bright) 50%,
      var(--stone-warm) 75%,
      var(--stone-mid) 90%,
      transparent 100%
    );
    background-size: 200% 100%;
    animation: headerGradientShift 7s ease-in-out infinite;
  }
  .store-header-info h1 {
    font-size: 22px;
    color: var(--stone-light);
    margin-bottom: 2px;
  }
  .store-header-info p {
    font-size: 13px;
    color: var(--stone-mid);
    font-style: italic;
  }
  .store-header-controls { display: flex; gap: 6px; }

  .btn-icon {
    background: transparent;
    border: none;
    color: var(--text-secondary);
    font-size: 18px;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s ease;
    line-height: 1;
  }
  .btn-icon:hover {
    background: var(--bg-elevated);
    color: var(--text-primary);
  }

  .store-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-height: 0;
  }
  .store-body.minimized { display: none; }

  /* Toolbar (search + collapse-all) */
  .toolbar {
    display: flex;
    align-items: center;
    padding: 10px 18px;
    gap: 8px;
    background: var(--bg-surface);
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }
  .toolbar input {
    flex: 1;
    background: var(--bg-deepest);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text-primary);
    padding: 9px 14px;
    font-size: 13px;
    font-family: 'Nunito Sans', sans-serif;
    transition: border-color 0.2s ease, box-shadow 0.3s ease;
  }
  .toolbar input:focus {
    outline: none;
    border-color: var(--verdigris-dim);
    box-shadow: 0 0 0 3px rgba(111, 170, 141, 0.08), inset 0 1px 3px rgba(0,0,0,0.2);
  }
  .toolbar input::placeholder { color: var(--text-dim); }

  .toolbar-btn {
    background: var(--bg-raised);
    border: 1px solid var(--border);
    border-radius: 6px;
    color: var(--text-secondary);
    padding: 8px 10px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.15s ease;
    white-space: nowrap;
    font-family: 'Nunito Sans', sans-serif;
    line-height: 1;
  }
  .toolbar-btn:hover {
    background: var(--bg-elevated);
    border-color: var(--border-light);
    color: var(--text-primary);
  }

  .items-list-header {
    display: flex;
    align-items: center;
    padding: 7px 18px;
    background: var(--bg-raised);
    border-bottom: 1px solid var(--border);
    font-size: 10px;
    font-weight: 700;
    color: var(--text-dim);
    text-transform: uppercase;
    letter-spacing: 1.2px;
    flex-shrink: 0;
  }
  .items-list-header .col-icon { width: 44px; flex-shrink: 0; }
  .items-list-header .col-name { flex: 1; padding-left: 10px; }
  .items-list-header .col-price { width: 100px; text-align: right; flex-shrink: 0; padding-right: 12px; }

  /* Items scroll wrapper with fade edges */
  .items-scroll-wrapper {
    flex: 1;
    min-height: 0;
    position: relative;
  }
  .items-scroll-wrapper::before,
  .items-scroll-wrapper::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 20px;
    pointer-events: none;
    z-index: 2;
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  .items-scroll-wrapper::before {
    top: 0;
    background: linear-gradient(to bottom, var(--bg-surface), transparent);
  }
  .items-scroll-wrapper::after {
    bottom: 0;
    background: linear-gradient(to top, var(--bg-surface), transparent);
  }
  .items-scroll-wrapper.fade-top::before { opacity: 1; }
  .items-scroll-wrapper.fade-bottom::after { opacity: 1; }

  .items-scroll {
    height: 100%;
    overflow-y: auto;
    scroll-behavior: smooth;
  }
  .items-scroll::-webkit-scrollbar { width: 7px; }
  .items-scroll::-webkit-scrollbar-track { background: transparent; }
  .items-scroll::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
  .items-scroll::-webkit-scrollbar-thumb:hover { background: var(--border-light); }

  /* Group headers */
  .grouping-header {
    font-family: 'Cinzel', serif;
    font-size: 12px;
    font-weight: 500;
    color: var(--stone-warm);
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 11px 18px 9px;
    background: var(--bg-raised);
    border-bottom: 1px solid var(--border);
    cursor: pointer;
    user-select: none;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: background 0.15s ease, color 0.15s ease;
  }
  .grouping-header:hover {
    background: var(--bg-elevated);
    color: var(--stone-light);
  }
  .grouping-arrow {
    font-size: 9px;
    color: var(--stone-mid);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: inline-block;
  }
  .grouping-arrow.expanded { transform: rotate(90deg); }
  .grouping-count {
    font-family: 'Nunito Sans', sans-serif;
    font-size: 11px;
    color: var(--text-dim);
    font-weight: 400;
    margin-left: auto;
  }

  .grouping-items {
    overflow: hidden;
    transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease;
  }
  .grouping-items.collapsed {
    max-height: 0 !important;
    opacity: 0;
  }

  /* Item rows */
  .item-row {
    display: flex;
    align-items: center;
    padding: 8px 14px;
    margin: 4px 10px;
    cursor: pointer;
    user-select: none;
    position: relative;
    border-left: 3px solid transparent;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: var(--bg-surface);
    transition: all 0.2s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  }
  .item-row:hover {
    background: var(--bg-raised);
    border-color: var(--stone-mid);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25), inset 0 0 0 1px rgba(184, 169, 146, 0.08);
    transform: translateY(-1px);
  }
  .item-row:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    background: var(--bg-elevated);
  }
  .item-row.flash { animation: rowFlash 0.6s ease; }

  .item-image {
    width: 36px;
    height: 36px;
    border-radius: 7px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 700;
    font-family: 'Cinzel', serif;
    color: rgba(255, 255, 255, 0.7);
    background: var(--bg-deepest);
    border: 1px solid var(--border);
    overflow: hidden;
    transition: border-color 0.2s ease, box-shadow 0.3s ease;
  }
  .item-image img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .item-row:hover .item-image {
    border-color: var(--border-light);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .item-name {
    flex: 1;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary);
    padding-left: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .item-price {
    text-align: right;
    font-family: 'Cormorant Garamond', serif;
    font-size: 19px;
    font-weight: 600;
    flex-shrink: 0;
    font-variant-numeric: tabular-nums;
    padding-right: 4px;
    transition: filter 0.2s ease, text-shadow 0.2s ease;
  }
  .item-row:hover .item-price {
    filter: brightness(1.3);
    text-shadow: 0 0 4px currentColor;
  }

  /* Rarity treatments on item rows */
  .item-row.rarity-uncommon { border-left: 3px solid var(--rarity-uncommon); }
  .item-row.rarity-rare {
    border-left: 3px solid var(--rarity-rare);
    background: linear-gradient(90deg, rgba(74, 158, 219, 0.03) 0%, transparent 40%);
  }
  .item-row.rarity-rare:hover { border-color: var(--rarity-rare); }
  .item-row.rarity-rare .item-image {
    border-color: rgba(74, 158, 219, 0.35);
    box-shadow: 0 0 8px rgba(74, 158, 219, 0.12);
  }
  .item-row.rarity-very-rare {
    border-left: 3px solid var(--rarity-very-rare);
    background: linear-gradient(90deg, rgba(168, 123, 219, 0.03) 0%, transparent 40%);
    animation: veryRareGlow 4s ease-in-out infinite;
  }
  .item-row.rarity-very-rare .item-image {
    border-color: rgba(168, 123, 219, 0.35);
    box-shadow: 0 0 8px rgba(168, 123, 219, 0.12);
  }
  .item-row.rarity-legendary {
    border-left: 3px solid var(--rarity-legendary);
    background: linear-gradient(90deg, rgba(232, 148, 58, 0.05) 0%, transparent 50%);
    animation: legendaryGlow 3s ease-in-out infinite;
  }
  .item-row.rarity-legendary:hover {
    border-color: var(--rarity-legendary);
    box-shadow: 0 2px 12px rgba(232, 148, 58, 0.25), inset 0 0 0 1px rgba(232, 148, 58, 0.15);
  }
  .item-row.rarity-legendary .item-image {
    border-color: rgba(232, 148, 58, 0.4);
    box-shadow: 0 0 10px rgba(232, 148, 58, 0.2);
  }

  /* ===== Cart drawer (bottom-sheet flex child) ===== */
  .cart-drawer {
    flex-shrink: 0;
    background: var(--bg-raised);
    border-top: 1px solid var(--border-light);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    max-height: 350px;
    position: relative;
  }
  .cart-drawer::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--verdigris-dim), var(--stone-warm), var(--verdigris-dim), transparent);
    opacity: 0.35;
  }
  .cart-drawer.collapsed { max-height: 52px; }

  .cart-drawer-handle {
    padding: 14px 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    transition: background 0.15s ease;
  }
  .cart-drawer-handle:hover { background: var(--bg-elevated); }
  .cart-drawer-handle.nudge { animation: handleNudge 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
  .cart-drawer-handle-left { display: flex; align-items: center; gap: 10px; }

  .cart-title {
    font-family: 'Cinzel', serif;
    font-size: 13px;
    font-weight: 500;
    color: var(--stone-warm);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .cart-count-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    border-radius: 10px;
    background: var(--verdigris-dim);
    color: var(--text-primary);
    font-size: 11px;
    font-weight: 700;
    padding: 0 5px;
    transition: transform 0.2s ease;
  }
  .cart-count-badge.bounce { animation: cartCountBounce 0.3s ease; }

  .cart-total-preview {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px;
    font-weight: 600;
    color: var(--stone-light);
  }

  .cart-drawer-arrow {
    font-size: 10px;
    color: var(--stone-mid);
    transition: transform 0.3s ease;
    margin-left: 8px;
  }
  .cart-drawer.collapsed .cart-drawer-arrow { transform: rotate(180deg); }

  .cart-drawer-content {
    overflow-y: auto;
    padding: 0 20px 12px;
    flex: 1;
    min-height: 0;
  }
  .cart-drawer-content::-webkit-scrollbar { width: 6px; }
  .cart-drawer-content::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

  .cart-empty {
    font-size: 13px;
    color: var(--text-dim);
    font-style: italic;
    padding: 4px 0;
  }

  .cart-player-group { margin-bottom: 10px; }

  .cart-player-name {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 6px;
    padding-bottom: 4px;
    border-bottom: 1px solid var(--border);
  }
  .cart-player-dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .cart-item {
    display: flex;
    align-items: center;
    font-size: 13px;
    padding: 5px 8px 5px 12px;
    color: var(--text-primary);
    border-radius: 6px;
    transition: background 0.15s ease;
    border-left: 3px solid transparent;
  }
  .cart-item.slide-in { animation: cartSlideIn 0.25s ease both; }
  .cart-item:hover { background: var(--bg-elevated); }
  .cart-item-rarity-pip {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
    margin-right: 8px;
  }
  .cart-item-name {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .cart-item-controls {
    display: flex;
    align-items: center;
    gap: 2px;
    margin: 0 8px;
  }
  .cart-qty-btn {
    background: var(--bg-deepest);
    border: 1px solid var(--border);
    color: var(--text-secondary);
    width: 22px;
    height: 22px;
    border-radius: 5px;
    font-size: 14px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s ease;
    line-height: 1;
    padding: 0;
  }
  .cart-qty-btn:hover {
    background: var(--bg-elevated);
    border-color: var(--border-light);
    color: var(--text-primary);
  }
  .cart-qty-btn.minus:hover {
    border-color: var(--danger);
    color: var(--danger);
  }
  .cart-qty-btn.plus:hover {
    border-color: var(--verdigris);
    color: var(--verdigris);
  }
  .cart-qty-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .cart-item-qty {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px;
    font-weight: 700;
    color: var(--text-primary);
    min-width: 22px;
    text-align: center;
    transition: transform 0.2s ease, color 0.2s ease;
  }
  .cart-item-qty.pulse-up { animation: qtyPulse 0.3s ease; }
  .cart-item-qty.pulse-down { animation: qtyDecrease 0.3s ease; }

  .cart-item-price {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 600;
    min-width: 60px;
    text-align: right;
    font-variant-numeric: tabular-nums;
    font-size: 18px;
    display: inline-block;
  }
  .cart-item-price.pulse-gold-up { animation: goldPulseUp 0.35s ease; }
  .cart-item-price.pulse-gold-down { animation: goldPulseDown 0.35s ease; }

  .cart-subtotal {
    display: flex;
    justify-content: space-between;
    font-family: 'Cormorant Garamond', serif;
    font-size: 17px;
    font-weight: 600;
    padding: 6px 0 4px 15px;
    color: var(--text-secondary);
    border-top: 1px dashed var(--border);
    margin-top: 4px;
  }
  .cart-subtotal > span:first-child {
    font-family: 'Nunito Sans', sans-serif;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }
  .cart-subtotal .pulse-gold-up { animation: goldPulseUp 0.35s ease; display: inline-block; }
  .cart-subtotal .pulse-gold-down { animation: goldPulseDown 0.35s ease; display: inline-block; }

  .cart-grand-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    font-weight: 600;
    padding: 10px 20px;
    color: var(--stone-light);
    border-top: 1px solid var(--border-light);
    background: var(--bg-elevated);
    flex-shrink: 0;
    font-variant-numeric: tabular-nums;
  }
  .cart-grand-total > span:first-child {
    font-family: 'Cinzel', serif;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.5px;
  }
  .cart-grand-total .pulse-gold-up { animation: goldPulseUp 0.4s ease; display: inline-block; }
  .cart-grand-total .pulse-gold-down { animation: goldPulseDown 0.4s ease; display: inline-block; }

  /* Fly particle */
  .fly-particle {
    position: fixed;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 700;
    color: white;
    animation: flyToCart 0.45s cubic-bezier(0.4, 0, 0.6, 1) forwards;
  }

  /* ===== Description popup ===== */
  .description-popup {
    position: fixed;
    background: var(--bg-elevated);
    border: 1px solid var(--border-light);
    border-radius: 12px;
    padding: 0;
    width: 340px;
    z-index: 1000;
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(184, 169, 146, 0.1);
    animation: scaleIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.08) both;
    overflow: hidden;
  }
  .description-popup.rarity-legendary {
    border-color: rgba(232, 148, 58, 0.4);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.7), 0 0 20px rgba(232, 148, 58, 0.25), 0 0 40px rgba(232, 148, 58, 0.1);
    animation: scaleIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.08) both, legendaryGlow 3s ease-in-out infinite 0.2s;
  }
  .description-popup.rarity-very-rare {
    border-color: rgba(168, 123, 219, 0.35);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.7), 0 0 16px rgba(168, 123, 219, 0.2), 0 0 30px rgba(168, 123, 219, 0.08);
    animation: scaleIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.08) both, veryRareGlow 4s ease-in-out infinite 0.2s;
  }
  .description-popup.rarity-rare {
    border-color: rgba(74, 158, 219, 0.3);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.7), 0 0 12px rgba(74, 158, 219, 0.15);
  }
  .description-popup.rarity-uncommon {
    border-color: rgba(77, 184, 122, 0.3);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.7), 0 0 10px rgba(77, 184, 122, 0.12);
  }

  .desc-header {
    display: flex;
    gap: 14px;
    padding: 16px 18px;
    background: var(--bg-raised);
    border-bottom: 1px solid var(--border);
  }
  .desc-image {
    width: 52px;
    height: 52px;
    border-radius: 8px;
    background: var(--bg-deepest);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Cinzel', serif;
    font-size: 20px;
    flex-shrink: 0;
    overflow: hidden;
  }
  .desc-image img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .desc-header-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 3px;
    min-width: 0;
  }
  .description-popup h3 {
    font-size: 15px;
    color: var(--stone-light);
    line-height: 1.2;
  }
  .desc-meta {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .desc-type {
    font-size: 12px;
    color: var(--text-secondary);
  }
  .desc-rarity {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.75px;
    padding: 1px 6px;
    border-radius: 3px;
    background: rgba(255,255,255,0.04);
    border: 1px solid currentColor;
    opacity: 0.85;
  }
  .desc-price-line { margin-top: 2px; }

  .desc-body-text {
    font-size: 13px;
    color: var(--text-primary);
    line-height: 1.7;
    padding: 14px 18px;
  }
  .desc-body-text::first-letter {
    font-family: 'Cinzel', serif;
    font-size: 2.4em;
    font-weight: 700;
    float: left;
    line-height: 0.85;
    margin-right: 6px;
    margin-top: 2px;
    color: var(--stone-light);
  }

  .desc-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 18px;
    border-top: 1px solid var(--border);
    background: var(--bg-raised);
  }
  .desc-add-btn {
    background: var(--verdigris-dim);
    border: 1px solid var(--verdigris);
    color: var(--text-primary);
    border-radius: 6px;
    padding: 6px 14px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
    font-family: 'Nunito Sans', sans-serif;
  }
  .desc-add-btn:hover {
    background: var(--verdigris);
    box-shadow: 0 0 8px rgba(111, 170, 141, 0.3);
  }
  .desc-qty-controls {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .desc-qty-btn {
    background: var(--bg-deepest);
    border: 1px solid var(--border);
    color: var(--text-secondary);
    width: 26px;
    height: 26px;
    border-radius: 6px;
    font-size: 15px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s ease;
    line-height: 1;
    padding: 0;
  }
  .desc-qty-btn:hover {
    background: var(--bg-elevated);
    border-color: var(--border-light);
    color: var(--text-primary);
  }
  .desc-qty-btn.minus:hover { border-color: var(--danger); color: var(--danger); }
  .desc-qty-btn.plus:hover { border-color: var(--verdigris); color: var(--verdigris); }
  .desc-qty-value {
    font-size: 14px;
    font-weight: 700;
    min-width: 24px;
    text-align: center;
    color: var(--verdigris-bright);
  }
  .desc-qty-value.pulse-up { animation: qtyPulse 0.3s ease; }
  .desc-qty-value.pulse-down { animation: qtyDecrease 0.3s ease; }
  .desc-qty-label {
    font-size: 11px;
    color: var(--text-dim);
    margin-left: 4px;
  }
  .desc-remove-all {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text-dim);
    border-radius: 6px;
    padding: 6px 10px;
    font-size: 11px;
    cursor: pointer;
    transition: all 0.15s ease;
    margin-left: auto;
    font-family: 'Nunito Sans', sans-serif;
  }
  .desc-remove-all:hover {
    border-color: var(--danger);
    color: var(--danger);
    background: rgba(196, 92, 79, 0.08);
  }

  /* ===== Coins ===== */
  .coin {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-family: 'Cormorant Garamond', serif;
    font-size: inherit;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
  .coin-icon {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    display: inline-block;
    flex-shrink: 0;
    position: relative;
    box-shadow: inset 0 -2px 3px rgba(0,0,0,0.35), inset 0 1px 2px rgba(255,255,255,0.25), 0 1px 2px rgba(0,0,0,0.4);
    overflow: hidden;
  }
  .coin-icon::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -6px;
    width: 8px;
    height: 20px;
    background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%);
    transform: rotate(20deg);
    animation: coinSheen 4s ease-in-out infinite;
    animation-delay: var(--sheen-delay, 0s);
  }
  .coin-icon-gp { background: radial-gradient(ellipse at 35% 30%, #ffe066, #d4a520 50%, #a67c00); }
  .coin-icon-sp { background: radial-gradient(ellipse at 35% 30%, #e8e8e8, #a8a8a8 50%, #787878); }
  .coin-icon-cp { background: radial-gradient(ellipse at 35% 30%, #e09050, #b87333 50%, #8a5522); }
  .coin-icon-pp { background: radial-gradient(ellipse at 35% 30%, #e8e8f0, #c0c0d0 50%, #9090a8); }

  .currency-gp { color: var(--currency-gp); }
  .currency-sp { color: var(--currency-sp); }
  .currency-cp { color: var(--currency-cp); }
  .currency-pp { color: var(--currency-pp); }
`;
