export const BASE_STYLES = `
  :root {
    --bg-deepest: #1a1719;
    --bg-surface: #22201f;
    --bg-raised: #2c2926;
    --bg-elevated: #37332f;
    --bg-hover: #3f3a35;

    --stone-warm: #c4a882;
    --stone-light: #ddd0be;
    --stone-mid: #8a7e6f;

    --verdigris: #6faa8d;
    --verdigris-bright: #83c4a4;
    --verdigris-dim: #4a7d65;

    --terracotta: #c47a5a;
    --terracotta-dim: #9e5e42;

    --text-primary: #dcd5cb;
    --text-secondary: #9e9588;
    --text-dim: #665e54;

    --border: #3d3731;
    --border-light: #524a42;
    --border-warm: #5c4f3e;

    --danger: #c45c4f;
    --success: #6faa8d;

    --rarity-common: #7a7a7a;
    --rarity-uncommon: #4db87a;
    --rarity-rare: #4a9edb;
    --rarity-very-rare: #a87bdb;
    --rarity-legendary: #e8943a;

    --currency-gp: #e8c84a;
    --currency-sp: #b8b8b8;
    --currency-cp: #c47d3a;
    --currency-pp: #c8c8d4;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background: #0f0e0d;
    color: var(--text-primary);
    font-family: 'Nunito Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 14px;
    line-height: 1.5;
    overflow: hidden;
  }

  body::before {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    opacity: 0.02;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    z-index: 9999;
  }

  h1, h2, h3 {
    font-family: 'Cinzel', serif;
    font-weight: 500;
    letter-spacing: 0.02em;
  }

  #app {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow-y: auto;
  }
  #app::-webkit-scrollbar { width: 6px; }
  #app::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

  button {
    cursor: pointer;
    border: none;
    border-radius: 6px;
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 500;
    font-family: 'Nunito Sans', sans-serif;
    transition: background 0.15s ease, opacity 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  }
  button:hover { opacity: 0.9; }
  button:active { opacity: 0.75; }
  button:disabled { opacity: 0.4; cursor: not-allowed; }

  .btn-primary {
    background: var(--verdigris-dim);
    color: var(--text-primary);
    border: 1px solid var(--verdigris);
  }
  .btn-primary:hover {
    background: var(--verdigris);
    box-shadow: 0 0 8px rgba(111, 170, 141, 0.3);
  }
  .btn-secondary {
    background: var(--bg-raised);
    color: var(--text-secondary);
    border: 1px solid var(--border);
  }
  .btn-secondary:hover {
    background: var(--bg-elevated);
    border-color: var(--border-light);
    color: var(--text-primary);
  }
  .btn-danger {
    background: transparent;
    color: var(--danger);
    border: 1px solid var(--danger);
  }
  .btn-danger:hover {
    background: rgba(196, 92, 79, 0.12);
  }
  .btn-small {
    padding: 4px 10px;
    font-size: 12px;
  }

  input[type="text"],
  input[type="number"] {
    background: var(--bg-deepest);
    border: 1px solid var(--border);
    border-radius: 6px;
    color: var(--text-primary);
    padding: 7px 10px;
    font-size: 13px;
    font-family: 'Nunito Sans', sans-serif;
    width: 100%;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }
  input[type="text"]:focus,
  input[type="number"]:focus {
    outline: none;
    border-color: var(--verdigris-dim);
    box-shadow: 0 0 0 3px rgba(111, 170, 141, 0.08);
  }
  input::placeholder { color: var(--text-dim); }

  label {
    font-size: 12px;
    color: var(--text-secondary);
    display: block;
    margin-bottom: 4px;
  }

  .section { margin-bottom: 12px; }
  .section-title {
    font-family: 'Cinzel', serif;
    font-size: 12px;
    font-weight: 500;
    color: var(--stone-warm);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 6px;
  }

  .input-row { display: flex; gap: 6px; align-items: center; }
  .input-row input { flex: 1; }

  .scrollable {
    overflow-y: auto;
    flex: 1;
  }
  .scrollable::-webkit-scrollbar { width: 7px; }
  .scrollable::-webkit-scrollbar-track { background: transparent; }
  .scrollable::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
  .scrollable::-webkit-scrollbar-thumb:hover { background: var(--border-light); }
`;
