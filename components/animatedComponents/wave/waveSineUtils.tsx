export function buildTileableSinePointsPath(
  width: number,
  amplitude: number,
  cyclesPerTile: number,
  tileWidth: number,
  baselineY: number
): string {
  const sampleStep = 4;
  const radiansPerPixel = (Math.PI * 2 * cyclesPerTile) / tileWidth;

  let path = `M 0 ${baselineY}`;

  for (let x = 0; x <= width; x += sampleStep) {
    const angle = radiansPerPixel * x;
    const y = baselineY + amplitude * Math.sin(angle);
    path += ` L ${x} ${y}`;
  }

  return path;
}

export function buildTileableSineFillPath(
  drawWidth: number,
  totalHeight: number,
  amplitude: number,
  cyclesPerTile: number,
  tileWidth: number,
  waterLevelY: number
): string {
  const waveTopPath = buildTileableSinePointsPath(
    drawWidth,
    amplitude,
    cyclesPerTile,
    tileWidth,
    waterLevelY
  );

  return [
    waveTopPath,
    `L ${drawWidth} ${totalHeight}`,
    `L 0 ${totalHeight}`,
    "Z",
  ].join(" ");
}

export function buildTileableSineLinePath(
  drawWidth: number,
  amplitude: number,
  cyclesPerTile: number,
  tileWidth: number,
  waterLevelY: number
): string {
  return buildTileableSinePointsPath(
    drawWidth,
    amplitude,
    cyclesPerTile,
    tileWidth,
    waterLevelY
  );
}