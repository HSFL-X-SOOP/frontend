import { TFunction } from "i18next";

export const skyBgColor = "#548ef3"
export const waterBgColor = "#0B3D91"
export const crestColor = "rgba(230, 250, 255, 0.64)"
export const waveAnimationDuration = 3200;

type TemperatureZone = "cold" | "cool" | "pleasant" | "warm";

export function zoneForWaterTemperature(waterTemperature: number): TemperatureZone {
  if (waterTemperature < 16) return "cold";
  if (waterTemperature < 22) return "cool";
  if (waterTemperature < 28) return "pleasant";
  if (waterTemperature < 32) return "warm";
  return "warm";
}

export function labelForWaterTemperature(waterTemperatureZone: TemperatureZone, t: TFunction<string, undefined>) {
  switch (waterTemperatureZone) {
    case "cold":
      return t("animatedMeasurementTiles.waterTemperature.cold");
    case "cool":
      return t("animatedMeasurementTiles.waterTemperature.cool");
    case "pleasant":
      return t("animatedMeasurementTiles.waterTemperature.pleasant");
    case "warm":
      return t("animatedMeasurementTiles.waterTemperature.warm");
  }
}


type WaveHeightZone = "calm" | "small" | "moderate" | "high";

export function zoneForWaveHeight(waveHeight: number): WaveHeightZone {
  if (waveHeight < 0.5) return "calm";
  if (waveHeight < 1.0) return "small";
  if (waveHeight < 2.0) return "moderate";
  return "high";
}

export function labelForWaveHeight(waveHeightZone: WaveHeightZone, t: TFunction<string, undefined>) {
  switch (waveHeightZone) {
    case "calm":
      return t("animatedMeasurementTiles.waveHeight.calm");
    case "small":
      return t("animatedMeasurementTiles.waveHeight.small");
    case "moderate":
      return t("animatedMeasurementTiles.waveHeight.moderate");
    case "high":
      return t("animatedMeasurementTiles.waveHeight.high");
  }
}

type WaterLevelZone = "low" | "normal" | "higherThanNormal" | "lowerThanNormal" | "high" | "flooding";

export function zoneForWaterLevel(waterLevel: number): WaterLevelZone {
  if (waterLevel > -0.25 && waterLevel < 0.25) return "normal";
  if (waterLevel > 0.25) return "higherThanNormal";
  if (waterLevel < -1) return "low";
  if (waterLevel < -0.25) return "lowerThanNormal";
  if (waterLevel > 2) return "high";
  return "flooding";
}

export function labelForWaterLevel(waterLevelZone: WaterLevelZone, t: TFunction<string, undefined>) {
  
  switch (waterLevelZone) {
    case "low":
      return t("animatedMeasurementTiles.waterLevel.low");
    case "normal":
      return t("animatedMeasurementTiles.waterLevel.normal");
    case "higherThanNormal":
      return t("animatedMeasurementTiles.waterLevel.higherThanNormal");
    case "lowerThanNormal":
      return t("animatedMeasurementTiles.waterLevel.lowerThanNormal");
    case "high":
      return t("animatedMeasurementTiles.waterLevel.high");
    case "flooding":
      return t("animatedMeasurementTiles.waterLevel.flooding");
  }
}