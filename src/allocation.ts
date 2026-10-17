export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;
let allocations = 2;

type shiftResults = {
  allocations: number,
  productOutput: number,
  consumerInput: number,
  totalBalance: number,
}

function updateShift() {
  const productOutput = allocations * 3; // How much money is being made
  const consumerInput = 6; // How much money is being spent
  const totalBalance = productOutput - consumerInput; // Total money
  return {
    allocations,
    productOutput,
    consumerInput,
    totalBalance,
  }
}

function update() {
  const results = updateShift();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i < allocations ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < allocations ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${allocations} / 6`, 18, 76);

  drawPanel("Production", results.productOutput, "#27766b", 102, 110);
  drawPanel("Consumption", results.consumerInput, "#a44d23", 154, 162);

  readout.textContent =
    `Assigned: ${allocations}/6 · Production: ${results.productOutput} · Consumption: ${results.consumerInput} · Balance: ${
      results.totalBalance > 0 ? "+" : ""
    }${results.totalBalance}`;
}

function drawPanel(
  text: string,
  data: number,
  color: string,
  labelY: number,
  rectY: number,
) {
  ctx.fillStyle = "#233e43";
  ctx.fillText(`${text}: ${data}`, 18, labelY);
  ctx.fillStyle = color;
  ctx.fillRect(18, rectY, data * 14, 20);
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  allocations = Math.max(0, allocations - 1);
  update();
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  allocations = Math.min(6, allocations + 1);
  update();
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    allocations = 2;
    update();
  };
update();
