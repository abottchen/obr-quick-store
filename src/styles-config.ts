export const CONFIG_STYLES = `
  .config-header {
    text-align: center;
    margin-bottom: 12px;
  }
  .config-header h1 {
    font-size: 16px;
    color: #bb86fc;
    margin-bottom: 2px;
  }
  .config-header p {
    font-size: 11px;
    color: #888;
  }
  .groupings-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
    max-height: 120px;
    overflow-y: auto;
  }
  .grouping-checkbox {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    cursor: pointer;
  }
  .grouping-checkbox input[type="checkbox"] {
    accent-color: #bb86fc;
  }
  .no-catalog {
    color: #888;
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
    margin-bottom: 12px;
  }
  .store-status.open {
    background: rgba(26, 122, 26, 0.2);
    color: #4caf50;
  }
  .store-status.closed {
    background: rgba(136, 136, 136, 0.1);
    color: #888;
  }
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .store-status.open .status-dot {
    background: #4caf50;
  }
  .store-status.closed .status-dot {
    background: #888;
  }
  .player-only-msg {
    text-align: center;
    padding: 40px 20px;
    color: #888;
  }
  .player-only-msg h2 {
    font-size: 16px;
    color: #bb86fc;
    margin-bottom: 8px;
  }
  .actions {
    display: flex;
    gap: 8px;
    margin-top: 8px;
  }
  .actions button {
    flex: 1;
  }
`;
