export const PI = Math.PI;

export function sum(x: number, y: number) {
  return x + y;
}

export function square(x: number) {
  return x * x;
}

export function draw(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  l: number,
  r: number,
  operation: "fill" | "clip",
) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.arc(x + l / 2, y - r + 2, r, 0.72 * PI, 2.26 * PI);
  ctx.lineTo(x + l, y);
  ctx.arc(x + l + r - 2, y + l / 2, r, 1.21 * PI, 2.78 * PI);
  ctx.lineTo(x + l, y + l);
  ctx.lineTo(x, y + l);
  ctx.arc(x + r - 2, y + l / 2, r + 0.4, 2.76 * PI, 1.24 * PI, true);
  ctx.lineTo(x, y);
  ctx.lineWidth = 2;
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
  ctx.stroke();
  ctx[operation]();
  ctx.globalCompositeOperation = "destination-over";
  // ctx.globalCompositeOperation = "xor"; // 卡片不出来是可切换
}

export function createImg(imgs: any[], onload: () => void) {
  const img = document.createElement("img");
  img.crossOrigin = "Anonymous";
  img.onload = onload;
  img.onerror = () => {
    img.src = getRandomImg(imgs);
  };
  img.src = getRandomImg(imgs);
  return img;
}

export function getRandomNumberByRange(start: number, end: number) {
  return Math.round(Math.random() * (end - start) + start);
}

// 随机生成img src
export function getRandomImg(imgs: string[]) {
  const len = imgs.length;
  return len > 0
    ? imgs[getRandomNumberByRange(0, len)]
    : "https://picsum.photos/300/150/?image=" + getRandomNumberByRange(0, 1084);
}
