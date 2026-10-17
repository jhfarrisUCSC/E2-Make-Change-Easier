export {};

const canvas = document.querySelector<HTMLCanvasElement>("#counter-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#counter-readout",
)!;
const host = document.querySelector<HTMLDivElement>("#counter-panel-host")!;
const diagnostic = document.querySelector<HTMLParagraphElement>(
  "#counter-diagnostic",
)!;
let panel: HTMLParagraphElement | null = null;
let panelUpdates = 0;

type Shield = {
  current: number;
  maximum: number;
  missing: number;
};

const shieldStats: Shield = {
  current: 0,
  maximum: 10,
  missing: 10,
};

const subscribeOutput = new EventTarget();
let snapshotShield: Shield = { ...shieldStats };

function panelUpdater() {
  snapshotShield = { ...shieldStats };
  snapshotShield.missing = snapshotShield.maximum - snapshotShield.current;
  panelUpdates++;
  diagnostic.textContent = `Inspector deliveries: ${panelUpdates}`;
}

subscribeOutput.addEventListener("updateOutput", drawMeter);

function drawMeter() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 10; i++) {
    ctx.fillStyle = i < snapshotShield.current ? "#27766b" : "#c9d2c9";
    ctx.fillRect(12 + i * 28, 24, 24, 48);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "16px system-ui";
  ctx.fillText(
    `${snapshotShield.current} / ${snapshotShield.maximum} shield`,
    12,
    100,
  );
  readout.textContent =
    `Shield charge: ${snapshotShield.current} / ${snapshotShield.maximum}`;
  if (panel) {
    panel.textContent =
      `Shield charge: ${snapshotShield.current} · Missing charge: ${snapshotShield.missing}`;
  }
}

function setCount(next: number) {
  const bounded = Math.max(0, Math.min(10, next));
  if (bounded === shieldStats.current) return;
  shieldStats.current = bounded;
  shieldStats.missing = shieldStats.maximum - shieldStats.current;
  snapshotShield = { ...shieldStats };
  subscribeOutput.dispatchEvent(new Event("updateOutput"));
}

document.querySelector<HTMLButtonElement>("#counter-less")!.onclick = () => {
  setCount(shieldStats.current - 1);
};
document.querySelector<HTMLButtonElement>("#counter-more")!.onclick = () => {
  setCount(shieldStats.current + 1);
};
document.querySelector<HTMLButtonElement>("#counter-reset")!.onclick = () => {
  setCount(0);
};
document.querySelector<HTMLButtonElement>("#counter-open")!.onclick = () => {
  if (panel) return;
  panel = document.createElement("p");
  host.append(panel);
  subscribeOutput.dispatchEvent(new Event("updateOutput"));
  subscribeOutput.addEventListener("updateOutput", panelUpdater);
};
document.querySelector<HTMLButtonElement>("#counter-close")!.onclick = () => {
  if (!panel) return;
  subscribeOutput.removeEventListener("updateOutput", panelUpdater);
  panel.remove();
  panel = null;
};
drawMeter();
