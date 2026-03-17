export const BASE_STYLES = `
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    background: #222639;
    color: #e0e0e0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 14px;
    line-height: 1.4;
    overflow: hidden;
  }
  #app {
    display: flex;
    flex-direction: column;
    height: 100vh;
    padding: 12px;
    overflow-y: auto;
  }
  #app::-webkit-scrollbar {
    width: 6px;
  }
  #app::-webkit-scrollbar-thumb {
    background: #444;
    border-radius: 3px;
  }
  button {
    cursor: pointer;
    border: none;
    border-radius: 6px;
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 500;
    transition: background 0.15s, opacity 0.15s;
  }
  button:hover {
    opacity: 0.85;
  }
  button:active {
    opacity: 0.7;
  }
  button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .btn-primary {
    background: #bb86fc;
    color: #1a1a2e;
  }
  .btn-secondary {
    background: #444;
    color: #e0e0e0;
  }
  .btn-danger {
    background: #c0392b;
    color: #fff;
  }
  .btn-small {
    padding: 4px 10px;
    font-size: 12px;
  }
  input[type="text"],
  input[type="number"] {
    background: #1a1a2e;
    border: 1px solid #444;
    border-radius: 6px;
    color: #e0e0e0;
    padding: 6px 10px;
    font-size: 13px;
    width: 100%;
  }
  input[type="text"]:focus,
  input[type="number"]:focus {
    outline: none;
    border-color: #bb86fc;
  }
  label {
    font-size: 12px;
    color: #aaa;
    display: block;
    margin-bottom: 4px;
  }
  .section {
    margin-bottom: 12px;
  }
  .section-title {
    font-size: 12px;
    font-weight: 600;
    color: #bb86fc;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 6px;
  }
  .input-row {
    display: flex;
    gap: 6px;
    align-items: center;
  }
  .input-row input {
    flex: 1;
  }
  .scrollable {
    overflow-y: auto;
    flex: 1;
  }
  .scrollable::-webkit-scrollbar {
    width: 6px;
  }
  .scrollable::-webkit-scrollbar-track {
    background: transparent;
  }
  .scrollable::-webkit-scrollbar-thumb {
    background: #444;
    border-radius: 3px;
  }
`;
