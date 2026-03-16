import OBR from "@owlbear-rodeo/sdk";
import { BASE_STYLES } from "./styles";
import { STORE_STYLES } from "./styles-store";
import { initStorefront } from "./ui-store";

OBR.onReady(async () => {
  const style = document.createElement("style");
  style.textContent = BASE_STYLES + STORE_STYLES;
  document.head.appendChild(style);

  const app = document.getElementById("app")!;
  await initStorefront(app);
});
