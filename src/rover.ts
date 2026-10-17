export {};

const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>("#rover-readout")!;

const queueOutput = document.querySelector<HTMLParagraphElement>(
  "#rover-queue-status",
)!;

let queueMessage = "";

const headings = ["North", "East", "South", "West"];
let x = 2;
let y = 2;
let direction = 0;

const queue: string[] = [];

type Move = {
  name: string;
  x: number;
  y: number;
};

const compass: Move[] = [
  { name: "North", x: 0, y: -1 },
  { name: "East", x: 1, y: 0 },
  { name: "South", x: 0, y: 1 },
  { name: "West", x: -1, y: 0 },
];

function movement(moveType: string) {
  if (moveType == "Rotate") {
    direction = (direction + 1) % 4;
  }
  if (moveType == "Forward") {
    x += compass[direction].x;
    y += compass[direction].y;
  }
}

function drawRover() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#718881";
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 5; column++) {
      ctx.strokeRect(10 + column * 56, 10 + row * 56, 56, 56);
    }
  }
  ctx.save();
  ctx.translate(38 + x * 56, 38 + y * 56);
  ctx.rotate(direction * Math.PI / 2);
  ctx.fillStyle = "#27766b";
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(17, 16);
  ctx.lineTo(-17, 16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  readout.textContent = `Position: (${x}, ${y}) · Facing: ${
    headings[direction]
  }`;
}

document.querySelector<HTMLButtonElement>("#rover-forward")!.onclick = () => {
  queue.push("Forward");
  queueMessage += "[Forward] ";
  queueOutput.textContent = queueMessage;
};
document.querySelector<HTMLButtonElement>("#rover-right")!.onclick = () => {
  queue.push("Rotate");
  queueMessage += "[Rotate] ";
  queueOutput.textContent = queueMessage;
};
document.querySelector<HTMLButtonElement>("#rover-reset")!.onclick = () => {
  x = 2;
  y = 2;
  direction = 0;
  drawRover();
};

document.querySelector<HTMLButtonElement>("#rover-run")!.onclick = () => {
  for (let i = 0; i < (queue.length); i++) {
    const action = queue[i];
    movement(action);
    drawRover();
  }
  emptyQueue();
};

document.querySelector<HTMLButtonElement>("#rover-clear")!.onclick = () => {
  emptyQueue();
};

function emptyQueue() {
  queue.length = 0;
  queueMessage = "";
  queueOutput.textContent = "Empty · queue not implemented";
}

drawRover();
