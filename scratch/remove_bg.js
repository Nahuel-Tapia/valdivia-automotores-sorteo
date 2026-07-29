import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const carNames = ['dolphin-white', 'dolphin-green', 'dolphin-black', 'dolphin-blue'];
const inputDir = './public/cars';

async function processImage(name) {
  const filePath = path.join(inputDir, `${name}.png`);
  console.log(`Processing ${name}...`);

  const { data, info } = await sharp(filePath)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  const channels = info.channels;

  const visited = new Uint8Array(width * height);
  const queue = [];

  // Strict check for the flat studio background (196,196,196) and very subtle variations near top/sides/floor
  function isStudioBg(idx, yPos) {
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];

    // Flat background is exactly (196, 196, 196)
    const isExactBg = (Math.abs(r - 196) <= 4 && Math.abs(g - 196) <= 4 && Math.abs(b - 196) <= 4);
    
    // Gradient floor shadow under car: neutral gray (r==g==b) above threshold 150 near bottom
    const isFloorShadow = yPos > height * 0.75 && Math.abs(r - g) <= 3 && Math.abs(g - b) <= 3 && r >= 130 && r <= 196;

    return isExactBg || isFloorShadow;
  }

  // Seed BFS with ALL border pixels around the entire perimeter of the image
  for (let x = 0; x < width; x++) {
    // Top border
    const topIdx = 0 * width + x;
    if (isStudioBg(topIdx * channels, 0)) {
      visited[topIdx] = 1;
      queue.push(topIdx);
    }
    // Bottom border
    const btmIdx = (height - 1) * width + x;
    if (isStudioBg(btmIdx * channels, height - 1)) {
      visited[btmIdx] = 1;
      queue.push(btmIdx);
    }
  }

  for (let y = 0; y < height; y++) {
    // Left border
    const leftIdx = y * width + 0;
    if (!visited[leftIdx] && isStudioBg(leftIdx * channels, y)) {
      visited[leftIdx] = 1;
      queue.push(leftIdx);
    }
    // Right border
    const rightIdx = y * width + (width - 1);
    if (!visited[rightIdx] && isStudioBg(rightIdx * channels, y)) {
      visited[rightIdx] = 1;
      queue.push(rightIdx);
    }
  }

  // BFS Floodfill
  let head = 0;
  while (head < queue.length) {
    const curr = queue[head++];
    const x = curr % width;
    const y = Math.floor(curr / width);

    const neighbors = [];
    if (x > 0) neighbors.push(curr - 1);
    if (x < width - 1) neighbors.push(curr + 1);
    if (y > 0) neighbors.push(curr - width);
    if (y < height - 1) neighbors.push(curr + width);

    for (const n of neighbors) {
      if (!visited[n]) {
        const ny = Math.floor(n / width);
        if (isStudioBg(n * channels, ny)) {
          visited[n] = 1;
          queue.push(n);
        }
      }
    }
  }

  // Set alpha = 0 for all flood-filled background pixels
  for (let i = 0; i < width * height; i++) {
    if (visited[i]) {
      data[i * channels + 3] = 0; // Transparent
    }
  }

  // Save back as transparent PNG
  await sharp(data, {
    raw: { width, height, channels }
  })
    .png()
    .toFile(filePath);

  console.log(`Successfully saved transparent ${name}.png!`);
}

async function run() {
  for (const name of carNames) {
    await processImage(name);
  }
  console.log('All 4 car images are now transparent PNGs!');
}

run().catch(console.error);
