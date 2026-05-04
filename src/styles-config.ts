export const CONFIG_STYLES = `
  .config-header {
    margin: 12px 12px 16px;
  }
  .config-header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .config-header h1 {
    font-family: 'Cinzel', serif;
    font-size: 18px;
    color: var(--stone-light);
    margin-bottom: 2px;
  }
  .config-header p {
    font-size: 11px;
    color: var(--text-secondary);
    font-style: italic;
  }
  .config-header-actions {
    display: flex;
    gap: 4px;
  }
  .config-header-actions .btn-icon {
    background: transparent;
    color: var(--text-secondary);
    font-size: 16px;
    padding: 4px 8px;
    border-radius: 4px;
    line-height: 1;
    cursor: pointer;
    border: none;
    transition: background 0.15s ease, color 0.15s ease;
  }
  .config-header-actions .btn-icon:hover {
    background: var(--bg-elevated);
    color: var(--text-primary);
  }
  .config-header-actions .btn-icon-primary { color: var(--verdigris-bright); }
  .config-header-actions .btn-icon-primary:hover {
    background: rgba(131, 196, 164, 0.12);
    color: var(--verdigris-bright);
  }
  .config-header-actions .btn-icon-danger { color: var(--danger); }
  .config-header-actions .btn-icon-danger:hover {
    background: rgba(196, 92, 79, 0.12);
    color: var(--danger);
  }

  .section { margin: 0 12px 12px; }

  .groupings-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .grouping-checkbox {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    cursor: pointer;
    color: var(--text-primary);
  }
  .grouping-checkbox input[type="checkbox"] {
    accent-color: var(--verdigris);
  }
  .no-catalog {
    color: var(--text-secondary);
    font-size: 12px;
    font-style: italic;
  }

  .store-status {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 12px;
    margin: 0 12px 12px;
    border: 1px solid var(--border);
  }
  .store-status.open {
    background: rgba(111, 170, 141, 0.12);
    color: var(--verdigris-bright);
    border-color: rgba(111, 170, 141, 0.35);
  }
  .store-status.closed {
    background: var(--bg-raised);
    color: var(--text-secondary);
  }
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .store-status.open .status-dot { background: var(--verdigris-bright); }
  .store-status.closed .status-dot { background: var(--text-dim); }

  .player-only-msg {
    text-align: center;
    padding: 40px 20px;
    color: var(--text-secondary);
  }
  .player-only-msg h2 {
    font-family: 'Cinzel', serif;
    font-size: 18px;
    color: var(--stone-light);
    margin-bottom: 8px;
  }
`;
