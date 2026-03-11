import React, { useMemo } from "react";
import Svg, { Line, Text as SvgText } from "react-native-svg";

export function ScaleRight({
  height,
  width = 112,
  min,
  max,
  tickStep,
  labelEvery,
  decimals,
  invert = false,
  topOffset = 0,
  bottomOffset = 8,
}: {
  height: number;
  width?: number;
  min: number;
  max: number;
  tickStep: number;
  labelEvery: number;
  decimals: number;
  invert?: boolean;
  topOffset?: number;
  bottomOffset?: number;
}) {
  const denom = max === min ? 1 : max - min;
  const effectiveDrawHeight = Math.max(0, height - topOffset - bottomOffset);
  const padding = 8;
  const innerH = effectiveDrawHeight - padding * 2;
  const ticks = useMemo(() => buildTicksEven(min, max, tickStep), [min, max, tickStep]);
  const tickX1 = 10;
  const tickX2Minor = tickX1 + 14;
  const tickX2Major = tickX1 + 24;
  const labelX = tickX2Major + 10;

  const calculateTickY = (tickNumber: number) => {
    const p = (tickNumber - min) / denom;
    return invert ? padding + innerH * p : padding + innerH * (1 - p);
  };

  const isMin = (tickNumber: number) => Math.abs(tickNumber - min) < 1e-6;
  const isMax = (tickNumber: number) => Math.abs(tickNumber - max) < 1e-6;
  const isZero = (tickNumber: number) => Math.abs(tickNumber) < 1e-6;
  const mustLabel = (tickNumber: number) => isMin(tickNumber) || isMax(tickNumber) || isZero(tickNumber);

  const shouldLabel = (tickNumber: number, index: number) => {
    if (mustLabel(tickNumber)) return true;
    if (!Number.isFinite(labelEvery) || labelEvery <= 1) return true;
    return index % labelEvery === 0;
  };

  return (
    <Svg
      width={width}
      height={effectiveDrawHeight}
      style={{ position: "absolute", right: -20, top: topOffset }}
    >
      {ticks.map((t, index) => {
        const tickNumber = t.tickNumber;
        const y = calculateTickY(tickNumber);

        const alternatingThickness = t.index % 2 === 0;
        const isMajor = mustLabel(tickNumber) || alternatingThickness;

        const label = shouldLabel(tickNumber, index);
        const txt = `${tickNumber.toFixed(decimals)}m`;

        return (
          EvenTicks(index, tickNumber, y, isMajor, label, txt, tickX1, tickX2Minor, tickX2Major, labelX, mustLabel)
        );
      })}
    </Svg>
  );
}

function buildTicksEven(min: number, max: number, requestedStep: number) {
  const range = max - min;
  const safeReq = Number.isFinite(requestedStep) && requestedStep > 0 ? requestedStep : range / 8;

  const count = Math.max(1, Math.round(range / safeReq));
  const step = range / count;

  const ticks: { tickNumber: number; index: number }[] = [];
  for (let i = 0; i <= count; i++) {
    const tickNumber = i === count ? max : min + i * step;
    ticks.push({ tickNumber: tickNumber, index: i });
  }
  return ticks;
}

export function EvenTicks(
  index: number,
  tickNumber: number,
  tickY: number,
  isMajorTick: boolean,
  drawLabel: boolean,
  labelText: string,
  tickX1: number,
  tickX2Minor: number,
  tickX2Major: number,
  labelX: number,
  mustLabel: (tickNumber: number) => boolean
) 
  {
    return (
      <React.Fragment key={`t-${index}-${tickNumber}`}>
        <Line
          x1={tickX1}
          x2={isMajorTick ? tickX2Major : tickX2Minor}
          y1={tickY}
          y2={tickY}
          stroke="rgba(0,0,0,0.55)"
          strokeWidth={isMajorTick ? 5 : 4}
          strokeLinecap="round"
        />
        <Line
          x1={tickX1}
          x2={isMajorTick ? tickX2Major : tickX2Minor}
          y1={tickY}
          y2={tickY}
          stroke={isMajorTick ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.70)"}
          strokeWidth={isMajorTick ? 2.8 : 2.2}
          strokeLinecap="round"
        />

        {drawLabel ? (
          <>
            <SvgText
              x={labelX}
              y={tickY + 4}
              fontSize="12"
              fontWeight={mustLabel(tickNumber) ? "900" : "800"}
              fill="rgba(0,0,0,0.70)"
              textAnchor="start"
            >
              {labelText}
            </SvgText>
            <SvgText
              x={labelX}
              y={tickY + 4}
              fontSize="12"
              fontWeight={mustLabel(tickNumber) ? "900" : "800"}
              fill="rgba(255,255,255,0.98)"
              textAnchor="start"
            >
              {labelText}
            </SvgText>
          </>
        ) : null}
      </React.Fragment>
    )
}