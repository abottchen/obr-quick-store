export const CONFIG_STYLES = `
  .config-header {
    margin-bottom: 12px;
  }
  .config-header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
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
  .config-header-actions {
    display: flex;
    gap: 4px;
  }
  .config-header-actions .btn-icon {
    background: transparent;
    color: #aaa;
    font-size: 16px;
    padding: 4px 8px;
    border-radius: 4px;
    line-height: 1;
    cursor: pointer;
    border: none;
  }
  .config-header-actions .btn-icon:hover {
    background: #333;
    color: #e0e0e0;
  }
  .config-header-actions .btn-icon-primary {
    color: #4caf50;
  }
  .config-header-actions .btn-icon-primary:hover {
    background: rgba(76, 175, 80, 0.15);
    color: #4caf50;
  }
  .config-header-actions .btn-icon-danger {
    color: #c0392b;
  }
  .config-header-actions .btn-icon-danger:hover {
    background: rgba(192, 57, 43, 0.15);
    color: #c0392b;
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
  .debug-section {
    border-top: 1px solid #333;
    padding-top: 12px;
    margin-top: 12px;
  }
  .btn-danger-text {
    color: #c0392b !important;
  }
  .btn-danger-text:hover {
    background: rgba(192, 57, 43, 0.15) !important;
  }
  .metadata-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  .metadata-modal {
    background: #1e1e2e;
    border: 1px solid #bb86fc;
    border-radius: 8px;
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
  }
  .metadata-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    border-bottom: 1px solid #333;
    font-size: 13px;
    font-weight: 600;
    color: #bb86fc;
  }
  .metadata-modal-header .btn-icon {
    font-size: 14px;
    padding: 2px 6px;
  }
  .metadata-modal-body {
    padding: 12px;
    overflow: auto;
    flex: 1;
    font-size: 11px;
    color: #ccc;
    white-space: pre-wrap;
    word-break: break-word;
    margin: 0;
    font-family: monospace;
  }
`;
