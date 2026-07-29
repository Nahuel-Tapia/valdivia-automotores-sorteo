import sharp from 'sharp';

async function check() {
  const { data, info } = await sharp('public/cars/dolphin-white.png')
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = info.width;
  const h = info.height;
  const colors = new Map();

  for (let x = 0; x < w; x++) {
    const idx = (0 * w + x) * 4;
    const key = `${data[idx]},${data[idx + 1]},${data[idx + 2]}`;
    colors.set(key, (colors.get(key) || 0) + 1);
  }

  console.log('Top edge color frequencies:', colors);
}

check();
