const FIRST_NAMES = [
  "Grunhild", "Thalia", "Mira", "Beldric", "Seraphina", "Drogon",
  "Elara", "Fenwick", "Isolde", "Jareth", "Kael", "Lysandra",
  "Mordecai", "Nyx", "Osric", "Petra", "Quillan", "Rowena",
  "Silas", "Tova", "Ulric", "Vex", "Wren", "Ysolde", "Zephyr",
  "Bramwell", "Corva", "Dunstan", "Eirik", "Freya",
];

const EPITHETS = [
  "the Bold", "One-Eye", "Silverhand", "the Shrewd", "Goldtooth",
  "the Fair", "Ironjaw", "Quickfingers", "the Wise", "Redcloak",
  "Half-Pint", "the Generous", "Copperkettle", "the Tall",
  "Brightsmile", "the Wanderer", "Two-Coins", "the Honest",
  "Dustyboots", "the Collector",
];

const ADJECTIVES = [
  "Golden", "Rusty", "Enchanted", "Gilded", "Dusty",
  "Silver", "Crimson", "Twisted", "Wandering", "Broken",
  "Prancing", "Copper", "Emerald", "Mystic", "Hollow",
  "Frozen", "Burning", "Hidden", "Lucky", "Iron",
];

const NOUNS = [
  "Anvil", "Cauldron", "Lantern", "Shield", "Goblet",
  "Tome", "Blade", "Barrel", "Compass", "Candle",
  "Unicorn", "Griffin", "Dragon", "Wand", "Helm",
  "Chalice", "Scepter", "Crown", "Stag", "Raven",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateNpcName(): string {
  const first = pick(FIRST_NAMES);
  if (Math.random() < 0.5) {
    return `${first} ${pick(EPITHETS)}`;
  }
  return first;
}

export function generateStoreName(): string {
  return `The ${pick(ADJECTIVES)} ${pick(NOUNS)}`;
}
