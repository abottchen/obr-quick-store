import OBR from "@owlbear-rodeo/sdk";
import { BASE_STYLES } from "./styles";
import { CONFIG_STYLES } from "./styles-config";
import { renderConfigUI, renderPlayerMessage } from "./ui-config";
import { getStoreMetadata, onStoreMetadataChange } from "./metadata";
import { fetchCatalog } from "./catalog";
import { BROADCAST_CHANNEL, POPOVER_STORE_ID } from "./constants";

OBR.onReady(async () => {
  const style = document.createElement("style");
  style.textContent = BASE_STYLES + CONFIG_STYLES;
  document.head.appendChild(style);

  const app = document.getElementById("app")!;
  const role = await OBR.player.getRole();

  OBR.broadcast.onMessage(BROADCAST_CHANNEL, (event) => {
    const msg = event.data as { action: string };
    if (msg.action === "open") {
      openStorefront();
    } else if (msg.action === "close") {
      OBR.popover.close(POPOVER_STORE_ID);
    }
  });

  const meta = await getStoreMetadata();
  if (meta.config.isOpen) {
    openStorefront();
  }

  if (role !== "GM") {
    renderPlayerMessage(app);
    return;
  }

  const catalog = await fetchCatalog(meta.config.catalogUrl);
  renderConfigUI(app, { catalog, ...meta });

  onStoreMetadataChange(async (updated) => {
    const freshCatalog = await fetchCatalog(updated.config.catalogUrl);
    renderConfigUI(app, { catalog: freshCatalog, ...updated });
  });
});

function openStorefront(): void {
  const baseUrl = new URL(".", document.location.href).href;
  OBR.popover.open({
    id: POPOVER_STORE_ID,
    url: `${baseUrl}store.html`,
    height: 600,
    width: 500,
    anchorPosition: { top: 100, left: window.innerWidth * 0.55 },
    anchorOrigin: { horizontal: "CENTER", vertical: "TOP" },
    disableClickAway: true,
    hidePaper: false,
  });
}
